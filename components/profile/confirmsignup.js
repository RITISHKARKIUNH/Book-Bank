import { Input } from '../common';
import { useState } from 'react';

function ConfirmSignUp({ setUiState, onChange, confirmSignUp }) {
    const [authFocused, setAuthFocused] = useState(false);
    return (
        <>
            <div className="mb-4">
                <h6 className="h3">Confirm Sign Up</h6>
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

            <div className="mt-4 mb-4">
                <button onClick={() => confirmSignUp()} type="button" className="btn btn-sm btn-primary btn-icon rounded-pill">
                    <span className="btn-inner--text">Sign Up</span>
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

export default ConfirmSignUp;