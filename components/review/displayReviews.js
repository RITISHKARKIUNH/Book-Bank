import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { reviewsByIsbn } from '../../graphql/queries';
import Review from './review';
import { sortArrayOfObjectsByDate } from '../../lib/utils';

function DisplayReviews(isbn) {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [sortAscending, setSorting] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        toggleReviewSort();
    }, [sortAscending]);

    async function fetchReviews() {
        const response = await API.graphql({
            query: reviewsByIsbn, variables: isbn
        });
        const { items } = response.data.reviewsByIsbn;
        const sorted = sortArrayOfObjectsByDate(items, 'createdAt', sortAscending);
        setReviews(sorted);
        setLoading(false);
    }

    function toggleReviewSort() {
        const sorted = sortArrayOfObjectsByDate(reviews, 'createdAt', sortAscending);
        setReviews(sorted);
    }

    if (loading) return <h4>...loading</h4>
    if (!loading && (!reviews || reviews.length === 0)) return <h4> No reviews yet </h4>
    if (!loading && reviews.length > 0) {
        return (
            <div>
                <div className="reviews-header">
                    <h3>User Reviews</h3>
                    <button className="btn btn-default" onClick={() => setSorting(!sortAscending)}>Sort {sortAscending ? ' by newest first' : ' by oldest first'}</button>
                </div>
                {
                    reviews.map(review => {
                        return <Review key={review.id} review={review} />
                    })
                }
            </div>
        )
    }
}
export default DisplayReviews;