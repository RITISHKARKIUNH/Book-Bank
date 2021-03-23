import { Auth } from 'aws-amplify'

function SocialSignIn() {
    return (
        <div className="flex flex-col">
            <button type="button" className="btn btn-block btn-google-plus btn-icon-label mb-2" onClick={() => Auth.federatedSignIn({ provider: 'Google' })}>
                <span className="btn-inner--icon">
                    <i style={{ position: "absolute" }} className="fab fa-google-plus-g"></i>
                </span>
                <span className="btn-inner--text">Sign in with Google</span>
            </button>

            <button type="button" className="btn btn-block btn-facebook btn-icon-label" onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}>
                <span className="btn-inner--icon">
                    <i style={{ position: "absolute" }} className="fab fa-facebook"></i>
                </span>
                <span className="btn-inner--text">Sign in with Facebook</span>
            </button>
        </div>
    )
}

export default SocialSignIn;