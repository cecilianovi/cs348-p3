import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurant = ({ refetchData }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [manager_id, setManagerId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/restaurants", {
        name,
        address,
        phone_number,
        manager_id,
      });

      if (response.status === 201) {
        alert("Restaurant added successfully!");
        refetchData(); // refetch data
        navigate("/");
      } else {
        alert(`Failed to add restaurant. Error: ${response.data.error}`);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error("Error adding restaurant:", error);
    }
  };

  return (
    <div>
      <h2>Add Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter restaurant name"
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter restaurant address"
          />
        </label>
        <br />
        <label>
          Phone Number:
          <input
            type="tel"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="Enter phone number"
          />
        </label>
        <br />
        <label>
          Manager ID:
          <input
            type="number"
            value={manager_id}
            onChange={(e) => setManagerId(e.target.value)}
            required
            placeholder="Enter manager ID"
          />
        </label>
        <br />
        <button type="submit">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
