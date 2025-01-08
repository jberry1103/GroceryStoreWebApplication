
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signUp.css';
const PORT = process.env.PORT  || 9000;
function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);  // Track the submit state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        // If there are validation errors, stop here
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsSubmitting(true); // Start loading state

        try {
            const response = await fetch("/api/submit", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }) // Send only the necessary data to match your backend schema
            });
            let hello = response.json()
            console.log("hello", hello)
            if (!response.ok) {
                // alert(response.message);
                throw new Error('Username already exists!');
            }

            // Handle successful submission (e.g., redirect or show success message)
            navigate('/GroceryStore'); // Redirect to another page

            
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            // Handle errors (e.g., display error message)
            alert('Submission failed: ' + error.message);
        } finally {
            setIsSubmitting(false); // Stop loading state
        }
    };

    const validateForm = (data) => {
        const errors = {};

        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (!data.password) {
            errors.password = 'Password is required';
        } else if (data.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        if (data.confirmPassword !== data.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    return (
        <div className="form-group">
            <h2 className="form-title">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">
                        Name:
                    </label>
                    <input
                        className="form-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && (
                        <span className="error">
                            {errors.name}
                        </span>
                    )}
                </div>
                <div>
                    <label className="form-label">
                        Email:
                    </label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <span className="error">
                            {errors.email}
                        </span>
                    )}
                </div>
                <div>
                    <label className="form-label">
                        Password:
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <span className="error">
                            {errors.password}
                        </span>
                    )}
                </div>
                <div>
                    <label className="form-label">
                        Confirm Password:
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                        <span className="error">
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>
                <button
                    className="submit-button"
                    type="submit"
                    disabled={isSubmitting} // Disable the button while submitting
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default Form;