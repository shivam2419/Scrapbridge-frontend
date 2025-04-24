import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import notificationIcon from '../assets/notification.png';
import defaultProfile from '../assets/default.jpg';
import '../style/Navbar.css';

export const Navbar = () => {
    let userName = localStorage.getItem("username");
    if(userName) {
        userName = userName.toUpperCase();
    }
    let profileImage = localStorage.getItem('user_profile'); 
    if(profileImage) {
        profileImage = "http://127.0.0.1:8000"+localStorage.getItem('user_profile');
    } else {
        profileImage = defaultProfile;
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const openNav = () => {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("nav-side-btn").style.display = "none";
    };

    const closeNav = () => {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("nav-side-btn").style.display = "block";
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:8000/api/logout/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
            });
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.clear();
            window.location.href = "/";
        }
    };
    
    const checkAuth = async () => {
        const token = localStorage.getItem("access"); // fetch latest token each time
        if (!token) {
            console.log("No token found");
            return;
        }
    
        try {
            const res = await fetch("http://127.0.0.1:8000/api/check-authentication/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            const data = await res.json();
            
            if (data.isAuthenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error("Auth check failed:", err);
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);
    

    return (
        <div>
            <div id="mySidebar" className="sidebar">
                <button className="closebtn" onClick={closeNav}>&times;</button>
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <Link to="/e-facility">E-Facilities</Link>
                <Link to="/education">Education</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/classify-image">Classify-Image</Link>
                {isAuthenticated && (
                    <>
                        <Link to="/notification">Notifications</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/" onClick={logout}>Logout</Link>
                    </>
                )}

                {!isAuthenticated && (
                    <Link to="/login">Login</Link>
                )}
            </div>

            <div className="main-content">
                <nav>
                    <span style={{ display: 'flex', marginBottom: '5px' }}>
                        <button className="openbtn" onClick={openNav} id="nav-side-btn" style={{ marginTop: '5px' }}>☰</button>
                        <Link to="/" className="logo">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </span>

                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/e-facility">E-Facilities</Link></li>
                        <li><Link to="/education">Education</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/classify-image">Classify-Image</Link></li>
                    </ul>

                    {isAuthenticated && (
                        <Link to="/profile"  className="right_side" style={{ display: 'flex', textDecoration: 'none', color: 'black' }}>
                            <button id="notification">
                                <Link to="/notification">
                                    <img src={notificationIcon} alt="Notification" />
                                </Link>
                            </button>

                            <li className="nav-item dropdown">
                                <span className="profile-image" id="profileImage">
                                    <img src={profileImage} alt="Profile" />
                                    <p>{userName}</p>
                                </span>
                            </li>
                        </Link>
                    )}
                    {!isAuthenticated && (<span>
                        <Link to="/login" className="btn">LOGIN</Link>
                    </span>)}
                </nav>
            </div>
        </div>
    );
};
