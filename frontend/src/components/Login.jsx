import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Login.css';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [userType, setUserType] = useState('user'); // 'user' or 'recycler'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let { username, password } = formData;

        if (!username || !password) {
            alert('Please fill in both fields');
            return;
        }

        username = username.includes(" ")
            ? username.replace(/ /g, "_").toLowerCase()
            : username.toLowerCase();

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                const user_info = await fetch("http://localhost:8000/api/auth/user/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access}`,
                    },
                });

                const result = await user_info.json();
                if (result) {
                    localStorage.setItem("user_id", result.id);
                    localStorage.setItem("username", result.username);
                    localStorage.setItem("email", result.email);
                    localStorage.setItem("role", result.role);
                    localStorage.setItem("user_profile", result.user_profile);
                }

                alert('User logged in successfully!');
                navigate(result.role === "user" ? "/" : "/scrap-collector");
                window.location.reload();
            } else {
                alert(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }

        setFormData({ username: '', password: '' });
    };

    const togglePassword = () => {
        const pwd = document.getElementById('password');
        pwd.type = pwd.type === 'password' ? 'text' : 'password';
    };

    const handleGoogleLogin = async (credentialResponse) => {
        const access_token = credentialResponse.credential;

        try {
            const response = await fetch("http://localhost:8000/auth/google/google-oauth2/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_token,
                    user_type: userType,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // You can skip storing access_token if not using JWT
                localStorage.setItem("user_id", data.user.id);
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("email", data.user.email);
                localStorage.setItem("role", data.user.role);

                alert("Google login successful!");

                navigate(data.user.role === "user" ? "/" : "/scrap-collector");
                window.location.reload();
            } else {
                alert(data.error || "Google login failed.");
            }
        } catch (err) {
            console.error("Google Login Error:", err);
            alert("Something went wrong during Google login.");
        }
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h1>Welcome back!</h1>
                <p>Please enter your details here</p>
                <br />

                <label htmlFor="username">User name*</label>
                <br />
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <label htmlFor="password">Password*</label>
                <br />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />

                <span>
                    <span className="left">
                        <input
                            type="checkbox"
                            id="show-password-checkbox"
                            style={{ width: '20px' }}
                            onChange={togglePassword}
                        />
                        <label htmlFor="show-password-checkbox">Show password</label>
                    </span>
                    <span className="right">
                        <a href="#">Forget password?</a>
                    </span>
                </span>

                <button type="submit" id="login-btn">Login</button>

                {/* <div className="google-login-section">
                    <label>Select Role:</label>
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="user">User</option>
                        <option value="recycler">Recycler</option>
                    </select>

                    <br /><br />
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            alert("Google login failed.");
                        }}
                    />
                </div> */}

                <span id="signupBtn">
                    <p>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </span>
            </form>
        </div>
    );
};
