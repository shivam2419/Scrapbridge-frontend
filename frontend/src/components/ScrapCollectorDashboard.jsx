import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Scrap_Collector/style.css';
import '../style/Scrap_Collector/responsive.css';

const ScrapCollectorDashboard = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const profileImg = "http://127.0.0.1:8000" + localStorage.getItem("user_profile");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/transaction-details/${localStorage.getItem("user_id")}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.data);
          for (const transaction of data.data) {
            const enduser_id = transaction.user;

            // If user data is not already in state, fetch user details
            if (!users[enduser_id]) {
              const userResponse = await fetch(`http://localhost:8000/api/enduser/${enduser_id}/`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
              });

              if (userResponse.ok) {
                const userData = await userResponse.json();
                setUsers(prev => ({
                  ...prev,
                  [enduser_id]: userData.username,
                }));
              }
            }
          }
        }
      } catch (e) {
        console.log("Error:", e);
      }
    };

    fetchData();
  }, []);


  const user = {
    username: localStorage.getItem("username") || "Undefined"
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
      window.location.href = "/login";
    }
  };

  const filteredItems = items.filter(item => {
    const username = users[item.user] || "";
    const transactionId = item.transaction_id || "";
    const amount = item.amount?.toString() || "";

    return (
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amount.includes(searchQuery)
    );
  });

  return (
    <>
      <div>
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
                <div className="nav-option option1">
                  <img
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                    className="nav-img"
                    alt="dashboard"
                  />
                  <h3><Link to="/scrap-collector">Dashboard</Link></h3>
                </div>

                <div className="opt nav-option">
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
            <div className="searchbar2">
              <input type="text" placeholder="Search" />
              <div className="searchbtn">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                  className="icn srchicn"
                  alt="search-button"
                />
              </div>
            </div>

            <div className="box-container">
              <div className="box box1">
                <div className="text">
                  <h3 className="topic-heading">60.5kg</h3>
                  <h3 className="topic">Scrap Recycled</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(31).png"
                  alt="Views"
                />
              </div>

              <div className="box box2">
                <div className="text">
                  <h3 className="topic-heading">153</h3>
                  <h3 className="topic">Users handled</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185030/14.png"
                  alt="likes"
                />
              </div>

              <div className="box box3">
                <div className="text">
                  <h3 className="topic-heading">320</h3>
                  <h3 className="topic">Comments</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
                  alt="comments"
                />
              </div>

              <div className="box box4">
                <div className="text">
                  <h3 className="topic-heading">70k</h3>
                  <h3 className="topic">Earnings</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
                  alt="published"
                />
              </div>
            </div>

            <div className="report-container">
              <div className="report-header">
                <h1 className="recent-Articles">Recent Transactions</h1>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none"
                  }}
                />
              </div>

              <table className="report-body">
                <thead>
                  <tr className="report-topic-heading">
                    <th className="t-op">Username</th>
                    <th className="t-op">Transaction Id</th>
                    <th className="t-op">Amount</th>
                    <th className="t-op">Date</th>
                    <th className="t-op">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(users).length === 0 ? (
                    <tr><td colSpan="5">No transaction data found</td></tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr className="item1" key={index}>
                        <td className="t-op-nextlvl">{users[item.user]?.toUpperCase() || 'loading...'}</td>
                        <td className="t-op-nextlvl">{item.transaction_id}</td>
                        <td className="t-op-nextlvl">{item.amount}</td>
                        <td className="t-op-nextlvl">
                          {new Date(item.created).toLocaleString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </td>
                        <td className="t-op-nextlvl label-tag">Paid</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <script src="./index.js"></script>
      </div>
    </>
  );
};

export default ScrapCollectorDashboard;
