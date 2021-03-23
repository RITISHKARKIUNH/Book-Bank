import { Input } from '../common';
import { useState } from 'react';

function FogotPassword({ setUiState, onChange, forgotPassword }) {
    const [emailFocused, setEmailFocused] = useState(false);

    return (
        <>
            <div className="mb-4">
                <h6 className="h3">Forgot Password?</h6>
                <p className="text-muted mb-0">Password reset link will be sent to your email</p>
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
            <div className="mt-4 mb-4">
                <button onClick={() => forgotPassword()} type="button" className="btn btn-sm btn-primary btn-icon rounded-pill">
                    <span className="btn-inner--text">Continue</span>
                    <span className="btn-inner--icon"><i className="fas fa-long-arrow-alt-right"></i></span>
                </button>
                <button
                    onClick={() => setUiState('signIn')}
                    className="btn btn-sm btn-danger btn-icon rounded-pill"
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default FogotPassword;