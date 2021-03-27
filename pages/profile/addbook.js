import { useState, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { createBook } from '../../graphql/mutations';
import { Input } from '../../components/common';
import { makeBookStatusOptions, makeCategoryOptions, createOption } from '../../lib/commondata';
import WithProfileLayout from '../../hoc/withprofilelayout';

const initialState = {
    title: '',
    description: '',
    category: [],
    isbn: '',
    author: '',
    condition: '',
    price: '',
    publication: '',
    picture: ''
}

export const selectStyle = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? '1px solid rgba(110, 0, 255, 0.5)' : '1px solid #e0e6ed',
        boxShadow: state.isFocused ? 'inset 0 1px 1px rgb(31 45 61 / 8%), 0 0 20px rgb(110 0 255 / 10%)' : 'inset 0 1px 1px rgb(31 45 61 / 8%)',
        height: "50px"
    })
};

function AddBook() {
    const [book, setBook] = useState(initialState);
    const [image, setImage] = useState(null);
    const [categoryValues, setCategoryValues] = useState(null);
    const [stateValues, setStatusValues] = useState(null);
    const hiddenFileInput = useRef(null);
    const { title, description, isbn, condition, price, publication, category, author } = book;
    const router = useRouter();

    function onValueChange(e) {
        setBook(() => ({ ...book, [e.target.name]: e.target.value }));
    }

    function setCategory(values) {
        let category = [];
        if (values.length > 0) {
            values.forEach(value => {
                category.push(value.label)
            });
        }
        setBook(() => ({ ...book, category }));
    }

    function handleCategoryChange(newValue, actionMeta) {
        setCategoryValues(newValue);
        setCategory(newValue);
    }

    function handleCategoryCreate(inputValue) {
        console.log(inputValue);
        const newCategory = createOption(inputValue);
        const newCategories = [...categoryValues];
        newCategories.push(newCategory);
        setCategoryValues(newCategories);
        setCategory(newCategories);
    }

    function handleConditionChange(newValue, actionMeta) {
        setStatusValues(newValue);
        setBook(() => ({ ...book, condition: newValue.label }));
    }


    async function createNewBook() {
        if (!title || !description || !condition || !price || !publication || !isbn || !category || !author) return;
        const id = uuid();
        book.id = id;

        console.log(book);


        try {
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
        } catch (e) {
            console.error(e, "error happened");
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
        <>
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Add a new book</h1>
                </div>
                <div className="container">
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
                                        onChange={onValueChange}
                                        name="title"
                                        placeholder="Book title"
                                        value={book.title}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Book Author</label>
                                <div className="input-group">
                                    <Input
                                        type="text"
                                        onChange={onValueChange}
                                        name="author"
                                        placeholder="Book author"
                                        value={book.author}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Book Condition</label>
                                <div className="input-group">
                                    <Select
                                        className="bookbank-select"
                                        onChange={handleConditionChange}
                                        options={makeBookStatusOptions()}
                                        value={stateValues}
                                        placeholder="select book state"
                                        required
                                        styles={selectStyle}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Categories</label>
                                <div className="input-group">
                                    <CreatableSelect
                                        isMulti
                                        className="bookbank-select"
                                        onChange={handleCategoryChange}
                                        options={makeCategoryOptions()}
                                        onCreateOption={handleCategoryCreate}
                                        value={categoryValues}
                                        placeholder="select categories"
                                        required
                                        styles={selectStyle}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Book ISBN</label>
                                <div className="input-group">
                                    <Input
                                        type="text"
                                        onChange={onValueChange}
                                        name="isbn"
                                        placeholder="Isbn"
                                        value={book.isbn}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Book Price</label>
                                <div className="input-group">
                                    <Input
                                        type="text"
                                        onChange={onValueChange}
                                        name="price"
                                        placeholder="Book Price"
                                        value={book.price}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Book Publication</label>
                                <div className="input-group">
                                    <Input
                                        type="text"
                                        onChange={onValueChange}
                                        name="publication"
                                        placeholder="Book publication"
                                        value={book.publication}
                                        required
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
                                Add Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithProfileLayout(AddBook);