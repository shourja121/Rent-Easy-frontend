import React, { useState, useEffect } from 'react';
import { Store } from '../Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CircularProgress from '@mui/material/CircularProgress';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { TokenCheck } from '../TokenCheck';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { ToastContainer, toast } from 'react-toastify';

const Product = () => {
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  async function addToCart(id) {
    const data = {
      prod_id: id
    };
    try {
      setLoading(true);
      await axios({
        method: 'put',
        url: "https://renteasy121.herokuapp.com/cart",
        data: data,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success("Product added to cart successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setLoading(false);
      console.log("success");
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
      setError(true);
      setLoading(false);
    }
  }
  async function getProductsByCategory(category) {
    if (category.length === 0)
      return;
    try {
      setLoading(true);
      const data = await axios.get(`https://renteasy121.herokuapp.com/getProductsByCategory?category=${category}`);
      setProds(data.data);
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
      setError(true);
    }
  }
  async function getProductsOnSearch(query) {
    if (query.length === 0) {
      getProducts();
      return;
    }
    try {
      setLoading(true);
      const data = await axios.get(`https://renteasy121.herokuapp.com/getProductsOnSearch/${query}`);
      setProds(data.data);
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
      setError(true);
    }
  }
  async function checkAvailability(value) {
    try {
      setLoading(true);
      const data = await axios.get(`https://renteasy121.herokuapp.com/checkisavailable?availability=${value}`);
      setProds(data.data);
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
      setError(true);
    }
  }
  async function getProducts() {
    try {
      setLoading(true);
      // console.log(env);
      const data = await axios.get(`https://renteasy121.herokuapp.com/getAllProducts`);
      setProds(data.data);
      // console.log(data.data);
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
      setError(true);
      // alert('asd');
    }
  }
  useEffect(() => {
    document.title = "Products"
    getProducts();
  }, [])
  return (
    <Store.Consumer>
      {({ products }) => {
        return (
          <>
            <div className="categorize m-2">
              <div className="category">
                <label style={{ fontWeight: 'bold' }}>Search By Availability:</label>{" "}
                <select onChange={(e) => checkAvailability(e.target.value)}>
                  <option value="all">all</option>
                  <option value={true}>Available</option>
                  <option value={false}>Not available</option>
                </select>
              </div>
              <div className="category">
                <label style={{ fontWeight: 'bold' }}>Search By Category:</label>{" "}
                <select onChange={(e) => getProductsByCategory(e.target.value)}>
                  <option value="all">all</option>
                  <option value="mobile">mobiles</option>
                  <option value="clothes">clothes</option>
                  <option value="camera">camera</option>
                </select>
              </div>
              <div className="search">
                <label style={{ fontWeight: 'bold' }}>Search:</label>{" "}
                <input type="text" onChange={({ target: { value } }) => getProductsOnSearch(value)} placeholder="Search by product name" />
              </div>
            </div>
            <div className="container-fluid mt-5">
              {loading ? (<LoadingIcon />) : (
                products = prods,
                // console.log(products),
                <DisplayProducts products={products} addToCart={addToCart} error={error} loading={loading} />
              )}
            </div>
          </>
        )
      }}
    </Store.Consumer>
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

function DisplayProducts({ products, error, loading, addToCart }) {
  const navigate = useNavigate();
  // console.log("123",products)
  return (
    <Store.Consumer>
      {({ isAdmin }) => {
        return (
          error ? <div style={{ color: "gray" }} className="mx-auto not-found">
            <span className="text-danger">Something went wrong<SentimentVeryDissatisfiedIcon />
              Please refresh the page</span>
          </div> : products.length === 0 ? <div style={{ color: "gray" }} className="mx-auto not-found">
            <span>Product not available now <SentimentDissatisfiedIcon /></span>
          </div> :
            <div className="row g-2 m-2">
              {products.map((prod) => {
                return (
                  <div style={{ cursor: "pointer" }} onClick={() => navigate(`/products/${prod._id}`)} key={prod._id} className="col-md-3 m-3  p-2 prod_details">
                    <div className="prod_pic m-1">
                      <img alt={prod.name} src={prod.image_url} style={{ width: "200px", height: "130px", objectFit: "contain" }} />
                    </div>
                    <span style={{ fontWeight: "bold" }} className="prod_name m-1">
                      {prod.name}
                    </span>
                    <span className="prod_price m-1"><span style={{ fontWeight: "500" }}>Price:</span><span style={{ fontWeight: "bold" }}>₹{prod.price}<span style={{ fontWeight: "350" }}>(per day)</span></span></span>
                    <span className="prod_price m-1"><span style={{ fontWeight: "500" }}>Category:</span><span style={{ fontWeight: "bold" }}>{prod.category}</span></span>
                    {!prod.isAvailable && <span className="text-danger">Out of stock</span>}
                    <ToastContainer />
                  </div>
                )
              })}
            </div>
        )
      }}
    </Store.Consumer>
  )
}



export default Product;
