import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useSearchParams, useNavigate } from 'react-router-dom' // Add useNavigate import
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();
    
    const verifyPayment = async () => {
        const response = await axios.post(url+"/api/order/verify", {success, orderId});
        console.log("response", response);
        
        if (response.data.success) {
            navigate("/myorders");
        }
        else {
            navigate("/"); // Redirect to home page if payment verification fails
        }
    }

    useEffect(() => {
        verifyPayment();
    },[])

  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify