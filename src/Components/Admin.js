import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import { Store } from '../Context';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const Admin = () => {
    document.title = "Your products";
    const navigate = useNavigate();
    const [prods, setProds] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const store = React.useContext(Store);
    let { adminProducts } = React.useContext(Store);
    React.useEffect(() => {
        if (!TokenCheck() || localStorage.getItem('isAdmin') !== "true") {
            navigate("/login");
            return;
        }
        getProducts();
    }, [])
    async function checkRent(values) {
        try {
            setLoading(true);
            const data = await axios({
                method: "GET",
                url: `https://renteasy121.herokuapp.com/admin/getRentedProducts?isRented=${values}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setProds(data.data);
            setLoading(false);
        }
        catch (e) {
            setError(true);
            setLoading(false);
        }
    }
    async function getProducts() {
        try {
            setLoading(true);
            const data = await axios({
                method: 'get',
                url: "https://renteasy121.herokuapp.com/admin/getProducts",
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setProds(data.data);
            setLoading(false);
        }
        catch (e) {
            setError(true);
            setLoading(false);
        }
    }
    return (
        <div className="container-fluid mt-5">
            <div className="categorize m-2">
                <div className="category">
                    <label style={{ fontWeight: 'bold' }}>Search By Availability:</label>{" "}
                    <select onChange={(e) => checkRent(e.target.value)}>
                        <option value="all">all</option>
                        <option value={true}>Rented</option>
                        <option value={false}>Not rented</option>
                    </select>
                </div>
            </div>
            {loading ? (<LoadingIcon />) : (
                adminProducts = prods,
                // console.log(products),
                <DisplayProducts products={adminProducts} error={error} />
            )}
        </div>
    )
}

function DisplayProducts({ products, error }) {
    const navigate = useNavigate();
    return (
        error ? <div style={{ color: "gray" }} className="mx-auto not-found">
            <span className="text-danger">Something went wrong<SentimentVeryDissatisfiedIcon />
                Please refresh the page</span>
        </div> : products.length === 0 ? <div style={{ color: "gray" }} className="mx-auto not-found">
            <span>Not uploaded any product?? <SentimentDissatisfiedIcon /> <NavLink to="/addProduct"><span style={{ color: "blue" }}>Click here to add your first product</span></NavLink></span>
        </div> :
            <div className="row g-2 m-2">
                {products.map((prod) => {
                    return (
                        <div key={prod._id} className="col-md-3 m-3 p-2 prod_details">
                            <div className="prod_pic m-1">
                                <img alt={prod.name} src={prod.image_url} style={{ width: "200px", height: "130px", objectFit: "contain" }} />
                            </div>
                            <span style={{ fontWeight: "bold" }} className="prod_name m-1">
                                {prod.name}
                            </span>
                            <span className="prod_category m-1"><span style={{ fontWeight: "500" }}>Catgeory:</span><span style={{ fontWeight: "bold" }}>{prod.category}</span></span>
                            <span className="prod_price m-1"><span style={{ fontWeight: "500" }}>Price:</span><span style={{ fontWeight: "bold" }}>₹{prod.price}</span></span>
                            <span className="prod_quantity m-1"><span style={{ fontWeight: "500" }}>QuantityLeft:</span><span style={{ fontWeight: "bold" }}>{prod.quantity}</span></span>
                            <span className="prod_quantity m-1"><span style={{ fontWeight: "500" }}>Products Bought:</span><span style={{ fontWeight: "bold" }}>{prod.quantityBought}</span></span>
                            <button class="btn btn-success" onClick={() => navigate(`/admin/${prod._id}`)} >Modify</button>
                            {/* <span className="prod_quantity m-1"><span style={{ fontWeight: "500" }}>Quantity Bought:</span><span style={{ fontWeight: "bold" }}>{prod.quantity-prod.quantityLeft}</span></span> */}
                            {/* <div>

                            </div> */}
                        </div>
                    )
                })}
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

export default Admin
