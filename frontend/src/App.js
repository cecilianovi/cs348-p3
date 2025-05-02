import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import "./App.css";

function AddRestaurant({ refetchData }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone_number) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/restaurants", {
        name,
        address,
        phone_number
      });
      if (response.status === 201) {
        alert("Restaurant added successfully!");
        refetchData();
        navigate("/");
      } else {
        alert(`Failed to add restaurant. Error: ${response.data.error}`);
        console.error("Server responded with status:", response.status, response.data);
      }
    } catch (error) {
      alert("An error occurred: " + (error.response?.data?.error || error.message));
      console.error("Error adding restaurant:", error);
    }
  };

  return (
    <div>
      <h2>Add Restaurant</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'end' }}>
        <div><label>Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Address:</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
        <div><label>Phone Number:</label><input type="tel" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required /></div>
        <div className="button-row">
        <button type="submit">Add Restaurant</button>
        </div>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => { navigate("/"); refetchData(); }}>Back to Restaurants</button>
      </div>
    </div>
  );
}

function EditRestaurant({ fetchData }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/restaurants/${id}`)
      .then((response) => {
        setRestaurant(response.data);
        setName(response.data.name);
        setAddress(response.data.address);
        setPhoneNumber(response.data.phone_number);
      })
      .catch((error) => console.error("Error fetching restaurant:", error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/restaurants/${id}`, {
        name,
        address,
        phone_number,
      });
      alert("Restaurant updated successfully");
      navigate("/");
      fetchData();
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  if (!restaurant) return <div>Loading...</div>;

    return (
        <div>
          <h2>Edit Restaurant</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'end' }}>
            <div><label>Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label>Address:</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
            <div><label>Phone Number:</label><input type="tel" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required /></div>
            <div className="button-row">
              <button type="submit">Update Restaurant</button>
            </div>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={() => { navigate("/"); fetchData(); }}>Back to Restaurants</button>
          </div>
        </div>
      );
}


function AddEmployee({ refetchData }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [restaurant_id, setRestaurantId] = useState("");
  const [manager_id, setManagerId] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/restaurants")
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => console.error("Error fetching restaurants:", error));
  }, []);

  useEffect(() => {
    if (restaurant_id) {
      axios.get("http://127.0.0.1:5000/api/employees")
        .then(response => {
          const restaurantManagers = response.data.filter(emp => emp.position === "Manager" && emp.restaurant_id === parseInt(restaurant_id));
          setManagers(restaurantManagers);
          if (restaurantManagers.length > 0) {
            setManagerId(restaurantManagers[0].id); // Automatically set to first manager
          } else {
            setManagerId(""); // Reset if no manager for the restaurant
          }
        })
        .catch(error => console.error("Error fetching managers:", error));
    } else {
      setManagers([]);
      setManagerId("");
    }
  }, [restaurant_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/api/employees", {
        first_name,
        last_name,
        position,
        phone_number,
        salary,
        manager_id,
        restaurant_id,
      });
      alert("Employee added successfully");
      navigate("/");
      refetchData();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div><label>First Name:</label><input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} required /></div>
        <div><label>Last Name:</label><input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} required /></div>
        <div><label>Position:</label><input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required /></div>
        <div><label>Phone Number:</label><input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required /></div>
        <div><label>Salary:</label><input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} required /></div>
        <div>
          <label>Restaurant:</label>
          <select value={restaurant_id} onChange={(e) => setRestaurantId(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', fontSize: '1rem' }}>
            <option value="">Select Restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>{restaurant.name} (ID: {restaurant.id})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Manager:</label>
          <select value={manager_id} onChange={(e) => setManagerId(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', fontSize: '1rem' }}>
            <option value="">Select Manager</option>
            {managers.map(manager => (
              <option key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name} (ID: {manager.id})</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <button type="submit">Add Employee</button>
        </div>
      </form>
      <button onClick={() => { navigate("/"); refetchData(); }}>Back to Restaurants</button>
    </div>
  );
}

function EditEmployee({ fetchData }) {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [restaurant_id, setRestaurantId] = useState("");
  const [manager_id, setManagerId] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/employees/${id}`)
      .then(response => {
        setEmployee(response.data);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setPosition(response.data.position);
        setPhoneNumber(response.data.phone_number);
        setSalary(response.data.salary);
        setRestaurantId(response.data.restaurant_id);
      })
      .catch(error => console.error("Error fetching employee:", error));

    axios.get("http://127.0.0.1:5000/api/restaurants")
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => console.error("Error fetching restaurants:", error));
  }, [id]);

  useEffect(() => {
    if (restaurant_id) {
      axios.get("http://127.0.0.1:5000/api/employees")
        .then(response => {
          const restaurantManagers = response.data.filter(emp => emp.position === "Manager" && emp.restaurant_id === parseInt(restaurant_id));
          setManagers(restaurantManagers);
          if (restaurantManagers.length > 0) {
            setManagerId(restaurantManagers[0].id);
          } else {
            setManagerId("");
          }
        })
        .catch(error => console.error("Error fetching managers:", error));
    } else {
      setManagers([]);
      setManagerId("");
    }
  }, [restaurant_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/employees/${id}`, {
        first_name,
        last_name,
        position,
        phone_number,
        salary,
        manager_id,
        restaurant_id,
      });
      alert("Employee updated successfully");
      navigate("/");
      fetchData();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div><label>First Name:</label><input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} required /></div>
        <div><label>Last Name:</label><input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} required /></div>
        <div><label>Position:</label><input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required /></div>
        <div><label>Phone Number:</label><input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required /></div>
        <div><label>Salary:</label><input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} required /></div>
        <div>
          <label>Restaurant:</label>
          <select value={restaurant_id} onChange={(e) => setRestaurantId(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', fontSize: '1rem' }}>
            <option value="">Select Restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>{restaurant.name} (ID: {restaurant.id})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Manager:</label>
          <select value={manager_id} onChange={(e) => setManagerId(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', fontSize: '1rem' }}>
            <option value="">Select Manager</option>
            {managers.map(manager => (
              <option key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name} (ID: {manager.id})</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <button type="submit">Update Employee</button>
        </div>
      </form>
      <button onClick={() => { navigate("/"); fetchData(); }}>Back to Restaurants</button>
    </div>
  );
}



function AddSchedule({ refetchData }) {
  const [employee_id, setEmployeeId] = useState("");
  const [restaurant_id, setRestaurantId] = useState("");
  const [restaurant_name, setRestaurantName] = useState("");
  const [date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/employees")
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  useEffect(() => {
    if (employee_id) {
      axios.get(`http://127.0.0.1:5000/api/employees/${employee_id}`)
        .then(response => {
          setRestaurantId(response.data.restaurant_id);
          return axios.get(`http://127.0.0.1:5000/api/restaurants/${response.data.restaurant_id}`);
        })
        .then(response => {
          setRestaurantName(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching employee or restaurant:', error);
          setRestaurantId('');
          setRestaurantName('');
        });
    } else {
      setRestaurantId('');
      setRestaurantName('');
    }
  }, [employee_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/schedule', {
        employee_id,
        restaurant_id,
        date,
        start_time,
        end_time,
      });
      alert('Shift added successfully');
      navigate('/');
      refetchData();
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  return (
    <div>
      <h2>Add Shift</h2>
      <form onSubmit={handleSubmit}>
        <label>Employee:
          <select value={employee_id} onChange={(e) => setEmployeeId(e.target.value)} required>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} (ID: {emp.id})</option>
            ))}
          </select>
        </label><br />
        <label>Restaurant:
          <input type="text" value={`${restaurant_name} (ID: ${restaurant_id})`} readOnly />
        </label><br />
        <label>Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label><br />
        <label>Start Time:
          <input type="time" value={start_time} onChange={(e) => setStartTime(e.target.value)} required />
        </label><br />
        <label>End Time:
          <input type="time" value={end_time} onChange={(e) => setEndTime(e.target.value)} required />
        </label><br />
        <button type="submit">Add Shift</button>
      </form>
      <button onClick={() => { navigate('/'); refetchData(); }}>Back to Restaurants</button>
    </div>
  );
}

function EditSchedule({ fetchData }) {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employee_id, setEmployeeId] = useState('');
  const [restaurant_id, setRestaurantId] = useState('');
  const [restaurant_name, setRestaurantName] = useState('');
  const [date, setDate] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/schedule/${id}`)
      .then(response => {
        setSchedule(response.data);
        setEmployeeId(response.data.employee_id);
        setDate(response.data.date);
        setStartTime(response.data.start_time);
        setEndTime(response.data.end_time);
        return axios.get(`http://127.0.0.1:5000/api/employees/${response.data.employee_id}`);
      })
      .then(response => {
        setRestaurantId(response.data.restaurant_id);
        return axios.get(`http://127.0.0.1:5000/api/restaurants/${response.data.restaurant_id}`);
      })
      .then(response => {
        setRestaurantName(response.data.name);
      })
      .catch(error => console.error("Error fetching schedule or restaurant:", error));
  }, [id]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/employees")
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  useEffect(() => {
    if (employee_id) {
      axios.get(`http://127.0.0.1:5000/api/employees/${employee_id}`)
        .then(response => {
          setRestaurantId(response.data.restaurant_id);
          return axios.get(`http://127.0.0.1:5000/api/restaurants/${response.data.restaurant_id}`);
        })
        .then(response => {
          setRestaurantName(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching employee or restaurant:', error);
          setRestaurantId('');
          setRestaurantName('');
        });
    } else {
      setRestaurantId('');
      setRestaurantName('');
    }
  }, [employee_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/schedule/${id}`, {
        employee_id, restaurant_id, date, start_time, end_time
      });
      alert('Schedule updated successfully');
      navigate('/');
      fetchData();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  if (!schedule) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Schedule</h2>
      <form onSubmit={handleSubmit}>
        <label>Employee:
          <select value={employee_id} onChange={(e) => setEmployeeId(e.target.value)} required>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} (ID: {emp.id})
              </option>
            ))}
          </select>
        </label><br />
        <label>Restaurant:
          <input type="text" value={`${restaurant_name} (ID: ${restaurant_id})`} readOnly />
        </label><br />
        <label>Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label><br />
        <label>Start Time:
          <input type="time" value={start_time} onChange={(e) => setStartTime(e.target.value)} required />
        </label><br />
        <label>End Time:
          <input type="time" value={end_time} onChange={(e) => setEndTime(e.target.value)} required />
        </label><br />
        <button type="submit">Update Schedule</button>
      </form>
      <button onClick={() => { navigate('/'); fetchData(); }}>Back to Restaurants</button>
    </div>
  );
}

function FilterSchedule() {
  const [restaurantId, setRestaurantId] = useState('');
  const [date, setDate] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.error("Error fetching restaurants:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/schedule/filter", {
        params: {
          restaurant_id: restaurantId || undefined,
          date: date || undefined,
          min_duration: minDuration || undefined,
        },
      });
      setFilteredSchedule(response.data);
      setFilterApplied(true);
    } catch (error) {
      console.error("Error fetching filtered schedule:", error);
      alert("Error fetching filtered schedule. See console for details.");
    }
  };

  const calculateAverageDuration = () => {
    if (!filteredSchedule.length) return 0;
    const totalHours = filteredSchedule.reduce((acc, shift) => {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      const end = new Date(`1970-01-01T${shift.end_time}`);
      const duration = (end - start) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);
    return (totalHours / filteredSchedule.length).toFixed(2);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Filter Schedule</h2>
      <form className="filter-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="restaurantSelect">Restaurant:</label>
          <select
            id="restaurantSelect"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            style={{
              height: '45px',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '220px'
            }}
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} (ID: {r.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label>Minimum Shift Duration (hours):</label>
          <input type="number" value={minDuration} onChange={(e) => setMinDuration(e.target.value)} />
        </div>

        <div>
        <button type="submit" className="filter-button">Apply Filter</button>
        </div>
      </form>

      {filterApplied && (
        filteredSchedule.length > 0 ? (
          <div>
            <h2 style={{ marginTop: "30px" }}>Filtered Results</h2>
            <p>Number of Results: {filteredSchedule.length}</p>
            <p>Average Shift Duration: {calculateAverageDuration()} hours</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Restaurant ID</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((shift) => (
                  <tr key={shift.id}>
                    <td>{shift.id}</td>
                    <td>{shift.employee_id}</td>
                    <td>{shift.restaurant_id}</td>
                    <td>{shift.date}</td>
                    <td>{shift.start_time}</td>
                    <td>{shift.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ marginTop: "30px", fontStyle: "italic", color: "#555" }}>
            No results match your filter criteria.
          </p>
        )
      )}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <button onClick={() => { navigate("/"); }}>Back to Restaurants</button>
      </div>

    </div>
  );
}



function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const fetchData = async () => {
    try {
      const restaurantsResponse = await axios.get("http://127.0.0.1:5000/api/restaurants");
      if (restaurantsResponse.status === 200) {
        setRestaurants(restaurantsResponse.data);
      } else {
        console.error("Error fetching restaurants:", restaurantsResponse.status);
      }

      const employeesResponse = await axios.get("http://127.0.0.1:5000/api/employees");
      if (employeesResponse.status === 200) {
        setEmployees(employeesResponse.data);
      } else {
        console.error("Error fetching employees:", employeesResponse.status);
      }

      const scheduleResponse = await axios.get("http://127.0.0.1:5000/api/schedule");
      if (scheduleResponse.status === 200) {
        setSchedule(scheduleResponse.data);
        console.log("Fetched schedule data:", scheduleResponse.data);
      } else {
        console.error("Error fetching schedule:", scheduleResponse.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRestaurant = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/restaurants/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Error deleting restaurant. Please check the console.");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/employees/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee. Please check the console.");
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/schedule/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Error deleting schedule. Please check the console.");
    }
  };

  return (
    <Router>
      <div className="container">
        <h1>Chick-fil-A Management Dashboard</h1>
        <Routes>
          <Route path="/" element={
            <>
              <div>
                <Link to="/add-restaurant"><button className="add-button">Add Restaurant</button></Link>
                <Link to="/add-employee"><button className="add-button">Add Employee</button></Link>
                <Link to="/add-schedule"><button className="add-button">Add Shift</button></Link>
              </div>
              <h2>Restaurants</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id}>
                      <td>{restaurant.id}</td>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.address}</td>
                      <td>{restaurant.phone_number}</td>
                      <td>
                        <Link to={`/edit-restaurant/${restaurant.id}`}><button>Edit</button></Link>
                        <button onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>Employees</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Position</th>
                    <th>Phone Number</th>
                    <th>Salary</th>
                    <th>Manager ID</th>
                    <th>Restaurant ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.first_name}</td>
                      <td>{employee.last_name}</td>
                      <td>{employee.position}</td>
                      <td>{employee.phone_number}</td>
                      <td>{employee.salary}</td>
                      <td>{employee.manager_id}</td>
                      <td>{employee.restaurant_id}</td>
                      <td>
                        <Link to={`/edit-employee/${employee.id}`}><button>Edit</button></Link>
                        <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="schedule-container">
                <h2 className="schedule-title">Schedule</h2>
                <div className="filter-button-wrapper">
                  <Link to="/filter-schedule">
                    <button className="button-yellow filter-button">Filter</button>
                  </Link>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee ID</th>
                    <th>Restaurant ID</th>
                    <th>Date</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((shift) => (
                    <tr key={shift.id}>
                      <td>{shift.id}</td>
                      <td>{shift.employee_id}</td>
                      <td>{shift.restaurant_id}</td>
                      <td>{new Date(shift.date).toLocaleDateString()}</td>
                      <td>{shift.start_time}</td>
                      <td>{shift.end_time}</td>
                      <td>
                        <Link to={`/edit-schedule/${shift.id}`}><button>Edit</button></Link>
                        <button onClick={() => deleteSchedule(shift.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          } />
          <Route path="/add-restaurant" element={<AddRestaurant refetchData={fetchData} />} />
          <Route path="/add-employee" element={<AddEmployee refetchData={fetchData} />} />
          <Route path="/add-schedule" element={<AddSchedule refetchData={fetchData} />} />
          <Route path="/edit-restaurant/:id" element={<EditRestaurant fetchData={fetchData} />} />
          <Route path="/edit-employee/:id" element={<EditEmployee fetchData={fetchData} />} />
          <Route path="/edit-schedule/:id" element={<EditSchedule fetchData={fetchData} />} />
          <Route path="/filter-schedule" element={<FilterSchedule fetchData={fetchData} />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
