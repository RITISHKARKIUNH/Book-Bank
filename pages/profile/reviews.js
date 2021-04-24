import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { useForm } from "react-hook-form";
import { StarRating, Picture, Toaster, ImageUploader } from '../../components/common';
import { v4 as uuid } from 'uuid';
import { updateReview, updateUserRating } from '../../graphql/mutations';
import { reviewsByUser, overallReviewsForBook } from '../../graphql/queries';
import Review from '../../components/review/review';
import { sortArrayOfObjectsByDate } from '../../lib/utils';
import WithProfileLayout from '../../hoc/withprofilelayout';

function UserReviewView({ user, onEdit }) {
    const [userReviews, setUserReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [sortAscending, setSorting] = useState(true);

    useEffect(() => {
        fetchUserReviews();
    }, []);

    useEffect(() => {
        toggleReviewSort();
    }, [sortAscending]);

    function toggleReviewSort() {
        const sorted = sortArrayOfObjectsByDate(userReviews, 'createdAt', sortAscending);
        setUserReviews(sorted);
    }

    async function fetchUserReviews() {
        const { username } = user;
        console.log(username, typeof (username));
        const response = await API.graphql({
            query: reviewsByUser, variables: { username }
        });
        const { items } = response.data.reviewsByUser;
        const sorted = sortArrayOfObjectsByDate(items, 'createdAt', sortAscending);
        setUserReviews(sorted);
        setReviewLoading(false);
    }

    return (
        <>
            <div className="page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Book reviews</h1>
                    {
                        userReviews && userReviews.length > 0 &&
                        <button style={{ height: "45px" }} className="btn btn-sm btn-info btn-icon rounded-pill" onClick={() => setSorting(!sortAscending)}>Sort {sortAscending ? ' by newest first' : ' by oldest first'}</button>
                    }
                </div>
                <div className="container">
                    {reviewLoading && <h4> ... loading </h4>}
                    {!reviewLoading && (!userReviews || userReviews.length === 0 ) && <h4> You haven't added any book reviews yet </h4>}
                    {
                        userReviews && userReviews.length > 0 && userReviews.map(review => {
                            return (
                                <div className="card mt-1 p-3" key={review.id}>
                                    <Review review={review} />
                                    <button style={{ height: "45px", width: "115px" }} className="btn btn-sm btn-info btn-icon rounded-pill" onClick={() => onEdit(review)}>edit review</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

async function updateBookRating(oldRating, newRating) {
    console.log(oldRating, newRating);
    try {
        const { isbn } = oldRating;
        const bookData = await API.graphql({
            query: overallReviewsForBook, variables: { isbn }
        });
        const { items } = bookData.data.overallReviewsForBook;
        let overAllReview = items[0];

        // delete the properties auto created by dynamoDB
        if(overAllReview.createdAt) delete overAllReview.createdAt;
        if(overAllReview.updatedAt) delete overAllReview.updatedAt;

        const newTotalScore = (parseFloat(overAllReview.totalRatingScore) * overAllReview.totalRating) - parseFloat(oldRating.score) + parseFloat(newRating.score);
        overAllReview.totalRatingScore = parseFloat(newTotalScore / overAllReview.totalRating).toFixed(1);
        console.log("Total Rating score",parseFloat(overAllReview.totalRatingScore),"\n total rating no",overAllReview.totalRating, '\n old rating',oldRating.score, '\n new score',newRating.score, '\n new total', newTotalScore, overAllReview);
        const response = await API.graphql({
            query: updateReview,
            variables: { input: overAllReview }
        });
        if (response && response.data) {
            Toaster('Review sucessfully edited');
            // window.location.reload();
        }
        return response;
    } catch (e) {
        Toaster('Problem in updating overall review', true);
        return e;
    }
}

function EditReviewView({ review, onReviewEdited }) {
    console.log(review);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [rating, setRating] = useState(review.score);
    const [editingReview, setEditingReview] = useState(false);
    const [image, setImage] = useState(null);

    const onSubmit = async (data, e) => {
        console.log(data);
        let { title, description } = data;
        let updatedReview = {};
        updatedReview.id = review.id;
        updatedReview.title = title;
        updatedReview.description = description;
        updatedReview.score = rating;
        updatedReview.picture = review.picture;
        updatedReview.isbn = review.isbn;

        if (!title || !description || rating === 0) {
            Toaster('Required data for review are missing', true);
            return;
        }
        let key = review.picture;

        try {

            if (image) {
                const fileName = `${image.name}_${uuid()}`;
                key = fileName;
                if (review.picture) await Storage.remove(review.picture);
                await Storage.put(fileName, image, {
                    contentType: image.type,
                });
            }
            updatedReview.picture = key;

            const response = await API.graphql({
                query: updateUserRating,
                variables: { input: updatedReview },
                authMode: "AMAZON_COGNITO_USER_POOLS"
            });

            if (response.data) {
                const updatedBookResponse = await updateBookRating(review, updatedReview);
                onReviewEdited(updatedBookResponse);
            }
        } catch (e) {
            console.log(e);
            Toaster(e.message, true);
        }
    }

    function handleChange(e) {
        e.stopPropagation();
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;
        setImage(fileUploaded);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h3>Edit Review</h3>
                <form className="book-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-control-label">Book Rating : {review.score}/5</label>
                        <div className="input-group">
                            <StarRating
                                numberOfStars="5"
                                currentRating={review.score}
                                onClick={(value) => setRating(value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-control-label">Title</label>
                        <div className="input-group">
                            <input defaultValue={review.title} placeholder="title" className="form-control" {...register("title", { required: "Title is required" })} />
                            {errors.title && <span className="text-danger">{errors.title.message}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-control-label">Description</label>
                        <div className="input-group">
                            <textarea defaultValue={review.description} placeholder="description" className="form-control" {...register("description", { required: "Description is required" })} />
                            {errors.description && <span className="text-danger">{errors.description.message}</span>}
                        </div>
                    </div>

                    <ImageUploader
                        imageUploadHandler={handleChange}
                        image={image}
                    />

                    {!image && review.picture && <div className="mb-3"><Picture path={review.picture} alt={review.title} className="rounded img-thumbnail" style={{width:"50%"}}/></div>}

                    <button type="submit" className="btn btn-sm btn-primary btn-icon rounded-pill">edit review</button>
                </form>
            </div>
        </div>
    )
}

function BookReviews({ user }) {
    if (!user) return null;
    const [currentlyEditingReview, setCurrent] = useState(null);

    function onEdit(review) {
        setCurrent(review);
    }

    function onReviewEdited(editedReview) {
        console.log(editedReview);
        setCurrent(null);
    }

    if (currentlyEditingReview) {
        return <EditReviewView review={currentlyEditingReview} onReviewEdited={onReviewEdited} />
    } else {
        return <UserReviewView user={user} onEdit={onEdit} />
    }

}

export default WithProfileLayout(BookReviews);