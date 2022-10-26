import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import { TokenCheck } from '../TokenCheck';
import { ToastContainer, toast } from 'react-toastify';


export default function Register() {
    const obj = {
        username: '',
        email: '',
        pass: '',
        role: ''
    }
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        document.title ="Register";
        if (TokenCheck()) {
            // TokenCheck();
            navigate("/products");
        }
    })
    async function registerUser(values) {
        var data;
        try {
            setLoading(true);
            data = await axios.post('https://renteasy121.herokuapp.com/users/signup', values);
            if (data.status === 200) {
                setLoading(false);
                toast.success("Registartion success...please wait redirecting to login page", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
             
            }
        }
        catch (e) {
            setLoading(false);
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
                toast.error("Facing cors error...try to refresh the page", {
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
    async function registerAdmin(values) {
        var data;
        try {
            setLoading(true);
            data = await axios.post('https://renteasy121.herokuapp.com/admin/signup', values);
            if (data.status === 200) {
                setLoading(false);
                toast.success("Registartion success...please wait redirecting to login page", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }
        }
        catch (e) {
            setLoading(false);
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
                toast.error("Facing cors error...try to refresh the page", {
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
    return (
        <Formik
            initialValues={obj}
            onSubmit={(values) => {
                // console.log(values);
                let role = values.role;
                let copyObj={...values};
                delete copyObj.role;
                if (role === '1')
                    registerUser(copyObj);
                else
                    registerAdmin(copyObj);
                
            }}
            validate={(values) => {
                const errors = {};
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!values.username.trim()) errors.username = "This field is required";
                else if (values.username.trim().length < 3) errors.username = "Username should be at least 3 characters";
                if (!values.email) errors.email = "This field is required";
                else if (!values.email.match(mailformat)) errors.email = "Enter valid email";
                if (!values.pass.trim()) errors.pass = "This field is required";
                else if (values.pass.trim().length < 5) errors.pass = "Password should be at least 5 characters";
                if (!values.role || values.role === '0') errors.role = 'Please select a role';
                return errors;
            }}
        >
            {({ values, errors, touched }) =>
                <div className="form">
                    <Form className="row g-3" noValidate>
                        <div className="col-12">
                            <label For="username" className="form-label">Username</label>
                            <Field type="text" class={"form-control" + (touched.username && errors.username ? " is-invalid" : "")} id="username" name="username" placeholder="Enter Username"></Field>
                            <ErrorMessage
                                component="span"
                                name="username"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            <label For="email" className="form-label">Email</label>
                            <Field type="email" class={"form-control" + (touched.email && errors.email ? " is-invalid" : "")} id="email" name="email" placeholder="Enter Email"></Field>
                            <ErrorMessage
                                component="span"
                                name="email"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            <label for="pass" className="form-label">Password</label>
                            <Field type="password" class={"form-control" + (touched.pass && errors.pass ? " is-invalid" : "")} id="pass" name="pass" placeholder="Enter password"></Field>
                            <ErrorMessage
                                component="span"
                                name="pass"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            <Field name="role" component="select" value={values.role} className={"form-select" + (touched.role && errors.role ? " is-invalid" : "")}>
                                <option value="0" selected>Sign up as</option>
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
                            {!loading && <button className="btn btn-primary" type="submit">Register</button>}
                            {loading && <button className="btn btn-primary" disabled>
                                <Spinner />
                            </button>}
                        </div>
                    </Form>
                    <ToastContainer />
                </div>
            }
        </Formik>
    )
}
