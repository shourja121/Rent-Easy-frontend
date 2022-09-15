import React from 'react'
import { useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const Success = () => {
    const location = useLocation();
    console.log(location);
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center">
            <h3 className="text-success">Payment success <CheckCircleOutlineIcon style={{ color: "green[500]" }} />,Order_Id:{location.state.order_id}</h3>
        </div>
    )
}

export default Success
