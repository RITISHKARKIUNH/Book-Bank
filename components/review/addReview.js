import { useState } from 'react';
import { useForm } from "react-hook-form";
import { API, Storage } from 'aws-amplify';
import { StarRating, Toaster, ImageUploader } from '../common';
import { v4 as uuid } from 'uuid';
import { createUserRating, updateReview } from '../../graphql/mutations';

function AddReview({ userId, overAllReview, isbn }) {
    console.log(userId, overAllReview);
    if (!userId || !overAllReview || !isbn) return null;
    const [rating, setRating] = useState(0);
    const [uploadingReview, setUploadingReview] = useState(false);
    const [image, setImage] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    function resetForm(e) {
        //reset the form after adding review
        e.target.reset();
        setImage(null);
        setRating(0);
    }

    const onSubmit = async (data, e) => {
        setUploadingReview(true);
        let { title, description } = data;
        const id = uuid();
        let review = {};
        review.id = id;
        review.title = title;
        review.description = description;
        review.score = rating;
        review.username = userId;
        review.isbn = isbn;

        if (!title || !description || rating === 0 || !isbn) {
            Toaster('Required data for review are missing', true);
            resetForm(e);
            return;
        }

        try {
            // If there is an image uploaded, store it in S3 and add it to the book metadata
            if (image) {
                const fileName = `${image.name}_${uuid()}`;
                review.picture = fileName;
                await Storage.put(fileName, image);
            }
            const response = await API.graphql({
                query: createUserRating,
                variables: { input: review },
                authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            if (response.data && response.data.createUserRating) {
                setUploadingReview(false);
                updateBookRating(response.data.createUserRating);
            }
        } catch (err) {
            Toaster(err.message, true);
        }

        resetForm(e);
    }

    async function updateBookRating(rating) {
        try {
            let updatedReviews = overAllReview;
            if (updatedReviews.createdAt) delete updatedReviews.createdAt;
            if (updatedReviews.updatedAt) delete updatedReviews.updatedAt;

            if (updatedReviews) {
                updatedReviews.totalRating += 1;
                updatedReviews.totalRatingScore = ((parseFloat(updatedReviews.totalRatingScore) * updatedReviews.totalRating) + rating.score) / updatedReviews.totalRating;
                updatedReviews.totalRatingScore = parseFloat(updatedReviews.totalRatingScore).toFixed(1);
                const response = await API.graphql({
                    query: updateReview,
                    variables: { input: updatedReviews }
                });

                if (response && response.data) {
                    Toaster('Review sucessfully added');
                    window.location.reload();
                }
            }
        } catch (e) {
            Toaster('Problem in updating overall review', true);
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
                <h3>Add Review</h3>
                <form className="book-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-control-label">Book Rating : {rating}/5</label>
                        <div className="input-group">
                            <StarRating
                                numberOfStars="5"
                                currentRating={rating}
                                onClick={(value) => setRating(value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-control-label">Title</label>
                        <div className="input-group">
                            <input placeholder="title" className="form-control" {...register("title", { required: "Title is required" })} />
                            {errors.title && <span className="text-danger">{errors.title.message}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-control-label">Description</label>
                        <div className="input-group">
                            <textarea placeholder="description" className="form-control" {...register("description", { required: "Description is required" })} />
                            {errors.description && <span className="text-danger">{errors.description.message}</span>}
                        </div>
                    </div>

                    <ImageUploader
                        imageUploadHandler={handleChange}
                        image={image}
                    />

                    <button type="submit" className="btn btn-sm btn-primary btn-icon rounded-pill">{uploadingReview ? 'Adding Review' : 'Add Review'}</button>
                </form>
            </div>
        </div>
    )
}

export default AddReview;