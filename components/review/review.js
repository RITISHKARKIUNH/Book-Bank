import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { StarRating } from '../common';
import { formatDate } from '../../lib/utils';
import { Picture } from '../common';
import { getUser } from '../../graphql/queries';
function Review({ review }) {
    const [picture, setPicture] = useState(null);
    useEffect(() => {
        getUserPicture();
    }, []);

    async function getUserPicture() {
        const response = await API.graphql({
            query: getUser,
            variables: { id: review.username }
        });
        if (response) { setPicture(response.data.getUser.image); }
    }

    return (
        <div className="review">
            <div className="user">
                {picture && <Picture path={picture} style={{ width: "35px", height: "35px", borderRadius: "50%" }} alt="review image" className="rounded-circle mr-1 shadow" />}
                {/* {!picture && <i className="fas fa-user-circle" />} */}
                User : {review.name ? review.name : review.username}
            </div>
            <div className="title">
                <StarRating
                    numberOfStars="5"
                    currentRating={review.score}
                />
                <h5>{review.title}</h5>
            </div>
            <div className="date">
                {formatDate(review.createdAt)}
            </div>
            <div className="description">
                <p>{review.description}</p>
            </div>
            {
                review.picture && <div className="picture" style={{ width: "50%" }}>
                    <Picture path={review.picture} alt="review image" className="rounded img-thumbnail mb-3" />
                </div>
            }

        </div>
    )
}
export default Review;