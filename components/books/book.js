function Book({ book }) {
    return (
        <div className="col-lg-3 col-sm-6">
            <div className="card card-product">
                <div className="card-header border-0">
                    <h2 className="h6">
                        <a href="#">{book.title}</a>
                    </h2>
                </div>
                {/* <!-- Product image --> */}
                <figure className="figure">
                    <img alt="Image placeholder" src={book.thumbnailUrl} className="img-center img-fluid" />
                </figure>
                <div className="card-body">
                    {/* <!-- Price --> */}
                    <div className="d-flex align-items-center mt-4">
                        <span className="h6 mb-0">$49 USD</span>
                        <span className="badge badge-warning rounded-pill ml-auto">Last 7</span>
                    </div>
                </div>
                <div className="p-4 border-top">
                    <div className="row">
                        <div className="col-6 text-center">
                            <span className="h5 mb-0">47</span><sup>%</sup>
                            <span className="d-block text-sm">Last week</span>
                        </div>
                        <div className="col-6 text-center">
                            <span className="h5 mb-0">18</span><sup>%</sup>
                            <span className="d-block text-sm">Last month</span>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="actions d-flex justify-content-between">
                        <a href="#" className="action-item">
                            <i className="far fa-star"></i>
                        </a>
                        <a href="#" className="action-item">
                            <i className="far fa-chart-pie"></i>
                        </a>
                        <a href="#" className="action-item text-danger">
                            <i className="far fa-trash-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Book;