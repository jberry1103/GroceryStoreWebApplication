import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior

        // Validate form data before submitting to backend
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // If there are validation errors, stop the form submission
            console.log('Form submission failed due to validation errors.');
            return;  // Exit the function early
        }

        try {
            // Send the login request to the backend
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,  // Send the correct data
                    password: formData.password
                })
            });

            // Check if the response is OK (200 status code)
            if (response.ok) {
                const data = await response.json();  // Parse the JSON response

                // Log success message from the backend
                console.log(data.message);  

                // Handle success (e.g., navigate to another page)
                navigate('/GroceryStore');  // Redirect to another page

                // Optionally clear the form
                setFormData({
                    email: '',  // Reset the email and password fields
                    password: '',
                });
                
            } else {
                // If the backend responds with an error, display the message
                const errorData = await response.json();  // Parse the error message
                alert(errorData.message || 'Authentication failed');  // Display the error message
            }

        } catch (error) {
            // Handle network errors or other unexpected issues
            alert('Submission failed: ' + error.message);
        }
    };

    // Form validation
    const validateForm = (data) => {
        const errors = {};

        // Check if email is valid
        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        // Check if password is provided
        if (!data.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Email:</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <span className="error-message">{errors.email}</span>
                    )}
                </div>
                <div>
                    <label className="form-label">Password:</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <span className="error-message">{errors.password}</span>
                    )}
                </div>
                
                <button className="submit-button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Login;
