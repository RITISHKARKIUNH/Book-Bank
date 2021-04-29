import { useState, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { createBook, createReview } from '../../graphql/mutations';
import { Toaster, ImageUploader } from '../../components/common';
import { makeBookStatusOptions, makeCategoryOptions, createOption } from '../../lib/commondata';
import WithProfileLayout from '../../hoc/withprofilelayout';


export const selectStyle = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? '1px solid rgba(110, 0, 255, 0.5)' : '1px solid #e0e6ed',
        boxShadow: state.isFocused ? 'inset 0 1px 1px rgb(31 45 61 / 8%), 0 0 20px rgb(110 0 255 / 10%)' : 'inset 0 1px 1px rgb(31 45 61 / 8%)',
        height: "50px"
    })
};

function AddBook() {
    const [image, setImage] = useState(null);
    const [categoryValues, setCategoryValues] = useState(null);
    const [description, setDescription] = useState('');
    const [addingBook, setAddingBook] = useState(false);
    const hiddenFileInput = useRef(null);
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm();

    function setCategory(values) {
        let category = [];
        if (values.length > 0) {
            values.forEach(value => {
                category.push(value.label)
            });
        }
        setBook(() => ({ ...book, category }));
    }

    function handleCategoryCreate(inputValue) {
        console.log(inputValue);
        const newCategory = createOption(inputValue);
        const newCategories = [...categoryValues];
        newCategories.push(newCategory);
        setCategoryValues(newCategories);
        setCategory(newCategories);
    }

    function handleChange(e) {
        e.stopPropagation();
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;
        setImage(fileUploaded);
    };

    const onSubmit = async data => {
        console.log(data);
        setAddingBook(true);
        let { author, category, condition, isbn, price, publication, title } = data;
        const id = uuid();
        let extractedCategory = [];
        if (category && category.length > 0) {
            category.forEach(c => {
                extractedCategory.push(c.label)
            });
            category = extractedCategory;
        }
        if (condition && Object.keys(condition).length > 0) {
            condition = condition.label;
        }

        //construct book object
        let book = {};
        book.id = id;
        book.author = author;
        book.category = category;
        book.condition = condition;
        book.isbn = isbn;
        book.price = price;
        book.publication = publication;
        book.title = title;
        book.availability = 'available'
        if (description.length > 0) {
            book.description = description;
        }

        if (!title || !description || !condition || !price || !publication || !isbn || !category || !author) {
            Toaster('Required data for book are missing', true);
            return;
        }

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

            await API.graphql({
                query: createReview,
                variables: {
                    input: {
                        id: uuid(),
                        isbn: isbn,
                        totalRating: 0,
                        totalRatingScore: '0'
                    }
                }
            });

            Toaster('Book sucessfully uploaded');
            setAddingBook(false);
            router.push(`/books/${id}`);
        } catch (e) {
            Toaster(e.message, true);
            setAddingBook(false);
        }
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
                            <form className="book-form" onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label className="form-control-label">Book title</label>
                                    <div className="input-group">
                                        <input placeholder="Book title" className="form-control" {...register("title", { required: "Book title is required" })} />
                                        {errors.title && <span className="text-danger">{errors.title.message}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-control-label">Book Author</label>
                                    <div className="input-group">
                                        <input placeholder="Book author" className="form-control" {...register("author", { required: "Book author is required" })} />
                                        {errors.author && <span className="text-danger">{errors.author.message}</span>}
                                    </div>
                                </div>


                                <div className="form-group">
                                    <label className="form-control-label">Book ISBN</label>
                                    <div className="input-group">
                                        <input placeholder="Isbn" className="form-control" {...register("isbn", { required: "Isbn is required" })} />
                                        {errors.isbn && <span className="text-danger">{errors.isbn.message}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-control-label">Book Price</label>
                                    <div className="input-group">
                                        <input placeholder="Book Price" className="form-control" {...register("price", { required: "Book Price is required" })} />
                                        {errors.price && <span className="text-danger">{errors.price.message}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-control-label">Book Publication</label>
                                    <div className="input-group">
                                        <input placeholder="Book Publication" className="form-control" {...register("publication", { required: "Book publication required" })} />
                                        {errors.publication && <span className="text-danger">{errors.publication.message}</span>}
                                    </div>
                                </div>


                                <div className="form-group">
                                    <label className="form-control-label">Book Condition</label>
                                    <div className="input-group">
                                        <Controller
                                            name="condition"
                                            control={control}
                                            render={({ field }) => <Select
                                                {...field}
                                                className="bookbank-select"
                                                options={makeBookStatusOptions()}
                                                placeholder="select book state"
                                                required
                                                styles={selectStyle}
                                            />}
                                        />
                                        {errors.condition && <span className="text-danger">This field is required</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-control-label">Categories</label>
                                    <div className="input-group">
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => <CreatableSelect
                                                {...field}
                                                isMulti
                                                className="bookbank-select"
                                                options={makeCategoryOptions()}
                                                onCreateOption={handleCategoryCreate}
                                                placeholder="select categories"
                                                required
                                                styles={selectStyle}
                                            />}
                                        />
                                        {errors.category && <span className="text-danger">This field is required</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-control-label">Book Description</label>
                                    <SimpleMDE value={description} onChange={value => setDescription(value)} />
                                </div>

                                <input
                                    type="file"
                                    ref={hiddenFileInput}
                                    className="absolute w-0 h-0"
                                    style={{ position: "absolute", height: 0, width: 0 }}
                                    onChange={handleChange}
                                    onClick={e => { e.stopPropagation(); e.preventDefault() }}
                                />


                                <ImageUploader
                                    imageUploadHandler={handleChange}
                                    image={image}
                                />

                                <button type="submit" disabled={addingBook} className="btn btn-sm btn-primary btn-icon rounded-pill">{addingBook ? "Adding" : "Add"} Book</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithProfileLayout(AddBook);