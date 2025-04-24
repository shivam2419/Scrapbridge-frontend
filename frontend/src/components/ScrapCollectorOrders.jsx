import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "../style/Scrap_Collector/Orders.css"; // You can extract the style into this file

const ScrapCollectorOrders = () => {
    const profileImg = "http://127.0.0.1:8000" + localStorage.getItem("user_profile");
    const user = {
        username: localStorage.getItem("username") ? localStorage.getItem("username") : "Undefined"
    };
    const [items, setItem] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("access");

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/order-details/${localStorage.getItem("user_id")}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                });

                const result = await response.json();
                if(response.ok) {
                    const normalized = Array.isArray(result.data) ? result.data : [result.data];
                    setItem(normalized);
                } else {
                    alert("Some error occured. Please try again later");
                    console.log("Error : ", result);
                }
                if(response.status === 403) {
                    alert("You are not Authorized")
                    window.location.href = "/login";
                } 
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };

        fetchData();
    }, []);
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
            window.location.href = "/login";
        }
    };
    return (
        <>
            <header>
                <div className="logosec">
                    <div className="logo">{user.username.toUpperCase()}</div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                        className="icn menuicn"
                        id="menuicn"
                        alt="menu-icon"
                    />
                </div>

                <div className="searchbar">
                    <input type="text" placeholder="Search" />
                    <div className="searchbtn">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                            className="icn srchicn"
                            alt="search-icon"
                        />
                    </div>
                </div>

                <div className="message">
                    <div className="circle"></div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
                        className="icn"
                        alt=""
                    />
                    <div className="dp">
                        <img
                            src={profileImg}
                            className="dpicn"
                            alt="dp"
                        />
                    </div>
                </div>
            </header>
            <div className="main-container">
                <div className="navcontainer">
                    <nav className="nav">
                        <div className="nav-upper-options">
                            <div className="nav-option opt">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                                    className="nav-img"
                                    alt="dashboard"
                                />
                                <h3><Link to="/scrap-collector">Dashboard</Link></h3>
                            </div>

                            <div className="option2 nav-option">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                                    className="nav-img"
                                    alt="articles"
                                />
                                <h3><Link to="/orders">Orders</Link></h3>
                            </div>

                            <div className="nav-option opt">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
                                    className="nav-img"
                                    alt="institution"
                                />
                                <h3><Link to="/pending-order">Pending Payments</Link></h3>
                            </div>

                            <div className="nav-option option6">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/4.png"
                                    className="nav-img"
                                    alt="settings"
                                />
                                <h3><Link to={`/scrap-collector/profile`}>Settings</Link></h3>
                            </div>

                            <div className="nav-option logout">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                                    className="nav-img"
                                    alt="logout"
                                />
                                <h3><Link onClick={logout}>Logout</Link></h3>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="main">
                    <h1>Orders:</h1>

                    <div className="table-container">
                        <table className="my-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Item Type</th>
                                    <th>Pickup Date</th>
                                    <th>Phone Number</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? (
                                    items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.item_type}</td>
                                            <td>
                                                {new Date(item.date).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </td>
                                            <td>{item.phone}</td>
                                            <td>
                                                <button>
                                                    <a href={`/scraprequest-details/${item.order_id}/`}>Inspect</a>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center" }}>No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScrapCollectorOrders;
