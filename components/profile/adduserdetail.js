import React, { useState, useRef } from "react";
import { Input } from '../common';
import { createUser } from '../../graphql/mutations';
import { API } from "@aws-amplify/api";
import { Storage } from "@aws-amplify/storage";
import { v4 as uuid } from "uuid";

const AddUserDetail = ({ user }) => {
    console.log(user);
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [description, setDescription] = useState('');
    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState(null);

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!image) return;

            let key = null;

            if (image) {
                const fileName = `${image.name}_${uuid()}`;
                key = fileName;
                await Storage.put(fileName, image);
            }


            const result = await API.graphql({
                query: createUser,
                variables: {
                    input: {
                        id: user.attributes.sub,
                        image: key,
                        firstName: firstName,
                        lastName: secondName,
                        description: description,
                        phoneNumber: phoneNumber
                    },
                },
            });
            console.log(result);

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
    };

    return (
        <div className="page-content">
            <div className="page-title">
                <h4 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Add your Profile Details</h4>
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
                            image && (
                                <img src={URL.createObjectURL(image)} className="my-4" />
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
                            Add Profile
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUserDetail;