import ProfileLayout from "../../components/profile/profileLayout";

function FavoriteBooks() {
    return (
        <ProfileLayout>
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Favorite compnent</h1>
                </div>
                <div className="container">
                    <a href="/profile/addbook" className="btn  btn-lg btn-primary btn-icon rounded-pill">add a new book</a>
                </div>
            </div>
        </ProfileLayout>
    )
}

export default FavoriteBooks;