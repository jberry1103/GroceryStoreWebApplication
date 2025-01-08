import React, {  useState } from 'react';
import './GroceryPage.css'; // Import your CSS file for styling
// import { useHistory } from 'react-router-dom';
import broccoli from './images/broccoli.jpg';
import spinach from './images/Spinach.jpg';
import carrots from './images/carrots.jpg';
import radishes from './images/radishes.jpg';
import cucumbers from './images/cucumber.jpg';
import apple from './images/apple.jpg';
import banana from './images/banana.jpg';
import peach from './images/peach.jpg';
import lime from './images/lime.jpg';
import orange from './images/orange.jpg';
import ribeyeSteak from './images/steak.png';
import bonelessChicken from './images/chicken.png';
import turkey from './images/turkey.png';
import potato from './images/potatoes.png';
import tomato from './images/tomato.jpg';
import zucchini from './images/zucchini.jpg';
import lettuce from './images/lettuce.jpg';
import cabbage from './images/green-cabbage.jpg';
import hens from './images/hens.png';
import drumsticks from './images/drumsticks.png';


import { useNavigate } from 'react-router-dom';




const groceryPrices = {
    Broccoli: 2.00,
    Spinach: 1.50,
    Carrot: 3.00,
    Radish: 2.29,
    Cucumber: 1.50,
    Lettuce: 2.50,
    Potato: 2.50,
    Zucchini: 1.00,
    Tomato: 2.75,
    Apple: 2.00,
    Banana: 1.50,
    Peach: 2.75,
    Lime: 1.00,
    Orange: 1.67,
    Strawberry: 2.45,
    Blueberry: 2.20,
    Raspberry: 2.55,
    Steak: 15.55,
    Chicken: 9.89,
    Hen: 5.00,
    Cabbage: 2.25,
    Drumsticks: 5.67,
    Turkey: 8.00
};


const options = [
    "Broccoli",
    "Spinach",
    "Carrot",
    "Radish",
    "Cucumber",
    "Lettuce", 
    "Potato",
    "Zucchini",
    "Tomato",
    "Steak",
    "Cabbage",
    "Peach",
    "Hen",
    "Blueberry",
    "Raspberry",
    "Chicken",
    "Drumsticks"
];

function GroceryPage() {
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState('');
    const [alternativeItem, setAlternativeItem] = useState('');
    const [editingIndex, setEditingIndex] = useState(null); 
    const [totalCost, setTotalCost] = useState(0.00); 
    const [startButtonVisible, setStartButtonVisible] = useState(true);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [addAddressVisible, setAddAddressVisible] = useState(false);
    const [paymentOverlayVisible, setPaymentOverlayVisible] = useState(false);
    const [grociesCheckoutVisible, setgrociesCheckoutVisible] = useState(false);
    const [groceryList, setGroceryList] = useState([]);
    const [isVisaCheckboxChecked, setIsVisaCheckboxChecked] = useState(false);
    const [isPayPalCheckboxChecked, setIsPayPalCheckboxChecked] = useState(false);
    const [isPayButtonVisible, setIsPayButtonVisible] = useState(false);
    const [isAddItem, setIsAddItem] = useState(true);
    const [isUpdateItem, setIsUpdateItem] = useState(false);
    const [isPayPal, setIsPayPal] = useState(false)
    const [isVisa, setIsVisa] = useState(true);
    const [payPalUsername, setpayPalUsername] = useState('');
    const [payPalPassword, setpayPalPassword] = useState('');
    
    const [address, setAddress] = useState(['', '', '', '']);
        
    
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [payMethod, setPayMethod] = useState("");


      const [payment, setPayment] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardholderName: ''
      });
    
    

    const handleToggleOverlay = (item) => {
        const existingItemIndex = items.findIndex(i => i.name === item);
        
        if (existingItemIndex !== -1) {
            const itemToUpdate = items[existingItemIndex];
            setCurrentItem(itemToUpdate.name);
            setQuantity(itemToUpdate.quantity);
            setEditingIndex(existingItemIndex); 
            // setAlternativeItem(itemToUpdate.alternativeItem)
        } else {
            setCurrentItem(item);
            setQuantity(1); // Reset quantity to 1
        }
        
        setIsOverlayVisible(true); // Show overlay panel
    };

    const handleVisa = () => {
        setPayMethod("visa");
        
        setIsVisaCheckboxChecked(true);
        setIsPayPalCheckboxChecked(false);
        setIsVisa(true);
        setIsPayPal(false);
    }

    const handlePayPal = () => {
        setPayMethod("paypal");
        setIsVisaCheckboxChecked(false);
        setIsPayPalCheckboxChecked(true);
        setIsPayPal(true);
        setIsVisa(false);
        
        
    }
    const handleTogglePanel = async () => {
        setItems([]);
        setTotalCost(0.0);
        setStartButtonVisible(false);
        setIsDisabled(false);
        setIsPanelVisible(prev => !prev); // Toggle the visibility of the right panel
        // Send a request to the backend to delete the table (or perform any other cleanup)
        const response = await fetch('/api/deletetable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})  // You can add any required data here if needed
          });
    };

    const handlePayPage = async () => {
        
        setPaymentOverlayVisible(true);
        setgrociesCheckoutVisible(false);
        
        // navigate('/Payment');
    }

    const handleCheckboxChange = () => {
        setIsCheckboxChecked(prevChecked => !prevChecked); // Toggle checkbox state
        setAddAddressVisible(prevaddAddressVisible => !prevaddAddressVisible );
    };
    
   

    const handleAddItem = async () => {
        if (currentItem && quantity > 0) { // Ensure quantity is valid
            const price = groceryPrices[currentItem];  // Get price for the current item
            setIsPayButtonVisible(true);
    
            if (editingIndex !== null) { // If we're editing an item
                const updatedItems = [...items]; // Make a copy of the items
                const currentCost = updatedItems[editingIndex].quantity * updatedItems[editingIndex].price;
    
                setTotalCost(prevTotalCost => prevTotalCost - currentCost); // Subtract the old cost
    
                updatedItems[editingIndex] = { name: currentItem, quantity, price, alternativeItem }; // Update the item
    
                setItems(updatedItems); // Set the updated list of items
                setEditingIndex(null); // Reset editing index after update
    
                // Reset alternative item if needed
                if (updatedItems[editingIndex].alternativeItem === 'Please choose one option') {
                    setAlternativeItem('');
                }
    
                try {
                    const response = await fetch('/api/grocerylist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: currentItem,
                            quantity: quantity,
                            price: quantity * price,
                            alternativeItem: alternativeItem,
                        })
                    });
    
                    await response.json();
    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                } catch (error) {
                    console.error('Error during fetch:', error);
                    alert('Submission failed: ' + error.message);
                }
    
            } else { // If we're adding a new item
                if (alternativeItem === 'Please choose one option') {
                    setAlternativeItem(''); // Reset alternative item if it's the default option
                }
    
                setItems([...items, { name: currentItem, quantity, price, alternativeItem }]); // Add the new item
    
                try {
                    const response = await fetch('/api/grocerylist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: currentItem,
                            quantity: quantity,
                            price: quantity * price,
                            alternativeItem: alternativeItem,

                        })
                    });
    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                } catch (error) {
                    console.error('Error during fetch:', error);
                    alert('Submission failed: ' + error.message);
                }
            }
    
            // Clear inputs and hide overlay after adding/updating
            setCurrentItem(''); // Clear current item
            setQuantity(1); // Reset quantity to 1 after adding
            setIsOverlayVisible(false); // Close the overlay after adding/updating
    
            const currentCost = quantity * price;
            setTotalCost(prevTotalCost => prevTotalCost + currentCost); // Add the new cost to the total
        }
    };
    
   
    const handleRemoveItem = async (index) => {
        const newItems = items.filter((_, i) => i !== index);
        const currentCost = items[index].quantity * items[index].price;
        setTotalCost(prevTotalCost => prevTotalCost - currentCost);
        setAlternativeItem('')

        setItems(newItems);
        const currentItemValue = items[index].name;
        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: currentItemValue,

                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('Submission failed: ' + error.message);
        }
        // If removing the currently edited item, reset the editing index
        if (editingIndex === index) {
            setEditingIndex(null); // Reset editing index
            setCurrentItem(''); // Clear the current item
            setQuantity(1); // Reset quantity to 1
            setAlternativeItem('');
            
        }
        
    };
    



    const gotoConfirmationPage = async () => {
        // Validate the fields here
        console.log('payMethod');
        if (payMethod != "paypal") {
        if (!payment.cardholderName || !payment.expirationDate || !payment.cvv || !payment.cardholderName) {
            alert("Please fill in all fields.");
            return;
        } else if (payment.cvv.length != 3){
            alert("CVV is only three numbers");
            return;
        }
        
        
            
            const payload = {
                address: {
                    street: address[0],
                    city:  address[1],
                    state: address[2],
                    zip: address[3]
                },
                payment: {
                    cardholderName: payment.cardholderName,
                    cardNumber: payment.cardNumber,
                    expirationDate: address.expirationDate,
                    cvv: payment.cvv,
                    isDeliverySelected: isCheckboxChecked,
                    payMethod: payMethod,
                    totalcost: totalCost
                }
            };

            navigate('/Payment');
            try {
                const response = await fetch('/api/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload), // Sending the data as JSON
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Order submitted successfully:', data);
                    // Optionally, redirect to the confirmation page or handle success
                } else {
                    throw new Error('Failed to submit order');
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle error (e.g., show a notification or alert)
            }
        } else {
            if (!payPalUsername || !payPalPassword) {
                alert("Please fill in all fields.");
                return;
            }
            const payload = {
                address: {
                    street: address[0],
                    city:  address[1],
                    state: address[2],
                    zip: address[3]
                },
                payment: {
                    username: payPalUsername,
                    password: payPalPassword,
                    isDeliverySelected: isCheckboxChecked,
                    payMethod: payMethod,
                    totalcost: totalCost
                }
            };
            navigate('/Payment');
            try {
                const response = await fetch('/api/paypal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload), // Sending the data as JSON
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Order submitted successfully:', data);
                    // Optionally, redirect to the confirmation page or handle success
                } else {
                    throw new Error('Failed to submit order');
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle error (e.g., show a notification or alert)
            }
        }
            
        
        
        // Here you would typically process the payment
        // alert(`Processing payment of $${totalCost.toFixed(2)} for ${cardholderName}`);
        navigate('/Payment');
    }


   
   
    const handleCancelingOrder = async () => {
        setIsPanelVisible(false);  // Hide the panel
        setStartButtonVisible(true);  // Show the start button
        setIsDisabled(true);  // Disable the button if needed
        setIsPayButtonVisible(false);
        // Check if there are any items in the list
        if (items.length >= 0) {
          try {
            
            // Send a request to the backend to delete the table (or perform any other cleanup)
            const response = await fetch('/api/deletetable', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})  // You can add any required data here if needed
            });

            
            // Await the response to make sure the operation completes
            const data = await response.json();
      
            // Handle the response if necessary (success or failure)
            if (response.ok) {
              console.log('Table deleted successfully');
            } else {
              console.error('Failed to delete table', data);
            }
          } catch (error) {
            console.error('Error during deletion:', error);
          }
        } else {
          // Handle the case when there are no items in the list
          console.log('No items to cancel');
        }
      };
      

    const handleGoBackPayment =() => {
        setPaymentOverlayVisible(false);
    }

    const handleStartPayment =() => {
        
            fetch("/api/groceries")
            .then((response) => {
               if (!response.ok) {
                throw new Error("Network response was not ok.")
               }
               return response.json();
            })
            .then((data) => {
                setGroceryList(data);
            })
            

        setgrociesCheckoutVisible(true);
    }
  
    const handleAlternativeItem = (event) =>  {
        if (event.value === 'Please choose one option'){
            setAlternativeItem('');
        } else {
            setAlternativeItem(event.target.value);
        }
       
    }

    const calculateTotalPrice = () => {
        let total = 0;
        for (let i = 0; i < groceryList.length; i++){
            total += parseFloat(groceryList[i].price);
        }
        return total;
    }
  
    const handleAddressChange = (index, value) => {
        setAddress((prevAddress) => {
            const newAddress = [...prevAddress];
            newAddress[index] = value;
            return newAddress;
        }
        )
    }
    return (
        <div>
            
            <div className="grocery-container">
            <div className={`groceries ${isDisabled ? 'disabled' : ''}`}>
                <div className="vegetable-buttons">
                <h2> Vegetables </h2>
                <div className="first-vegetable-button-page">
                    <button onClick={() => handleToggleOverlay('Broccoli')} className = "grocery-buttons">
                        <img src={broccoli} alt="broccoli" className="grocery-items" />
                        <p> Broccoli </p>
                        <p> $2.00 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Spinach')} className = "grocery-buttons">
                        <img src={spinach} alt="spinach" className="grocery-items" />
                        <p> Spinach </p>
                        <p> $1.50 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Carrot')} className = "grocery-buttons">
                        <img src={carrots} alt="carrots" className="grocery-items" />
                        <p> Carrot </p>
                        <p> $3.00 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Radish')} className = "grocery-buttons">
                        <img src={radishes} alt="radishes" className="grocery-items" />
                        <p> Radish </p>
                        <p> $2.29 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Cucumber')} className = "grocery-buttons">
                        <img src={cucumbers} alt="cucumbers" className="grocery-items" />
                        <p> Cucumber </p>
                        <p> $1.50 </p>
                    </button>
                    
                    
                    </div>
                    <div className="first-vegetable-button-page">
                    <button onClick={() => handleToggleOverlay('Potato')} className = "grocery-buttons">
                        <img src={potato} alt="potato" className="grocery-items" />
                        <p> Potato </p>
                        <p> $2.50 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Zucchini')} className = "grocery-buttons">
                        <img src={zucchini} alt="zuchinni" className="grocery-items" />
                        <p> Zucchini </p>
                        <p> $1.00 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Tomato')} className = "grocery-buttons">
                        <img src={tomato} alt="tomato" className="grocery-items" />
                        <p> Tomato </p>
                        <p> $2.75 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Lettuce')} className = "grocery-buttons">
                        <img src={lettuce} alt="lettuce" className="grocery-items" />
                        <p> Lettuce </p>
                        <p> $2.50 </p>
                    </button>
                    <button onClick={() => handleToggleOverlay('Cabbage')} className = "grocery-buttons">
                        <img src={cabbage} alt="cucumbers" className="grocery-items" />
                        <p> Cabbage </p>
                        <p> $2.25 </p>
                    </button>
                    
                    
                    </div>
                
                <h2> Fruits </h2>
                
                    <div className="first-fruit-button-page">
                        <button onClick={() => handleToggleOverlay('Apple')} className="grocery-buttons">
                            <img src={apple} alt="apple" className="grocery-items" />
                            <p> Apple </p>
                            <p> $2.00 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Banana')} className="grocery-buttons">
                            <img src={banana} alt="banana" className="grocery-items" />
                            <p> Banana </p>
                            <p> $1.50 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Peach')} className="grocery-buttons">
                            <img src={peach} alt="peach" className="grocery-items" />
                            <p> Peach </p>
                            <p> $2.75 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Lime')} className="grocery-buttons">
                            <img src={lime} alt="lime" className="grocery-items" />
                            <p> Lime </p>
                            <p> $1.00 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Orange')} className="grocery-buttons">
                            <img src={orange} alt="orange" className="grocery-items" />
                            <p> Orange </p>
                            <p> $1.67 </p>
                        </button>
                        
                    </div>
                    <h2> Poultry </h2>
                    <div className="first-fruit-button-page">
                        <button onClick={() => handleToggleOverlay('Steak')} className="grocery-buttons">
                            <img src={ribeyeSteak} alt="Ribeye Steak" className="grocery-items" />
                            <p> Steak </p>
                            <p> $15.55 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Chicken')} className="grocery-buttons">
                            <img src={bonelessChicken} alt="Chicken" className="grocery-items" />
                            <p> Chicken </p>
                            <p> $9.89 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Turkey')} className="grocery-buttons">
                            <img src={turkey} alt="peach" className="grocery-items" />
                            <p> Turkey </p>
                            <p> $8.00 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Hen')} className="grocery-buttons">
                            <img src={hens} alt="lime" className="grocery-items" />
                            <p> Cornish Hen </p>
                            <p> $5.00 </p>
                        </button>
                        <button onClick={() => handleToggleOverlay('Drumsticks')} className="grocery-buttons">
                            <img src={drumsticks} alt="drumsticks" className="grocery-items" />
                            <p> Orange </p>
                            <p> $5.67 </p>
                        </button>
                        
                    </div>
                
                
                </div>
                </div>
               
                    <div className="right-panel">
                        {startButtonVisible && 
                            <button className= "start-Grocery"onClick={handleTogglePanel}>
                Start Grocery
                        </button>
                        }   
                        {isPanelVisible && (
                            <div>
                        <h1>Grocery List</h1>
                        <ul >
                            {items.map((item, index) => (
                                <li key={index} class="add-item" >
                                    {item.name} (x{item.quantity}) - ${item.quantity.toFixed(3) * item.price.toFixed(3)} <> </>
                                    <p>Alternative: {item.alternativeItem}</p>
                                    <p> </p>
                                    <button onClick={() => handleRemoveItem(index)}>Remove</button>
                                    <button onClick={() => handleToggleOverlay(item.name)}>Update</button>
                                    
                                </li>
                            ))}
                        </ul>
                        
                        
                           <p> <p> 
                            <p>
                            <p>  Total: ${totalCost.toFixed(2)}</p>
                            {isPayButtonVisible && (
                            <button onClick={handleStartPayment}className="summary-button"> Pay </button>
                            )}
                            <button onClick={handleCancelingOrder}className="summary-button"> Cancel</button>
                            </p>
                            
                        
                       </p>
                       </p> 
                       </div>
                    )}
                    </div>
                
                {isOverlayVisible && (
                    <div className="overlay">
                        <div className="overlay-content">
                        <h1>{editingIndex !== null ? `Update ${currentItem}` : `Add ${currentItem}`}</h1>
                            <p> </p>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min="1"
                                placeholder="Quantity"
                            />
                            <p> 
                            Choose an Alternative: <> </>
                            <select value={alternativeItem} onChange={handleAlternativeItem}
                            >
                                    <option>  </option> 
                                    {options.map((option, index) => {
                                    return (
                                        <option key={index}>
                                            {option}
                                        </option>
                                    );
                                    })}
                            </select>
                            </p>
                            <div>

                            <button onClick={handleAddItem}>{editingIndex !== null ? 'Update Item' : 'Add Item'}</button>
                            <button onClick={() => setIsOverlayVisible(false)}>Go Back</button>
                            
                            </div> 
                        </div>
                    
                    </div>
                )}
                {grociesCheckoutVisible && (
                    
                    <div className="overlay">
                        <div className="flex-container">
                            <div >
                                <h1> Grocery List: </h1>
                                <ul className="grocery.check"> 
                                    {/* {setTotalPrice(0.00)}; */}
                                    
                                    {groceryList.length > 0 ? (
                                        groceryList.map((grocery, index) => (
                                        <li key={index} className="grocery-value">{grocery.name} - Quantity: {grocery.quantity}  - 
                                                         Price: ${grocery.price}    
                                        </li>
                                        
                                    ))
                                    ) : (
                                        <li>No groceries available</li>
                                    )}

                                    
                                </ul>
                                <h4> Total Price: ${calculateTotalPrice()}</h4>
                                <button onClick={handlePayPage}>Pay</button>
                            
                            <button onClick={() => setgrociesCheckoutVisible(false)}>Go Back</button>
                            </div>
                    
                        </div>
                    </div>
                )}
                {paymentOverlayVisible && (
                    <div className="overlay">
                        <div className="payment">
                        <h1> Pay</h1>
                        <h2> Total Cost: ${totalCost.toFixed(2)} </h2>
                        <p> </p> 
                        <label className="checkbox">
                        <input
                            onChange={handleCheckboxChange}
                            type="checkbox"
                            checked={isCheckboxChecked}
                             />
                            Delivery
                        </label>
                        <p> </p>
                        {addAddressVisible && (<div>
                            <h2>Delivery Address</h2>
                            <div>
                                <label>
                                    Street:
                                    <input 
                                        type="text"
                                        value={address[0]}
                                        onChange={(e) => handleAddressChange(0, e.target.value)}
                                        placeholder="123 Main St"
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    City:
                                    <input
                                        type="text"
                                        value={address.city}
                                        onChange={(e) => handleAddressChange(1, e.target.value)}
                                        placeholder="Anytown"
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    State:
                                    <input
                                        type="text"
                                        value={address.state}
                                        onChange={(e) => handleAddressChange(2, e.target.value)}
                                        placeholder="CA"
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    ZIP Code:
                                    <input
                                        type="text"
                                        value={address.zip}
                                        onChange={(e) => handleAddressChange(3, e.target.value)}
                                        placeholder="12345"
                                    />
                                </label>
                            </div>
                            </div>
                        )}


        <h2> Payment Information</h2>
                    <label className="checkbox">
                    <input
                            
                            type="checkbox"
                            onChange={handleVisa}
                            checked={isVisaCheckboxChecked}
                             />
                            Visa
                        </label>
                        <label className="checkbox">
                    <input
                            
                            type="checkbox"
                            onChange={handlePayPal}
                            checked={isPayPalCheckboxChecked}
                             />
                            PayPal
                        </label>
        {isVisa && (
        <div>            
        <p> </p>                 
        <h2>Credit Card Information</h2>
            <div>
                <label>
                    Cardholder Name:
                    <input
                        type="text"
                        value={payment.cardholderName}
                        onChange={(e) => setPayment(prevState => ({ ...prevState, cardholderName: e.target.value }))}
                        placeholder="John Doe"
                    />
                </label>
            </div>
            <div>
                <label>
                    Card Number:
                    <input
                        type="text"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment(prevState => ({ ...prevState, cardNumber: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                    />
                </label>
            </div>
            <div>
                <label>
                    Expiration Date:
                    <input
                        type="text"
                        value={payment.expirationDate}
                        onChange={(e) => setPayment(prevState => ({ ...prevState, expirationDate: e.target.value }))}
                        placeholder="MM/YY"
                    />
                </label>
            </div>
            <div>
                <label>
                    CVV:
                    <input
                        type="text"
                        value={payment.cvv}
                        onChange={(e) => setPayment(prevState => ({ ...prevState, cvv: e.target.value }))}
                        placeholder="123"
                    />
                </label>
            </div>
            </div>
                    )}
                    {isPayPal && (
                        <div>
                         <h2> Pay Pal Information</h2>
                            <label>
                                Username:
                                <input
                                    type="text"
                                    value={payPalUsername}
                        
                                    onChange={(e) => setpayPalUsername(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </label>
                            <div> </div>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    value={payPalPassword}
                        
                                    onChange={(e) => setpayPalPassword(e.target.value)}
                                    
                                />
                            </label>
                        </div>
                    )}
                        <div>
                            <button onClick={gotoConfirmationPage}>Pay</button>
                            
                            <button onClick={() => handleGoBackPayment(false)}>Go Back</button>
                        </div>  
                    
                        </div>
                    
                    </div>
                    )}
            </div>
                    
        </div>
    );
}




export default GroceryPage;
