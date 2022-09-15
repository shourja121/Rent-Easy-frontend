import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NotFound from '../Components/NotFound';
import Spinner from 'react-spinner-material';
import 'react-toastify/dist/ReactToastify.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';



const ProdDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false)
  const [prod, setProd] = React.useState();
  React.useEffect(() => {
    if (!TokenCheck() || !localStorage.getItem('isAdmin') || localStorage.getItem('isAdmin') === "true") {
      navigate("/login");
      console.log(true);
      return;
    }
    getProduct();
  }, [])
  async function getProduct() {
    try {
      setLoading(true);
      const data = await axios({
        method: 'GET',
        url: `https://renteasy121.herokuapp.com/${id}`,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(data);
      setLoading(false);
      setProd(data.data);
      document.title = data.data.name;
    }
    catch (e) {
      setLoading(false);
      setError(true);
      document.title = "Product not found"
    }
  }
  // console.log("url parameter",props.match.params.id);
  return (
    <div class="container mt-4 mb-2">
      <ToastContainer />
      {/* <h1 onClick={() => setError(!error)}>Product details page for {id}</h1> */}
      {loading && <LoadingIcon />}
      {error && <ErrorDisplay />}
      {!prod && <NotFound />}
      {!loading && prod ? <Display prod={prod} /> : ""}
    </div>
  )
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

function dateDiffCalculator(startDate, endDate) {
  let sDate = new Date(startDate);
  let eDate = new Date(endDate);
  let diff = Math.abs(eDate - sDate);
  console.log(diff);
  diff = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return diff;
}

function price_calculator(values, prod) {
  // console.log(dateDiffCalculator(values.startDate, values.endDate))
  console.log(values);
  let diff = dateDiffCalculator(values.startDate, values.endDate);
  return (diff + 1) * prod.price * values.quantity;
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



function Display({ prod }) {
  const [showPrice, setShowPrice] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  async function addToCart(values) {
    try {
      setLoading(true);
      const data = await axios({
        method: "PUT",
        url: "https://renteasy121.herokuapp.com/cart",
        data: values,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setLoading(false);
      if (data.status === 200) {
        toast.success("Product added to cart successfully!!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
      else {
        toast.warning("Product might already exist in your cart,please go to your cart for making changes!!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    }
    catch (e) {
      setLoading(false);
      console.log("123", e);
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
  const obj = {
    startDate: '',
    endDate: '',
    quantity: 1,
    price: 0
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <img src={prod.image_url} style={{ height: "460px", width: "350px", objectFit: "contain" }} className="pic" />
        </div>
        <div className="col" style={{ fontWeight: "bold" }}>
          <div className="row mx-auto my-auto">
            <div className="col">
              NAME:{prod.name}
            </div>
          </div>
          <div className="row mx-auto my-auto">
            <div className="col">
              PRICE:₹{prod.price}<span style={{ fontWeight: "10px" }}> per day</span>
            </div>
          </div>
          <div className="row mx-auto my-auto">
            <Formik
              initialValues={obj}
              onSubmit={(values) => {
                console.log(values);
                console.log(prod._id);
                values.prod_id = prod._id;
                values.price = price_calculator(values, prod);
                values.noOfDays = dateDiffCalculator(values.startDate, values.endDate) + 1;
                values.image_url = prod.image_url;
                values.name = prod.name;
                values.perUnit_price = prod.price;
                values.quantity_available = prod.quantity;
                addToCart(values);
              }}
              validate={(values) => {
                // console.log(values.startDate)
                const errors = {};
                if (!values.startDate) errors.startDate = "This field is required";
                else if (!isValidDate(values.startDate)) errors.startDate = "Invalid start date";
                if (!values.endDate) errors.endDate = "This field is required";
                else if (values.startDate > values.endDate) errors.endDate = "Invalid end date";
                if (!values.quantity || isNaN(values.quantity) || values.quantity < 1) errors.quantity = "This field is required";
                else if (values.quantity > prod.quantity) errors.quantity = `Only ${prod.quantity} is available`;
                Object.keys(errors).length !== 0 ? setShowPrice(false) : setShowPrice(true);
                return errors;
              }}
            >
              {({ values, errors, touched }) =>
                <Form>
                  <div className="col-12">
                    <label For="startDate" className="form-label">Start Date:</label>
                    <Field type="date" name="startDate" id="startDate" className={"form-control datepicker" + (touched.startDate && errors.startDate ? " is-invalid" : "")} />
                    <ErrorMessage
                      component="span"
                      name="startDate"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-12">
                    <label For="endDate" className="form-label">End Date:</label>
                    <Field type="date" name="endDate" id="endDate" className={"form-control" + (touched.endDate && errors.endDate ? " is-invalid" : "")} />
                    <ErrorMessage
                      component="span"
                      name="endDate"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-12">
                    <label For="quantity" className="form-label">Quantity:</label>
                    <Field type="number" name="quantity" id="quantity" values={values.quantity} className={"form-control" + (touched.quantity && errors.quantity ? " is-invalid" : "")} />
                    <ErrorMessage
                      component="span"
                      name="quantity"
                      className="text-danger"
                    />
                  </div>
                  {showPrice && <div className="col-12">
                    <span>Your price for this product:₹{price_calculator(values, prod)}</span>
                  </div>}
                  <div className="col-12 mt-2">
                    {!loading && <button type="submit" class="btn btn-primary btn-lg">Add to cart <ShoppingCartRoundedIcon /></button>}
                    {loading && <button className="btn btn-primary" disabled>
                      <Spinner />
                    </button>}
                  </div>
                </Form>
              }
            </Formik>
          </div>
        </div>
      </div>
    </>
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

export default ProdDetails
