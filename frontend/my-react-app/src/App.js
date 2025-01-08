import './App.css';
import SignUp from './signUp.js';
import Login from './login.js'; 
import GroceryStore from './GroceryPage.js';   
import PaymentPage from './payment.js';   
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import shoppingCart from "./images/shoppingcart.jpg";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />       {/* Home page route */}
        <Route path="/signUp" element={<SignUp />} />   {/* Sign Up page route */}
        <Route path="/login" element={<Login />} />       {/* Login page route */}
        <Route path="/GroceryStore" element={<GroceryStore />} /> {/* Grocery Store route */}
        <Route path="/payment" element={<PaymentPage />} /> {/* Payment page route */}
      </Routes>
    </BrowserRouter>
  );
}

function NavBar() {
  return (
    <nav className="name">
      <ul className="list">
        <li className="Home-Link">
          <Link to="/" >Home</Link> {/* Link to Home */}
        </li>
      </ul>
    </nav>
  );
}

function SignUpButton() {
  return (
    <Link to="/signUp"> 
      <button type="button" id="createAccount" className="signin-buttons">Sign Up</button>
    </Link>
  );
}

function LogIn() {
  return (
    <Link to="/login"> 
      <button type="button" id="login" className="signin-buttons">Log in</button>
    </Link>
  );
}

function Home() {
  return (
    <div class="home-page">
      <img className="logo" src={shoppingCart} alt="logo" />
      <div className = "online"><p>Online Grocery</p></div>
      <SignUpButton /> {/* Sign Up button */}
      <LogIn />
    </div>
  );
}

export default App;
