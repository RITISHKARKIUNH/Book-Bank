function ErrorToast({ message }) {
    return (
        <div className="custom-toast error">
            <div className="left">
                <img className="white-image" src="/logo.png" alt="book bank" />
            </div>
            <div className="right">
                <p>{message}</p>
            </div>
        </div>
    )
}
export default ErrorToast;