import React, { useState } from "react";
import axios from "axios";

function TestComponent() {
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/update_message", {
        message: message,
      });
      console.log("Server response:", response);
      alert("Server response: " + response.data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={handleUpdate}>Update Message</button>
    </div>
  );
}

export default TestComponent;