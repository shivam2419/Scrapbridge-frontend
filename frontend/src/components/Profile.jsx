import React, { useState, useEffect } from "react";
import "../style/profile.css";
import loader from "../assets/loader.gif";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/get-enduser/${localStorage.getItem("user_id")}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        const data = await res.json();
        if (data.image) {
          localStorage.setItem("user_profile", data.image);
        }
        setUser(data);
        setEmail(data?.user?.email || "");
      } catch (err) {
        console.error("User detail fetching error", err);
      }
    };

    fetchData();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/update-user/${localStorage.getItem("user_id")}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("User info updated successfully!");
        window.location.reload();
      } else {
        console.error("Update failed:", data);
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const profileImg = user?.image ? "http://127.0.0.1:8000" + user.image : "";

  return (
    <>
      {user ? (
        <div className="profile-container">
          <div className="profile-card">
            <div className="img">
              <img src={profileImg} alt="Profile" className="profile-img" />
              <h2 className="username">{localStorage.getItem("username").toUpperCase()}</h2>
              <div className="created-at">
                Created On: {new Date(user.created_at).toISOString().split("T")[0]}
              </div>
            </div>

            <div className="info-grid">
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={localStorage.getItem("username")} disabled />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Upload Profile Image</label>
                <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>

              <div className="btn-center">
                <button className="submit-btn" onClick={handleUpdateUser}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">
          <img src={loader} alt="Loader" />
          <p>Check if you are logged-In or wait for a few seconds</p>
        </div>
      )}
    </>
  );
};

export default Profile;
