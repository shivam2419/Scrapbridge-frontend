import React, { useEffect, useState } from 'react';
import '../style/Signup.css';
import { Link } from 'react-router-dom';

export const Signup = () => {
    const [password, setPassword] = useState(""); // To get continous updating password
    const [confirmPassword, setConfirmPassword] = useState("");
    const [lengthError, setLengthError] = useState(''); // To show password constraints
    const [matchError, setMatchError] = useState(''); // To show error is password and matching password does not match
    const [formData, setFormData] = useState({ // Form data
        username: '',
        email: '',
        password: '',
        role: '',
    });

    useEffect(() => {
        // Password contraints
        if (password.length > 0 && password.length < 8) {
            setLengthError('Password length must be at least 8 characters');
        } else {
            setLengthError('');
        }
        if (confirmPassword && password !== confirmPassword) {
            setMatchError('Password and confirm password must match');
        } else {
            setMatchError('');
        }
    }, [password, confirmPassword]);

    const togglePassword = () => {
        const pwd = document.getElementById('password');
        const confirmPwd = document.getElementById('confirm-password');
        const type = pwd.type === 'password' ? 'text' : 'password';
        pwd.type = type;
        confirmPwd.type = type;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (lengthError || matchError || formData.username === "" || formData.email === "") {
            alert('Please fix the errors before submitting.');
            return;
        }
        if(formData.role === '') {
            alert('Please choose your role (category)');
            return;
        }
        if (formData.username.includes(" ")) {
            // Replace whitespace with underscores
            formData.username = formData.username.replace(/ /g, "_");
            formData.username = formData.username.toLowerCase();
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register-user/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if(response.status === 201) {
                alert('User registered successfully!');
                window.location.href = '/login';
            } else if(response.status === 400) {
                alert('All fields are required');
            } 
        } catch (error) {
            console.error('Error sending data to API:', error);
            alert('Registration failed. Please try again.');
        }
        setFormData({ username: '', email: '', password: '', role: '' });
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h1>Welcome to ScrapBridge</h1>
                <br />

                <label htmlFor="username">User name*</label>
                <br />
                <input
                    type="text"
                    placeholder="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                />
                <br /><br />

                <label htmlFor="email">Email*</label>
                <br />
                <input
                    type="text"
                    placeholder="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
                <br /><br/>

                <label htmlFor="password">Password*</label>
                <br />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    id="password"
                    value={password}
                    required
                    onChange={(e) => {
                        setPassword(e.target.value);
                        handleChange(e);
                    }}
                />
                <span style={{ color: 'red', marginBottom:'8px' }}>{lengthError}</span>

                <label htmlFor="confirm-password">Confirm Password*</label>
                <br />
                <input
                    type="password"
                    placeholder="confirm password"
                    name="confirm_Password"
                    id="confirm-password"
                    value={confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span style={{ color: 'red', marginBottom:'8px' }}>{matchError}</span>
                <label htmlFor="user-role">Select Role*</label>
                <br /> 
                <select name="role" id="role" value={formData.role} onChange={handleChange}>
                    <option value="" disabled>--Select one option--</option>
                    <option value="user">User</option>
                    <option value="recycler">Scrap Collector</option>
                </select>
                <span>
                    <span className="left">
                        <input
                            type="checkbox"
                            id="show-password-checkbox"
                            style={{ width: '20px' }}
                            onChange={togglePassword}
                        />
                        <label htmlFor="show-password-checkbox">show password</label>
                    </span>
                    <span className="right">
                        <a href="#">Forget password?</a>
                    </span>
                </span>
                <input type="submit" value="Signup" id="signup-btn" />

                <button className="google-btn" type="button">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                        alt="Google Logo"
                    />
                    <span>Login With Google</span>
                </button>

                <div id="loginBtn">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    );
};
