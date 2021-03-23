import { Input } from '../common';
import SocialSignIn from './SocialSignIn';
import { useState } from 'react';

function SignIn({
    setUiState, onChange, signIn
}) {
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    return (
        <>
            <div className="mb-4">
                <h6 className="h3">Login</h6>
                <p className="text-muted mb-0">Sign in to your account to continue.</p>
            </div>
            <span className="clearfix"></span>
            <div className={`form-group ${emailFocused ? 'focused' : ''}`}>
                <label className="form-control-label">Email</label>
                <div className="input-group input-group-merge">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <Input
                        type="email"
                        placeholder="name@example.com"
                        onChange={onChange}
                        name="email"
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                    />
                </div>
            </div>

            <div className={`form-group mb-4 ${passwordFocused ? 'focused' : ''}`}>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <label className="form-control-label">Password</label>
                    </div>
                    <div className="mb-2">
                        <span role="button" onClick={() => setUiState('forgotPassword')} className="small text-muted text-underline--dashed border-primary">Forgot your password?</span>
                    </div>
                </div>
                <div className="input-group input-group-merge">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                    </div>
                    <Input
                        type="password"
                        name="password"
                        onChange={onChange}
                        placeholder="Password"
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                    />
                </div>
            </div>

            <div className="mt-4 mb-4">
                <button onClick={signIn} type="button" className="btn btn-sm btn-primary btn-icon rounded-pill">
                    <span className="btn-inner--text">Sign in</span>
                    <span className="btn-inner--icon"><i className="fas fa-long-arrow-alt-right"></i></span>
                </button>
            </div>

            <SocialSignIn />

            <div className="card-footer pb-0">
                <small>Not registered?</small>
                <span
                    onClick={() => setUiState('signUp')}
                    role="button"
                    className="small font-weight-bold text-primary ml-1"
                >
                    Create Account
                </span>
            </div>
        </>
    )
}

export default SignIn;