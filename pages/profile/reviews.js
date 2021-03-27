import WithProfileLayout from '../../hoc/withprofilelayout';

function BookReviews() {
    return (
        <>
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Book review compnent</h1>
                </div>
                <div className="container">
                    <a href="/profile/addbook" className="btn  btn-lg btn-info btn-icon rounded-pill">add a new review</a>
                </div>
            </div>
        </>
    )
}

export default WithProfileLayout(BookReviews);