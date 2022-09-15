import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import Spinner from 'react-spinner-material';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import 'react-toastify/dist/ReactToastify.css';


const EditProducts = () => {
    const [loading, setLoading] = React.useState(false);
    const { id } = useParams();
    const [obj, setObj] = React.useState(null)
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!TokenCheck() || localStorage.getItem('isAdmin') !== "true") {
            navigate("/login");
            return;
        }
        getProducts();
    }, [])
    async function getProducts() {
        try {
            const data = await axios({
                method: 'GET',
                url: `https://renteasy121.herokuapp.com/admin/${id}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setObj(data.data);
        }
        catch (e) {
            console.log(e);
        }
    }
    async function submitProduct(values) {
        console.log("in func", values);
        try {
            setLoading(true);
            const data = await axios({
                method: "put",
                data: values,
                url: "https://renteasy121.herokuapp.com/admin/modifyProducts",
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setLoading(false);
            toast.success("Changes made to product successfully...please wait redirecting to your product page", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            setTimeout(() => {
                navigate("/admin");
            }, 2000)
        }
        catch (e) {
            setLoading(false);
            toast.error(e.response.data.message, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
    }
    document.title = "Add Product"
    return (
        <>
            {obj && <div className="prod_add">
                <Formik
                    initialValues={obj}
                    onSubmit={(values) => {
                        console.log(values)
                        const prodId = obj._id;
                        values.prod_id = prodId;
                        delete values._id;
                        console.log("Submiited", values);
                        submitProduct(values);
                    }}
                    validate={(values) => {
                        const errors = {};
                        var url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
                        if (!values.name.trim()) errors.name = "This field is required";
                        else if (values.name.trim() < 5) errors.name = "Cannot be less than 5";
                        else if (values.name.trim().length > 500) errors.name = "Cannot be more than 500 characters";
                        if (isNaN(values.price)) errors.price = "Must be a number";
                        else if (Number(values.price) < 100) errors.price = "Must be a greater than 100";
                        if (isNaN(values.quantity)) errors.quantity = "Must be a number";
                        else if (values.quantity < 1) errors.quantity = "Must be greater than 0"
                        if (!values.image_url.trim()) errors.image_url = "This field is required";
                        else if (!values.image_url.match(url_regex)) errors.image_url = "Please enter a valid image url";
                        else if (parseInt(values.quantity) < 1) errors.quantity = "Must be a greater than 0";
                        if (values.category.length === 0) errors.category = "Select your product's category";
                        return errors;
                    }}
                >
                    {({ errors, touched, values }) =>
                        <div className="prod_add">
                            <div className="form">
                                <Form className="row g-3" noValidate>
                                    <div className="col-6">
                                        <label For="name" className="form-label">Product Name:</label>
                                        <Field type="text" class={"form-control" + (touched.name && errors.name ? " is-invalid" : "")} id="name" name="name" placeholder="Enter Product Name"></Field>
                                        <ErrorMessage
                                            component="span"
                                            name="name"
                                            className="text-danger"
                                        />
                                    </div>
                                    <div className="col-2">
                                        <label For="price" className="form-label">Price:(INR)</label>
                                        <Field type="number" class={"form-control" + (touched.price && errors.price ? " is-invalid" : "")} id="price" name="price" placeholder="Enter Price"></Field>
                                        <ErrorMessage
                                            component="span"
                                            name="price"
                                            className="text-danger"
                                        />
                                    </div>
                                    <div className="col-2">
                                        <label for="quantity" className="form-label">Quantity</label>
                                        <Field type="number" class={"form-control" + (touched.quantity && errors.quantity ? " is-invalid" : "")} id="quantity" name="quantity" placeholder="Enter quantity"></Field>
                                        <ErrorMessage
                                            component="span"
                                            name="quantity"
                                            className="text-danger"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label For="image_url" className="form-label">Image url</label>
                                        <Field type="url" class={"form-control" + (touched.image_url && errors.image_url ? " is-invalid" : "")} id="image_url" name="image_url" placeholder="Enter image url"></Field>
                                        <ErrorMessage
                                            component="span"
                                            name="image_url"
                                            className="text-danger"
                                        />
                                    </div>
                                    <div className="col-5">
                                        <Field name="category" component="select" value={values.category} className={"form-select" + (touched.category && errors.category ? " is-invalid" : "")}>
                                            <option value="" selected>Select product's category</option>
                                            <option value="mobile">mobile</option>
                                            <option value="clothes">clothes</option>
                                            <option value="camera">camera</option>
                                        </Field>
                                        <ErrorMessage
                                            component="span"
                                            className="text-danger"
                                            name="category"
                                        />
                                    </div>
                                    <div className="col-12">
                                        {!loading && <button className="btn btn-primary" type="submit">Add Changes</button>}
                                        {loading && <button className="btn btn-primary" disabled>
                                            <Spinner />
                                        </button>}
                                    </div>
                                </Form>
                                <ToastContainer />
                            </div>
                            <DisplayProducts prod={values} />
                        </div>

                    }
                </Formik>
            </div>}
        </>
    )
}

function DisplayProducts(props) {
    return (
        <>
            <div className="mt-2"><hr /><h3>Product Overview:</h3></div>
            <div className="row g-2 m-2">
                <div key={props.prod._id} className="col-md-4  p-2 prod_details">
                    <div className="prod_pic m-1">
                        {props.prod.image_url && <img alt={props.prod.name} src={props.prod.image_url} style={{ width: "200px", height: "130px", objectFit: "contain" }} />}
                    </div>
                    <span style={{ fontWeight: "bold" }} className="prod_name m-1">
                        {props.prod.name}
                    </span>
                    <span className="prod_category m-1"><span style={{ fontWeight: "500" }}>Catgeory:</span><span style={{ fontWeight: "bold" }}>{props.prod.category}</span></span>
                    <span className="prod_price m-1"><span style={{ fontWeight: "500" }}>Price:</span><span style={{ fontWeight: "bold" }}>₹{props.prod.price}</span></span>
                    <span className="prod_quantity m-1"><span style={{ fontWeight: "500" }}>Initial Quantity:</span><span style={{ fontWeight: "bold" }}>{props.prod.quantity}</span></span>
                    <span className="prod_quantity m-1"><span style={{ fontWeight: "500" }}>Products Bought:</span><span style={{ fontWeight: "bold" }}>{props.prod.quantityBought}</span></span>
                </div>
            </div>
        </>
    )
}

export default EditProducts;
