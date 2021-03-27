import React, { useState, useRef } from "react";
import { Input } from '../common';
import { createUser, updateUser } from '../../graphql/mutations';
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from "uuid";
import { Picture } from '../../components/common';

const AddUserDetail = ({ user, mode }) => {
    const { profile } = user;
    const [firstName, setFirstName] = useState(mode === 'add' ? '' : profile ? profile.firstName : '');
    const [secondName, setSecondName] = useState(mode === 'add' ? '' : profile ? profile.lastName : '');
    const [phoneNumber, setPhoneNumber] = useState(mode === 'add' ? '' : profile ? profile.phoneNumber : '');
    const [description, setDescription] = useState(mode === 'add' ? '' : profile ? profile.description : '');
    const [localImage, setLocalImage] = useState(null);
    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState(null);

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            let key = null;

            if (user.image) {
                await Storage.remove(user.image);
            }

            if (image) {
                const fileName = `${image.name}_${uuid()}`;
                key = fileName;
                await Storage.put(fileName, image, {
                    contentType: image.type,
                });
            }


            const result = await API.graphql({
                query: mode === 'add' ? createUser : updateUser,
                variables: {
                    input: {
                        id: user.attributes.sub,
                        image: key,
                        firstName: firstName,
                        lastName: secondName,
                        description: description,
                        phoneNumber: phoneNumber,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS"
            });

            if (result && result.errors && result.errors.length > 0) {
                console.log(result);
            } else {
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function uploadImage() {
        hiddenFileInput.current.click();
    };

    function handleChange(e) {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;
        setImage(fileUploaded);
        setLocalImage(URL.createObjectURL(fileUploaded));
    };

    return (
        <div className="page-content">
            <div className="page-title">
                <h4 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">{mode === 'add' ? 'Add' : 'Edit'} your profile details</h4>
            </div>
            <div className="container">
                <div className="card">
                    <div className="card-body">

                        <div className="form-group">
                            <label className="form-control-label">First Name</label>
                            <div className="input-group">
                                <Input
                                    type="text"
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                    }}
                                    placeholder="First Name"
                                    value={firstName}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-control-label">Last Name</label>
                            <div className="input-group">
                                <Input
                                    type="text"
                                    onChange={(event) => {
                                        setSecondName(event.target.value);
                                    }}
                                    placeholder="Last Name"
                                    value={secondName}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-control-label">Phone Number</label>
                            <div className="input-group">
                                <Input
                                    type="text"
                                    onChange={(event) => {
                                        setPhoneNumber(event.target.value);
                                    }}
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-control-label">Description</label>
                            <div className="input-group">
                                <textarea
                                    value={description}
                                    className="form-control"
                                    placeholder="Enter your profile overview"
                                    rows="3"
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        {
                            !image && user?.profile?.image &&
                            <div className="form-group">
                                <label className="form-control-label">Profile Image</label>
                                <div className="input-group">
                                    <Picture style={{ width: "300px", height: "300px", objectFit: "cover" }} path={user.profile.image} className="rounded d-block img-thumbnail" />
                                </div>
                            </div>
                        }


                        {
                            image && (
                                <div className="form-group">
                                    <label className="form-control-label">Profile Image</label>
                                    <div className="input-group">
                                        <img style={{ width: "300px", height: "300px", objectFit: "cover" }} src={URL.createObjectURL(image)} className="rounded d-block img-thumbnail" />
                                    </div>
                                </div>
                            )
                        }

                        <input
                            type="file"
                            ref={hiddenFileInput}
                            style={{ position: "absolute", height: 0, width: 0 }}
                            onChange={handleChange}
                        />

                        <div className="mb-3">
                            <button
                                className="btn btn-lg btn-secondary"
                                onClick={uploadImage}
                            >
                                Upload profile
                        </button>
                        </div>

                        <button
                            type="button"
                            className="btn btn-lg btn-primary btn-icon rounded-pill"
                            onClick={submitHandler}
                        >
                            {mode === 'add' ? 'Add' : 'Edit'} Profile
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUserDetail;