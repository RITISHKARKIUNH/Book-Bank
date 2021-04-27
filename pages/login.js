import '../configureAmplify';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import SignIn from '../components/profile/signin';
import SignUp from '../components/profile/signup';
import Profile from '../components/profile/profile';
import ForgotPassword from '../components/profile/forgotpassword';
import ForgotPasswordSubmit from '../components/profile/forgotpasswordsubmit';
import ConfirmSignUp from '../components/profile/confirmsignup';
import { useRouter } from 'next/router';
import { Toaster } from '../components/common';

function Login() {
    const router = useRouter();
    const [uiState, setUiState] = useState(null);

    const [formState, setFormState] = useState({
        email: '', password: '', authCode: ''
    });

    const { email, password, authCode } = formState;

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        console.log('checking user...');
        try {
            setUiState('loading');
            await Auth.currentAuthenticatedUser();
            setUiState('signedIn');
        } catch (err) {
            setUiState('signIn');
        }
    }

    function onChange(e) {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    }

    async function signUp() {
        try {
            await Auth.signUp({ username: email, password, attributes: { email } });
            setUiState('confirmSignUp');
        } catch (err) { 
            console.log(err);
            Toaster(err.message, true);
        }
    }

    async function confirmSignUp() {
        try {
            await await Auth.confirmSignUp(email, authCode);
            await Auth.signIn(email, password);
            // setUiState('signedIn');
            router.push('/');
        } catch (err) { 
            console.log({ err }) ;
            Toaster(err.message, true);
        }
    }

    async function signIn() {
        try {
            await Auth.signIn(email, password);
            // setUiState('signedIn');
            router.push('/');
        } catch (err) { 
            console.log({ err });
            Toaster(err.message, true);
        }
    }

    async function forgotPassword() {
        try {
            await Auth.forgotPassword(email);
            setUiState('forgotPasswordSubmit');
        } catch (err) { 
            console.log({ err });
            Toaster(err.message, true);
        }
    }

    async function forgotPasswordSubmit() {
        await Auth.forgotPasswordSubmit(email, authCode, password);
        setUiState('signIn');
    }

    return (
        <div className="application application-offset sidenav-pinned ready">
            <div className="container-fluid container-application">
                <div className="main-content position-relative">
                    <div className="page-content">
                        <div className="min-vh-100 py-5 d-flex align-items-center">
                            <div className="w-100">
                                <div className="row justify-content-center">
                                    <div className="col-sm-8 col-lg-4">
                                        <div className="card shadow zindex-100 mb-0">
                                            <div className="card-body px-md-5 py-5">
                                                <a href="/">
                                                    <i className="fas fa-home" ></i> Homepage
                                                </a>
                                                {
                                                    !uiState || uiState === 'loading' && <p className="font-bold">Loading ...</p>
                                                }
                                                {
                                                    uiState === 'signedIn' && (
                                                        <Profile
                                                            setUiState={setUiState}
                                                            onChange={onChange}
                                                        />
                                                    )
                                                }
                                                {
                                                    uiState === 'signUp' && (
                                                        <SignUp
                                                            setUiState={setUiState}
                                                            onChange={onChange}
                                                            signUp={signUp}
                                                        />
                                                    )
                                                }
                                                {
                                                    uiState === 'confirmSignUp' && (
                                                        <ConfirmSignUp
                                                            setUiState={setUiState}
                                                            onChange={onChange}
                                                            confirmSignUp={confirmSignUp}
                                                        />
                                                    )
                                                }
                                                {
                                                    uiState === 'signIn' && (
                                                        <SignIn
                                                            setUiState={setUiState}
                                                            onChange={onChange}
                                                            signIn={signIn}
                                                        />
                                                    )
                                                }
                                                {
                                                    uiState === 'forgotPassword' && (
                                                        <ForgotPassword
                                                            setUiState={setUiState}
                                                            onChange={onChange}
                                                            forgotPassword={forgotPassword}
                                                        />
                                                    )
                                                }
                                                {
                                                    uiState === 'forgotPasswordSubmit' && (
                                                        <ForgotPasswordSubmit
                                                            setUiState={setUiState}
                                                            onChange={onChange}
                                                            forgotPasswordSubmit={forgotPasswordSubmit}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;