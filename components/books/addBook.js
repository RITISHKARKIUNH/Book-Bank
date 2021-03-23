import { useState, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createBook } from '../../graphql/mutations';
import { Input } from '../common';


const initialState = {
    title: '',
    description: '',
    category: ['other'],
    isbn: '',
    author: ['John Doe'],
    condition: '',
    price: '',
    publication: '',
    picture: ''
}

function AddBook() {
    const [book, setBook] = useState(initialState);
    const [image, setImage] = useState(null);
    const hiddenFileInput = useRef(null);
    const { title, description, isbn, condition, price, publication, category, author } = book;
    const router = useRouter();

    function onChange(e) {
        setBook(() => ({ ...book, [e.target.name]: e.target.value }));
    }

    async function createNewBook() {
        if (!title || !description || !condition || !price || !publication || !isbn || !category || !author) return;
        const id = uuid();
        book.id = id;

        // If there is an image uploaded, store it in S3 and add it to the book metadata
        if (image) {
            const fileName = `${image.name}_${uuid()}`;
            book.picture = fileName;
            await Storage.put(fileName, image);
        }

        await API.graphql({
            query: createBook,
            variables: { input: book },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        });

        router.push(`/books/${id}`);
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
        <div className="card">
            <div className="card-header actions-toolbar border-0">
                <div className="row justify-content-between align-items-center">
                    <div className="col">
                        <h3 className="d-inline-block mb-0">Fill book details</h3>
                    </div>
                </div>
            </div>

            <div className="card-body">

                <div className="form-group">
                    <label className="form-control-label">Book title</label>
                    <div className="input-group">
                        <Input
                            type="text"
                            onChange={onChange}
                            name="title"
                            placeholder="Book title"
                            value={book.title}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-control-label">Book ISBN</label>
                    <div className="input-group">
                        <Input
                            type="text"
                            onChange={onChange}
                            name="isbn"
                            placeholder="Isbn"
                            value={book.isbn}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-control-label">Book Condition</label>
                    <div className="input-group">
                        <Input
                            type="text"
                            onChange={onChange}
                            name="condition"
                            placeholder="Book Condition"
                            value={book.condition}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-control-label">Book Price</label>
                    <div className="input-group">
                        <Input
                            type="text"
                            onChange={onChange}
                            name="price"
                            placeholder="Book Price"
                            value={book.price}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-control-label">Book Publication</label>
                    <div className="input-group">
                        <Input
                            type="text"
                            onChange={onChange}
                            name="publication"
                            placeholder="Book publication"
                            value={book.publication}
                        />
                    </div>
                </div>

                {
                    image && (
                        <img src={URL.createObjectURL(image)} className="my-4" />
                    )
                }

                <div className="form-group">
                    <label className="form-control-label">Book Description</label>
                    <SimpleMDE value={book.content} onChange={value => setBook({ ...book, description: value })} />
                </div>

                <input
                    type="file"
                    ref={hiddenFileInput}
                    className="absolute w-0 h-0"
                    style={{ position: "absolute", height: 0, width: 0 }}
                    onChange={handleChange}
                />

                <button
                    className="btn btn-sm btn-primary btn-icon rounded-pill"
                    onClick={uploadImage}
                >
                    Upload Book Image
                    </button>

                <button
                    type="button"
                    className="btn btn-sm btn-primary btn-icon rounded-pill"
                    onClick={createNewBook}
                >
                    Create Book
                    </button>
            </div>
        </div>
    )
}

export default AddBook;