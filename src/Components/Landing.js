import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Store } from '../Context';
const Landing = () => {
    document.title = "Rent Easy";
    const style = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
    return (
        <Store.Consumer>
            {(context) => {
                // console.log("Landing", context);
                return (
                    <div className="container-md mt-5 landing" style={style}>
                        <div className="title">
                            The <HomeIcon /> for easy renting of products!
                        </div>
                        <div className="title_pic">
                        <img src="https://media.istockphoto.com/photos/hands-of-customer-receiving-a-cardboard-boxes-parcel-from-delivery-picture-id1185373152?k=20&m=1185373152&s=612x612&w=0&h=T5hEjsGIU8D_zLW9KOIRBizq0my4UmDrNBH-W2HIEsc=" className="pic"  stlye={{ objectFit: "contain" }} alt="renteasy"></img>
                        </div>
                    </div>
                )
            }}
        </Store.Consumer>
    )
}

export default Landing
