import React from 'react';
import axios from 'axios';
import Spinner from 'react-spinner-material';
import { TokenCheck } from '../TokenCheck';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, NavLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';

const MyCart = () => {
  const navigate = useNavigate();
  const [prods, setProds] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  document.title = "My cart"
  React.useEffect(() => {
    if (!TokenCheck() || !localStorage.getItem('isAdmin') || localStorage.getItem('isAdmin') === "true") {
      navigate("/login");
      console.log(true);
      return;
    }
    getProducts();
  }, []);

  async function getProducts() {
    try {
      setLoading(true);
      const data = await axios({
        method: 'GET',
        url: "https://renteasy121.herokuapp.com/getProductsFromCart",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (data.status === 200) {
        setProds(data.data.cart);
        setTotal(data.data.cart_total);
      }
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
      setError(true);
    }
  }
  return (
    <div className="container-fluid mt-3">
      {loading && <LoadingIcon />}
      {error && <ErrorDisplay />}
      {prods.length === 0 && <EmptyCart />}
      {prods.length !== 0 && <Display prods={prods} setProds={setProds} total={total} setTotal={setTotal} />}
    </div>
  )
}

function ErrorDisplay() {
  return (
    <div style={{ color: "gray" }} className="mx-auto not-found">
      <span className="text-danger">Something went wrong<SentimentVeryDissatisfiedIcon />
        Please refresh the page</span>
    </div>
  )
}


function Display({ prods, setProds, total, setTotal }) {
  // console.log(prods.map((obj) => obj.quantity));
  const [delLoading, setDelLoading] = React.useState(false);
  const [editCartLoading, setEditCartLoading] = React.useState(false);
  const [firstRender, setfirstRender] = React.useState(true);
  const [prodErr, setprodErr] = React.useState(false);
  function dateDiffCalculator(startDate, endDate) {
    let sDate = new Date(startDate);
    let eDate = new Date(endDate);
    let diff = Math.abs(eDate - sDate);
    console.log(diff);
    diff = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diff;
  }

  async function checkout(prods) {
    console.log(prods);
    if (prodErr) {
      toast.error("Please give proper product information", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      return;
    }
    const { key } = await axios({
      method: "GET",
      url: "https://renteasy121.herokuapp.com/rkey",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const { data } = await axios({
      method: "POST",
      url: "https://renteasy121.herokuapp.com/checkout",
      data: {
        total_amount: total
      },
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log(data);
    var options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Rent Easy",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      test: "test1",
      order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "/verify?token=" + localStorage.getItem('token'),
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
    // e.preventDefault();
  }

  function price_calculator(values) {
    // console.log(dateDiffCalculator(values.startDate, values.endDate))
    console.log(values);
    let diff = dateDiffCalculator(values.startDate, values.endDate);
    values.price = (diff + 1) * values.perUnit_price * values.quantity;
    return values;
  }

  async function editFromCart(values) {
    try {
      values = price_calculator(values);
      console.log(values.prod_id, values.name);
      console.log("name", values.name)
      console.log(values.prod_id)
      setEditCartLoading(true);
      const data = await axios({
        method: 'PUT',
        url: "https://renteasy121.herokuapp.com/editcart",
        data: values,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      // toast.success("Changes made to product successfully", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      //   draggable: false,
      //   progress: undefined,
      // })
      const data2 = await axios({
        method: "GET",
        url: "https://renteasy121.herokuapp.com/getProductsFromCart",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      prods = data2.data.cart;
      setProds(prods);
      total = data2.data.cart_total;
      setTotal(total);
      console.log("Final edit", prods);
      setEditCartLoading(false);
    }
    catch (e) {
      toast.error(e.response.data.message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setEditCartLoading(false);
    }
  }

  //delete product
  async function deleteProd(id) {
    console.log("name:", prods.filter((p) => p.prod_id === id));
    console.log(id);
    try {
      setDelLoading(true);
      const data = await axios({
        method: "DELETE",
        url: "https://renteasy121.herokuapp.com/deleteFromCart",
        data: {
          prod_id: id
        },
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      // toast.success("Product removed from cart successfully", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      //   draggable: false,
      //   progress: undefined,
      // })
      const data2 = await axios({
        method: "GET",
        url: "https://renteasy121.herokuapp.com/getProductsFromCart",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setProds(data2.data.cart);
      setTotal(data2.data.cart_total);
      setDelLoading(false);
      window.location.reload();
      console.log("final del", prods);
    }
    catch (e) {
      toast.error(e.response.data.message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setDelLoading(false);
    }
  }

  function isValidDate(startDate) {
    let today = new Date().toLocaleString();
    console.log(typeof (today), typeof (startDate));
    // console.log(today.toLocaleString());
    today = today.split(",")[0].split("/");
    let month = today[0];
    let date = today[1];
    let year = today[2];
    today[0] = year;
    today[1] = month;
    today[2] = date;
    if (today[1].length === 1)
      today[1] = '0' + today[1]
    if (today[2].length === 1)
      today[2] = '0' + today[2];
    today = today.join('-');
    if (today <= startDate)
      return true;
    return false;
  }
  const navigate = useNavigate();
  return (
    <>
      <div className="row g-2 m-4">
        {prods.map((obj, ind) => {
          return (
            <div style={{ cursor: "pointer" }} /*onClick={() => navigate(`/products/${obj.prod_id}`)}*/ key={obj._id} className="col-md-3 m-3  p-2 prod_details">
              <div className="prod_pic m-1">
                <img alt={obj.name} src={obj.image_url} style={{ width: "200px", height: "130px", objectFit: "contain" }} />
              </div>
              <span style={{ fontWeight: "bold" }} className="prod_name m-1">
                {obj.name}
              </span>
              <span style={{ fontWeight: "bold" }} className="prod_price m-1">
                Price(Per Unit):₹{obj.perUnit_price}
              </span>
              <span style={{ fontWeight: "bold" }}>
                quantity_available:{obj.quantity_available}
              </span>
              <Formik
                initialValues={obj}
                onSubmit={(values) => {
                  editFromCart(values)
                }}
                validate={(values) => {
                  setfirstRender(false);
                  const errors = {};
                  if (!values.startDate) errors.startDate = "This field is required";
                  else if (!isValidDate(values.startDate)) errors.startDate = "Invalid startdate";
                  if (!values.endDate) errors.endDate = "This field is required";
                  else if (values.startDate > values.endDate) errors.endDate = "Invalid enddate";
                  if (isNaN(values.quantity) || values.quantity < 1) errors.quantity = "This field is required";
                  else if (values.quantity > values.quantity_available) errors.quantity = `Only ${values.quantity_available} is available`;
                  if (Object.keys(errors).length === 0) {
                    setprodErr(false);
                  }
                  else
                    setprodErr(true);
                  return errors;
                }}
              >
                {({ values, errors, touched }) => <Form className="row g-2 m-2">
                  <div className="col-12">
                    <label For="startDate" className="form-label">Start Date:</label>
                    <Field type="date" value={values.startDate} name="startDate" id="startDate" className={"form-control datepicker" + (touched.startDate && errors.startDate ? " is-invalid" : "")} />
                    <ErrorMessage
                      component="span"
                      name="startDate"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-12">
                    <label For="endDate" className="form-label">End Date:</label>
                    <Field type="date" value={values.endDate} name="endDate" id="endDate" className={"form-control" + (touched.endDate && errors.endDate ? " is-invalid" : "")} />
                    <ErrorMessage
                      component="span"
                      name="endDate"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-12">
                    <label For="quantity" className="form-label">Quantity:</label>
                    <Field type="number" name="quantity" id="quantity" values={values.quantity} className={"form-control" + ((touched.quantity && errors.quantity) || (firstRender && obj.quantity > obj.quantity_available) ? " is-invalid" : "")} />
                    {firstRender && obj.quantity > obj.quantity_available && <span className="text-danger">{obj.quantity_available === 0 ? "Out of stock" : `Only ${obj.quantity_available} is available`}</span>}
                    <ErrorMessage
                      component="span"
                      className="text-danger"
                      name="quantity"
                    />
                  </div>
                  <div className="col-12 text-center">
                    <button type="submit" className="btn btn-warning">click here to make changes(if any made for this product)</button>
                  </div>
                  <div className="col-12 text-center">
                    <span className="prod_price m-1"><span style={{ fontWeight: "500" }}>Your Price:</span><span style={{ fontWeight: "bold" }}>₹{obj.price}</span></span><br></br>
                    {delLoading ? <Spinner /> : <span onClick={() => deleteProd(values.prod_id)}><DeleteIcon /></span>}
                    {editCartLoading && <><Spinner /> Please wait for changes to happen...</>}
                  </div>
                </Form>}
              </Formik>
              <ToastContainer />
            </div>
          )
        })}
      </div>
      <footer class="footer fixed-bottom p-2 bg-dark">
        <div class="container text-center">
          <button class="btn btn-large btn-warning" onClick={() => checkout(prods)}>pay ₹{total}</button>
        </div>
      </footer>
    </>
  )
}

function EmptyCart() {
  const navigate = useNavigate();
  return <div style={{ color: "gray" }} className="mx-auto not-found">
    <span>Empty <ShoppingCartRoundedIcon />!!!<NavLink to="/products"><a><span style={{ color: "black" }}>Click here to add your first product</span></a></NavLink></span>
  </div>
}

function LoadingIcon() {
  return (
    <div className="prod_load_spinner">
      <CircularProgress />
      <div style={{ marginTop: "4px" }}>
        Fetching products please wait...
      </div>
    </div>
  )
}

export default MyCart
