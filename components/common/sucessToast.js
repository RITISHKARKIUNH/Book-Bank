function SucessToast({ message }) {
    return (
        <div className="custom-toast">
            <div className="left">
                <img className="white-image" src="/logo.png" alt="book bank" />
            </div>
            <div className="right">
                <h5> Operation sucessfull !</h5>
                <p>{message}</p>
            </div>
        </div>
    )
}
export default SucessToast;