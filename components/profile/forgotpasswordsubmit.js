import {Input} from '../common';
import { useState } from 'react';

function FogotPasswordSubmit({ setUiState, onChange, forgotPasswordSubmit }) {
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [authFocused, setAuthFocused] = useState(false);
    return (
        <>
            <div className="mb-4">
                <h6 className="h3">Reset Password</h6>
                <p className="text-muted mb-0">Enter confirmation code sent to your email</p>
            </div>
            <span className="clearfix"></span>

            <div className={`form-group ${authFocused ? 'focused' : ''}`}>
                <label className="form-control-label">Confirmation Code</label>
                <div className="input-group">
                    <Input
                        type="text"
                        onChange={onChange}
                        name="authCode"
                        onFocus={() => setAuthFocused(true)}
                        onBlur={() => setAuthFocused(false)}
                    />
                </div>
            </div>

            <div className={`form-group mb-4 ${passwordFocused ? 'focused' : ''}`}>
                <label className="form-control-label"> New Password</label>
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
                <button onClick={() => forgotPasswordSubmit()} type="button" className="btn btn-sm btn-primary btn-icon rounded-pill">
                    <span className="btn-inner--text">Reset Password</span>
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

export default FogotPasswordSubmit;