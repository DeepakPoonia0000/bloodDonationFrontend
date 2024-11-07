// AdminPanel.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';
import './styles/AdminPanel.css';
import { Link } from 'react-router-dom';
import { BaseUrl } from './Util/util';
import { FaUsers, FaHospital } from 'react-icons/fa';

function AdminPanel({ setAdminToken }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [pendingHospital, setpendingHospital] = useState([]);
  const [registeredHospital, setRegisteredHospital] = useState([]);
  const [notVerifiedUsers, setNotVerifiedUsers] = useState([]);
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('');
  const token = localStorage.getItem('adminToken')

  const [showPendingUsers, setShowPendingUsers] = useState(false);
  const [showUnverifiedUsers, setShowUnverifiedUsers] = useState(false);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  const [showPendingHospital, setShowPendingHospital] = useState(false);
  const [showRegisteredHospital, setShowRegisteredHospital] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const result = await axios.get(`${BaseUrl}/pending-users`, { headers: { Authorization: token } });
      setPendingUsers(result.data.pendingUsers);
      setRegisteredUsers(result.data.registeredUsers);
      setpendingHospital(result.data.pendingHospitals);
      setRegisteredHospital(result.data.registeredHospitals);
      setNotVerifiedUsers(result.data.notVerifiedUsers)
      console.log(result.data)
    } catch (error) {
      console.log("error is in fetchPendingUsers")
      console.error('Request failed:', error);
    }

  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${BaseUrl}/approve-user`, { id }, {
        headers: { Authorization: token }
      });
      setPendingUsers(pendingUsers.filter(user => user._id !== id));
      fetchPendingUsers();
    } catch (error) {
      console.log("Error in handleApprove");
      console.error('Request failed:', error);
    }
  };

  const handleHospitalApprove = async (id) => {
    try {
      await axios.put(`${BaseUrl}/approve-hospital`, { id }, {
        headers: { Authorization: token }
      });
      setpendingHospital(pendingHospital.filter(user => user._id !== id));
      fetchPendingUsers();
    } catch (error) {
      console.log("Error in handleApprove");
      console.error('Request failed:', error);
    }
  };

  const handleReject = async (id) => {
    console.log(id)
    try {
      const response = await axios.delete(`${BaseUrl}/reject-user`, {
        params: { id },
        headers: { Authorization: token }
      });
      console.log(response)
      setPendingUsers(pendingUsers.filter(user => user._id !== id));
      setNotVerifiedUsers(notVerifiedUsers.filter(user => user._id !== id));
    } catch (error) {
      console.log("Error in handleReject");
      console.error('Request failed:', error);
    }
  };

  const handleRejectHospital = async (id) => {
    console.log(id)
    try {
      const response = await axios.delete(`${BaseUrl}/reject-hospital`, {
        params: { id },
        headers: { Authorization: token }
      });
      console.log(response)
      setpendingHospital(pendingHospital.filter(user => user._id !== id));
    } catch (error) {
      console.log("Error in handleReject");
      console.error('Request failed:', error);
    }
  }

  // filtered function
  const filteredPendingUsers = pendingUsers.filter(user =>
    user.phoneNumber.includes(filter)
  );

  const filteredRegisteredUsers = registeredUsers.filter(user =>
    user.phoneNumber.includes(filter)
  );

  const filteredNotVerifiedUsers = notVerifiedUsers.filter(user =>
    user.phoneNumber.includes(filter)
  );

  const filteredPendingHospital = pendingHospital.filter(hospital =>
    hospital.contact.phone.includes(filter)
  );

  const filteredRegisteredHospital = registeredHospital.filter(hospital =>
    hospital.contact.phone.includes(filter)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top bar with title */}
      <div className="flex justify-between items-center p-4 border-b bg-red-700 text-white shadow">
        <h2 className="text-xl font-semibold">Admin Panel - Blood Donation Requests</h2>
      </div>

      {/* Filter Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Filter by Phone Number"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {/* Toggle Buttons */}
      <div className="flex items-center justify-center  gap-4 p-4">
        <button
          onClick={() => setShowPendingUsers(!showPendingUsers)}
          className={`btn-toggle flex items-center border-2 p-3 rounded-full text-white transition-colors ${showPendingUsers ? 'bg-green-600' : 'bg-red-500'
            }`}
        >
          <FaUsers className="mr-2" />
          Pending Users
        </button>

        <button
          onClick={() => setShowUnverifiedUsers(!showUnverifiedUsers)}
          className={`btn-toggle flex items-center border-2 p-3 rounded-full text-white transition-colors ${showUnverifiedUsers ? 'bg-green-600' : 'bg-red-500'
            }`}
        >
          <FaUsers className="mr-2" /> Unverified Users
        </button>

        <button
          onClick={() => setShowRegisteredUsers(!showRegisteredUsers)}
          className={`btn-toggle flex items-center border-2 p-3 rounded-full text-white transition-colors ${showRegisteredUsers ? 'bg-green-600' : 'bg-red-500'
            }`}
        >
          <FaUsers className="mr-2" /> Registered Users
        </button>

        <button
          onClick={() => setShowPendingHospital(!showPendingHospital)}
          className={`btn-toggle flex items-center border-2 p-3 rounded-full text-white transition-colors ${showPendingHospital ? 'bg-green-600' : 'bg-red-500'
            }`}
        >
          <FaHospital className="mr-2" /> Pending Hospitals
        </button>

        <button
          onClick={() => setShowRegisteredHospital(!showRegisteredHospital)}
          className={`btn-toggle flex items-center border-2 p-3 rounded-full text-white transition-colors ${showRegisteredHospital ? 'bg-green-600' : 'bg-red-500'
            }`}
        >
          <FaHospital className="mr-2" /> Registered Hospitals
        </button>
        
      </div>

      {/* Main content */}
      <div className="p-4 flex-grow overflow-y-auto">
        {/* Pending Users */}
        {showPendingUsers && <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Pending User Requests</h3>
          {filteredPendingUsers.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            <ul className="space-y-4">
              {filteredPendingUsers.map((user) => (
                <li key={user._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-wrap justify-between items-center border border-red-200">
                  <p className="text-gray-700 font-medium">Phone: {user.phoneNumber}</p>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
                      onClick={() => handleReject(user._id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>}

        {/* unverified user  */}
        {showUnverifiedUsers && <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Unverified User</h3>
          {filteredNotVerifiedUsers.length === 0 ? (
            <p className="text-gray-500">No a single user find unverified.</p>
          ) : (
            <ul className="space-y-4">
              {filteredNotVerifiedUsers.map((user) => (
                <li key={user._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-wrap justify-between items-center border border-red-200">
                  <p className="text-gray-700 font-medium">Phone: {user.phoneNumber}</p>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
                      onClick={() => handleReject(user._id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>}



        {/* Registered Users */}
        {showRegisteredUsers && <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-red-900">
            Registered Users
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {filteredRegisteredUsers.map((user) => (
              <Link
                to={`/userDetails?userId=${user._id}`}
                key={user._id}
                className="w-full sm:w-1/2 lg:w-1/3"
              >
                <li className="bg-red-50 shadow-lg rounded-lg p-4 border border-red-600 hover:bg-red-100 hover:shadow-xl transition transform hover:scale-105">
                  <p className="text-red-900 font-bold">
                    <strong>ID:</strong> {user._id}
                  </p>
                  <p className="text-red-800">
                    <strong>Blood Group:</strong> {user.bloodGroup}
                  </p>
                  <p className="text-gray-700">
                    <strong>Joined:</strong> {new Date(user.joinedOn).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {user.phoneNumber}
                  </p>
                </li>
              </Link>
            ))}
          </div>
        </section>}


        {/* Pending Hospital Requests */}
        {showPendingHospital && <section className="  lg:block flex flex-col items-center mb-8">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Pending Hospital/Organizations Requests</h3>
          {filteredPendingHospital.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            <ul className="space-y-4">
              {filteredPendingHospital.map((hospital) => (
                <li key={hospital._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-wrap justify-between items-start border border-red-200">
                  <div className="w-full md:w-auto">
                    <p><strong>Name:</strong> {hospital.name}</p>
                    <p><strong>Address:</strong> {hospital.address.street}, {hospital.address.city}, {hospital.address.state}, {hospital.address.postalCode}</p>
                    <p><strong>Phone:</strong> {hospital.contact.phone}</p>
                    <p><strong>Email:</strong> {hospital.contact.email}</p>
                    <p><strong>Facilities:</strong> {hospital.facilities > 0 ? hospital.facilities.join(', ') : 'None'}</p>
                    <p><strong>Blood Donation Center:</strong> {hospital.hasBloodDonationCenter ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
                      onClick={() => handleHospitalApprove(hospital._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
                      onClick={() => handleRejectHospital(hospital._id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>}

        {/* Registered Hospitals */}
        {showRegisteredHospital && <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-red-900">
            Registered Hospitals/Organizations
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {filteredRegisteredHospital.map((hospital) => (
              <Link
                to={`/hospitalDetails?userId=${hospital._id}`}
                key={hospital._id}
                className="w-full sm:w-1/2 lg:w-1/3"
              >
                <li className="bg-red-50 shadow-lg rounded-lg p-4 border border-red-600 hover:bg-red-100 hover:shadow-xl transition transform hover:scale-105">
                  <p className="text-red-900 font-bold">
                    <strong>Name:</strong> {hospital.name}
                  </p>
                  <p className="text-red-800">
                    <strong>ID:</strong> {hospital._id}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {hospital.contact.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {hospital.contact.phone}
                  </p>
                </li>
              </Link>
            ))}
          </div>
        </section>}

      </div>
    </div>
  );

}

export default AdminPanel;
