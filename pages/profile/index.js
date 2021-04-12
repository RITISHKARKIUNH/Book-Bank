import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddUserDetail from '../../components/profile/adduserdetail';
import WithProfileLayout from '../../hoc/withprofilelayout';
import { Picture } from '../../components/common';
import { SucessToast, ErrorToast } from '../../components/common';

function UserDetail({ user, onEditUser }) {
    return (
        <div className="page-content">
            <div className="page-title">
                <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Hi {user.profile.firstName} {user.profile.lastName}</h1>
            </div>
            <div className="card">
                <div className="card-body">

                    <div className="form-group">
                        <label className="form-control-label">Phone Number</label>
                        <div className="input-group">
                            <h4 role="button"><i className="fa fa-mobile" /> {user.profile.phoneNumber}</h4>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-control-label">About yourself</label>
                        <div className="input-group">
                            <h4 role="button">{user.profile.description}</h4>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-control-label">Profile Image</label>
                        <div className="input-group">
                            {
                                user.profile.image && <Picture style={{ width: "300px", height: "300px", objectFit: "cover" }} path={user.profile.image} className="rounded d-block img-thumbnail" />
                            }
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <button className="btn btn-info btn-lg mt-2" onClick={() => onEditUser()}> Edit Info</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Profile({ user }) {
    if (!user) return null;
    const [profileMode, setProfileMode] = useState('add');

    const onToastEvent = event => {
        if (event.mode === "success") {
            console.log(event);
            toast.info(<SucessToast message={event.message} />, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => window.location.reload()
            });

        } else {
            console.log(event);
            toast.error(<ErrorToast message={event.message} />, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    useEffect(() => {
        console.log(user.profile);
        if (user.profile) {
            setProfileMode('display');
        } else {
            setProfileMode('add');
        }
    }, [user.profile]);

    function onEditUser() {
        setProfileMode('edit');
    }

    if (profileMode === 'display') {
        return <UserDetail user={user} onEditUser={onEditUser} />
    } else {
        return <AddUserDetail user={user} mode={profileMode} onToastEvent={onToastEvent} />
    }
}


export default WithProfileLayout(Profile);