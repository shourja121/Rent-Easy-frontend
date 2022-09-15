import "./App.css"
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import ProdDetails from './Components/ProdDetails'
import Product from "./Components/Product";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Register from './Components/Register';
import Admin from "./Components/Admin";
import NotFound from './Components/NotFound';
import AddProducts from "./Components/AddProducts";
import MyCart from "./Components/MyCart";
import Redirect from "./Components/Redirect";
import Success from "./Components/Success";
import EditProducts from "./Components/EditProducts";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/products" element={<Product />}></Route>
        <Route exact path="/products/:id" element={<ProdDetails />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/admin" element={<Admin />} />
        <Route exact path="/addProduct" element={<AddProducts />} />
        <Route exact path="/myCart" element={<MyCart />} />
        <Route exact path="/redirect" element={<Redirect />} />
        <Route exact path="/success" element={<Success />} />
        <Route exact path="/admin/:id" element={<EditProducts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
