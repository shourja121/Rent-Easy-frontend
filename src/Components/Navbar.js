import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Store } from '../Context';
import { TokenCheck } from '../TokenCheck';
import Logout from './Logout';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';

const Navbar = () => {
    const navigate = useNavigate();
    function toLandingPage() {
        navigate("/")
    }

    // context.isAdmin=true;
    // console.log(context);
    return (
        <nav className="navbar navbar-expand-sm sticky-top navbar-light bg-primary">
            <a onClick={() => toLandingPage()} className="navbar-brand logo" >RentEasy
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" aria-current="page">
                            <NavLink to="/products">Products</NavLink>
                        </a>
                    </li>
                    {!TokenCheck() && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/login">Login</NavLink>
                        </a>
                    </li>}
                    {!TokenCheck() && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/register">Register</NavLink>
                        </a>
                    </li>}
                    {TokenCheck() && localStorage.getItem("isAdmin") === "true" && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/admin">Your products</NavLink>
                        </a>
                    </li>}
                    {TokenCheck() && localStorage.getItem("isAdmin") === "true" &&
                        <li className="nav-item">
                            <a className="nav-link">
                                <NavLink to="/addProduct">Add product</NavLink>
                            </a>
                        </li>
                    }
                    {TokenCheck() && localStorage.getItem("isAdmin") === "false" &&
                        <li className="nav-item">
                            <a className="nav-link">
                                <NavLink to="/myCart">My Cart <ShoppingCartRoundedIcon /></NavLink>
                            </a>
                        </li>
                    }

                    {TokenCheck() && <li className="nav-item">
                        <a className="nav-link" onClick={Logout}>
                            <NavLink to="/">Logout</NavLink>
                        </a>
                    </li>}
                </ul>
            </div>
        </nav>
    )

}

export default Navbar
