import { button } from "@aws-amplify/ui";
import React from "react";

const ImageUploader = ({ imageUploadHandler, image }) => {
    return (
        <>
            <label htmlFor="book-image" className="btn btn-sm btn-primary btn-icon rounded-pill">
                Select Image
            </label>
            <input id="book-image" className="btn p-0" type="file" onChange={imageUploadHandler} />
            <div className="image-container mt-3 mb-3">
                {image && <img className="rounded d-block img-thumbnail" alt='Uploaded Image' src={URL.createObjectURL(image)} />}
            </div>
        </>
    );
}

export default ImageUploader;