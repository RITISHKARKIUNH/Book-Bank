import React, { useState, useEffect, useRef } from "react";
import { createUser, updateUser } from '../../graphql/mutations';
import { API, facebookSignInButton, Storage } from 'aws-amplify';
import { v4 as uuid } from "uuid";
import Select from 'react-select';

import { Input, Toaster } from '../common';
import { makeCategoryOptions, createOption } from '../../lib/commondata';
const selectStyle = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? '1px solid rgba(110, 0, 255, 0.5)' : '1px solid #e0e6ed',
        boxShadow: state.isFocused ? 'inset 0 1px 1px rgb(31 45 61 / 8%), 0 0 20px rgb(110 0 255 / 10%)' : 'inset 0 1px 1px rgb(31 45 61 / 8%)',
        height: "50px"
    })
};

const AddUserDetail = ({ user, mode, onToastEvent }) => {
    const { profile } = user;
    const [firstName, setFirstName] = useState(mode === 'add' ? '' : profile ? profile.firstName : '');
    const [secondName, setSecondName] = useState(mode === 'add' ? '' : profile ? profile.lastName : '');
    const [phoneNumber, setPhoneNumber] = useState(mode === 'add' ? '' : profile ? profile.phoneNumber : '');
    const [email, setEmail] = useState(mode === 'add' ? '' : profile ? profile.email : '');
    const [description, setDescription] = useState(mode === 'add' ? '' : profile ? profile.description : '');
    const [localImage, setLocalImage] = useState(null);
    const [interests, setInterests] = useState(mode === 'add' ? null : profile?.interest ? profile.interest.map(cat => createOption(cat)) : null);
    const [upadtingProfile, setUpdatingProfile] = useState(false);
    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        console.log(mode, profile);
        if (mode !== 'add' && profile.image) {
            fetchUserImage();
        }
    }, [mode]);

    async function fetchUserImage() {
        const image = await Storage.get(profile.image);
        if (image) {
            setImage(image);
        }
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        setUpdatingProfile(true);
        try {
            let key = profile && profile.image ? profile.image : '';
            let exractedInterests = [];
            if (interests && interests.length > 0) {
                interests.forEach(c => {
                    console.log(c);
                    exractedInterests.push(c.label)
                });
            }

            if(firstName.length === 0 || secondName.length === 0 || email.length === 0 || phoneNumber.length === 0 || description.length === 0){
                Toaster('Required data for user profile are missing', true);
                setUpdatingProfile(false);
                return;
            }

            if (image && localImage) {
                const fileName = `${image.name}_${uuid()}`;
                key = fileName;
                if (profile && profile.image) await Storage.remove(profile.image);
                await Storage.put(fileName, image, {
                    contentType: image.type,
                });
            }


            const result = await API.graphql({
                query: mode === 'add' ? createUser : updateUser,
                variables: {
                    input: {
                        id: user.username,
                        image: key,
                        firstName: firstName,
                        lastName: secondName,
                        description: description,
                        phoneNumber: phoneNumber,
                        email: email,
                        interest: exractedInterests
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS"
            });


            if (result && result.errors && result.errors.length > 0) {
                onToastEvent({
                    message: 'Could not update user information',
                    mode: 'error'
                });
            } else {
                onToastEvent({
                    message: 'User information sucessfully updated',
                    mode: 'success'
                });
            }
            setUpdatingProfile(false);
        } catch (e) {
            console.log(e);
            onToastEvent({
                message: "Opps something went wrong",
                mode: 'error'
            });
            setUpdatingProfile(false);
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
                            <label className="form-control-label">First Name *</label>
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
                            <label className="form-control-label">Last Name *</label>
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
                            <label className="form-control-label">Phone Number *</label>
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
                            <label className="form-control-label">Contact Email *</label>
                            <div className="input-group">
                                <Input
                                    type="text"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                    placeholder="email"
                                    value={email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-control-label">Your Interests *</label>
                            <div className="input-group">
                                <Select
                                    isMulti
                                    className="bookbank-select"
                                    onChange={setInterests}
                                    options={makeCategoryOptions()}
                                    placeholder="select interests"
                                    required
                                    defaultValue={interests}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>


                        <div className="form-group">
                            <label className="form-control-label">Description *</label>
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
                            image &&
                            <div className="form-group">
                                <label className="form-control-label">Profile Image</label>
                                <img src={localImage ? localImage : image} className="mt-4 rounded d-block img-thumbnail" />
                            </div>
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
                            disabled={upadtingProfile}
                        >
                            {mode === 'add' ? upadtingProfile ? 'Adding' : 'Add' : upadtingProfile ? 'Editing' : 'Edit'} Profile
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUserDetail;