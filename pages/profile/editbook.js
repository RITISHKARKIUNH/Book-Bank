import { useEffect, useState, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { useRouter } from 'next/router';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { v4 as uuid } from 'uuid';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

import { updateBook } from '../../graphql/mutations';
import { getBook } from '../../graphql/queries';
import { Input, Toaster } from '../../components/common';
import { makeBookStatusOptions, makeCategoryOptions, createOption } from '../../lib/commondata';
import { selectStyle } from './addbook';
import WithProfileLayout from '../../hoc/withprofilelayout';

function EditBook({ bookData }) {
    if (!bookData) return null;
    console.log(bookData);
    const router = useRouter();
    const { id } = router.query;
    const [book, setBook] = useState(bookData);
    const [picture, setPicture] = useState(null);
    const [localImage, setLocalImage] = useState(null);
    const [categoryValues, setCategoryValues] = useState();
    const [stateValues, setStatusValues] = useState(null);
    const fileInput = useRef(null);

    useEffect(() => {
        let categories = bookData.category.map(cat => createOption(cat));
        let condition = createOption(bookData.condition);
        setCategoryValues(categories);
        setStatusValues(condition);

        fetchBookPicture();
        async function fetchBookPicture() {
            const imageKey = await Storage.get(bookData.picture);
            setPicture(imageKey);
        }

    }, []);

    async function uploadImage() {
        fileInput.current.click();
    };

    function handleChange(e) {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;
        setPicture(fileUploaded);
        setLocalImage(URL.createObjectURL(fileUploaded));
    };

    function onChange(e) {
        setBook(() => ({ ...book, [e.target.name]: e.target.value }))
    };

    let { title, description, condition, price, publication, isbn, category, author } = book;

    async function updateCurrentBook() {

        if (!title || !description || !condition || !price || !publication || !isbn || !category || !author) return;

        const bookUpdated = {
            id, title, description, condition, price, publication, isbn, category, author
        };

        // check to see if there is a cover image and that it has been updated
        if (picture && localImage) {
            const fileName = `${picture.name}_${uuid()}`;
            bookUpdated.picture = fileName;
            await Storage.put(fileName, picture);
        }

        try {
            await API.graphql({
                query: updateBook,
                variables: { input: bookUpdated },
                authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            Toaster('Book sucessfully updated');
            router.push('/profile/listedbooks');
            console.log('book successfully updated!');

        } catch (e) {
            console.error(e);
        }

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



    return (
        <>
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">edit book details</h1>
                </div>
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-control-label">Book title *</label>
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
                                <label className="form-control-label">Book Author *</label>
                                <div className="input-group">
                                    <Input
                                        type="text"
                                        onChange={onChange}
                                        name="author"
                                        placeholder="Book author"
                                        value={book.author}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-control-label">Book Condition *</label>
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
                                <label className="form-control-label">Categories *</label>
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
                                <label className="form-control-label">Book Price *</label>
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
                                <label className="form-control-label">Book Publication *</label>
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
                                picture && <img src={localImage ? localImage : picture} className="mt-3 mb-3 rounded d-block img-thumbnail" />
                            }

                            <input
                                type="file"
                                ref={fileInput}
                                className="absolute w-0 h-0"
                                onChange={handleChange}
                                style={{ position: "absolute", height: 0, width: 0 }}
                            />

                            <button
                                className="btn btn-lg btn-info rounded-pill"
                                onClick={uploadImage}
                            >
                                Upload Book Image
                            </button>

                            <div className="form-group">
                                <label className="form-control-label">Book Description *</label>

                                <SimpleMDE value={book.description} onChange={value => setBook({ ...book, description: value })} />
                            </div>

                            <button
                                className="btn btn-lg btn-primary rounded-pill"
                                onClick={updateCurrentBook}
                            >
                                Update Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

EditBook.getInitialProps = async (ctx) => {
    const { id } = ctx.query;

    const bookData = await API.graphql({
        query: getBook, variables: { id }
    });

    return {
        bookData: { ...bookData.data.getBook }
    }
}

export default WithProfileLayout(EditBook);