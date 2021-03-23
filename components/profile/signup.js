import { Input } from '../common';
import { useState } from 'react';

function SignUp({
    setUiState, signUp, onChange
}) {
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    return (
        <>
            <div className="mb-4">
                <h6 className="h3">Sign Up</h6>
                <p className="text-muted mb-0">Sign up for an account</p>
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
                <label className="form-control-label">Password</label>
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
                <button onClick={signUp} type="button" className="btn btn-sm btn-primary btn-icon rounded-pill">
                    <span className="btn-inner--text">Sign Up</span>
                    <span className="btn-inner--icon"><i className="fas fa-long-arrow-alt-right"></i></span>
                </button>
            </div>

            <div className="card-footer pb-0">
                <small>Already have an account?</small>
                <span
                    onClick={() => setUiState('signIn')}
                    role="button"
                    className="small font-weight-bold text-primary ml-1"
                >
                    Sign In
                </span>
            </div>
        </>
    )
}

export default SignUp;