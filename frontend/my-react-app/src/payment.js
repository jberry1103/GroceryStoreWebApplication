import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './payment.css';
import shoppingCart from "./images/shoppingcart.jpg";
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [confirmationPage, setconfirmationPage] = useState(true);
    const [cancelOrder, setcancelOrder] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const handleCancel = (e) => {
        setIsOverlayVisible(true);
        
    }
    const navigate = useNavigate();
    const handleCancelOrder = async (e) => {
        
        const response = await fetch("/api/deleteOrder", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                
        });
        navigate('/GroceryStore');
    }
    const handleOrder = (e) => {
        navigate('/GroceryStore');
    }
    return (
        //class="confirmation"
        <div>
        
        <div class="confirmation-order"> 
             <img className="logo-image" src={shoppingCart} alt="logo" />
            <h1 class="gfg"> Thank You for Shopping with Online Grocery!</h1> 
            <h2 class="order"> Your Order is confirmed!</h2>
            <button class="cancelbutton" onClick={handleOrder} > Make a New Order </button> 
            <button class="cancelbutton" onClick={handleCancel} > Cancel Order </button>
        </div> 
        
        {isOverlayVisible && (
            <div className="overlay">
                 <div className="confirm-cancel">
                    <h1> Confirm Cancel Order </h1>
                    <h2> Are you sure you want to Cancel your Order? </h2>
                    <button class="confirmCancelbutton" onClick={handleCancelOrder} > Cancel Order </button>
                    
                </div>
            </div>
        )}
       
        </div>
    )
};

export default PaymentPage;
