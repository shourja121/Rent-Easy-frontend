import React from 'react';
import { Store } from '../Context';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import Spinner from 'react-spinner-material';
import { useNavigate } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import dotenv from 'dotenv';

// dotenv.config();

function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        document.title = "Login"
        if (TokenCheck()) {
            navigate("/products");
        }
    })
    const userForm = {
        email: '',
        pass: '',
        role: '0'
    }
    async function authUser(values) {
        try {
            setLoading(true);
            const data = await axios.post("https://renteasy121.herokuapp.com/users/signin", values);
            localStorage.setItem("token", data.data.token);
            localStorage.setItem('isAdmin', false);
            navigate("/products");
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            try {
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
            catch (e) {
                toast.error("Facing cors error...try again", {
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
    }
    async function authAdmin(values) {
        try {
            setLoading(true);
            const data = await axios.post("https://renteasy121.herokuapp.com/admin/signin", values);
            localStorage.setItem("token", data.data.token);
            setLoading(false);
            localStorage.setItem("isAdmin", true);
            navigate("/admin");
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            try {
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
            catch (e) {
                try {
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
                catch (e) {
                    toast.error("Facing cors error...try again", {
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
        }
    }
    return (
        <Store.Consumer>
            {(context) => {

                return (
                    <>
                        <Formik
                            initialValues={
                                userForm
                            }
                            onSubmit={(values) => {
                                // console.log("1",values);
                                let role = values.role;
                                let copyObj = { ...values };
                                delete copyObj.role;
                                if (role === '1') {
                                    authUser(copyObj);
                                    // console.log(context);
                                }
                                else if (role === '2') {
                                    authAdmin(copyObj);
                                    console.log(context);
                                }
                            }}
                            validate={(values) => {
                                const errors = {};
                                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                if (!values.email) errors.email = "This field is required";
                                else if (!values.email.match(mailformat)) errors.email = "Enter a valid mail";
                                if (!values.pass.trim()) errors.pass = "This field is required";
                                else if (values.pass.trim().length < 5) errors.pass = "Password length should be greather than 5";
                                if (!values.role || values.role === '0') errors.role = 'Please select a role';
                                return errors;

                            }}
                        >
                            {({ values, touched, errors }) =>
                                <div className="form">
                                    <Form className="row g-3 mx-auto" noValidate>
                                        <div className="col-12">
                                            <label For="email" className="form-label">Email</label>
                                            <Field type="email" className={"form-control" + (touched.email && errors.email ? " is-invalid" : "")} id="email" placeholder="Enter email" name="email" required />
                                            <ErrorMessage
                                                component="span"
                                                name="email"
                                                className="text-danger"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label For="pass" className="form-label">Password</label>
                                            <Field type="password" className={"form-control" + (touched.pass && errors.pass ? " is-invalid" : "")} placeholder="Enter password" name="pass" id="pass" required />
                                            <ErrorMessage
                                                component="span"
                                                name="pass"
                                                className="text-danger"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <Field name="role" component="select" value={values.role} className={"form-select" + (touched.role && errors.role ? " is-invalid" : "")}>
                                                <option value="0" selected>Sign in as</option>
                                                <option value="1">User</option>
                                                <option value="2">Admin</option>
                                            </Field>
                                            <ErrorMessage
                                                component="span"
                                                className="text-danger"
                                                name="role"
                                            />
                                        </div>
                                        <div className="col-12">
                                            {!loading && <button className="btn btn-primary" type="submit">Login</button>}
                                            {loading && <button className="btn btn-primary" disabled>
                                                <Spinner />
                                            </button>}
                                        </div>
                                    </Form>
                                    <NavLink to="../register">
                                        <span style={{ color: "blue" }}>Not a user?Register</span>
                                    </NavLink>
                                    <ToastContainer />
                                </div>
                            }
                        </Formik>
                    </>
                )
            }}
        </Store.Consumer>
    )
}

export default Login
