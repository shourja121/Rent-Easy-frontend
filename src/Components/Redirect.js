import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';


const Redirect = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    React.useEffect(() => {
        navigate(`/success`, { state: { order_id: searchParams.get("order_id") } });
    }, [])
    return (
        <div>

        </div>
    )
}

export default Redirect
