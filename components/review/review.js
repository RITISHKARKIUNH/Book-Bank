import { StarRating } from '../common';
import { formatDate } from '../../lib/utils';
import { Picture } from '../common';
function Review({ review }) {
    return (
        <div className="review">
            <div className="user">
                <i className="fas fa-user-circle" />
                User Id: {review.username}
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
                review.picture && <div className="picture">
                    <Picture path={review.picture} alt="review image" className="rounded img-thumbnail mb-3" />
                </div>
            }

        </div>
    )
}
export default Review;