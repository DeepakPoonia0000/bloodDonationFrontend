import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BaseUrl } from './Util/util';
import { toast } from 'react-toastify';

// Modal Component for Confirmations
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminManageUsers = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [registeredHospital, setRegisteredHospital] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Control modal visibility
  const [selectedId, setSelectedId] = useState(null);     // Store selected user/hospital ID
  const [deleteType, setDeleteType] = useState('');       // Either 'user' or 'hospital'

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchPendingData();
  }, []);

  // Fetch users and hospitals data
  const fetchPendingData = async () => {
    try {
      const result = await axios.get(`${BaseUrl}/pending-users`, { headers: { Authorization: token } });
      setRegisteredUsers(result.data.registeredUsers);
      setRegisteredHospital(result.data.registeredHospitals);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // Function to trigger modal
  const triggerDelete = (id, type) => {
    setSelectedId(id);  // Set the ID to be deleted
    setDeleteType(type);  // Set whether it's a user or hospital
    setIsModalOpen(true); // Open modal
  };

  // Handle actual deletion based on type
  const handleDelete = async () => {
    setIsModalOpen(false); // Close the modal
    try {
      if (deleteType === 'user') {
        const response = await axios.delete(`${BaseUrl}/reject-user`, {
          params: { id: selectedId },
          headers: { Authorization: token },
        });
        setRegisteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedId));
        toast.success(response.data.message);
      } else if (deleteType === 'hospital') {
        const response = await axios.delete(`${BaseUrl}/reject-hospital`, {
          params: { id: selectedId },
          headers: { Authorization: token },
        });
        setRegisteredHospital((prevHospitals) => prevHospitals.filter((hospital) => hospital._id !== selectedId));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="p-4 min-h-screen">
      {/* Modal for confirmation */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message={`Are you sure you want to delete this ${deleteType === 'user' ? 'user' : 'hospital'}?  `}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Registered Users Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-red-700">Registered Users</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {registeredUsers.map((user) => (
            <div key={user._id} className="w-full sm:w-1/2 lg:w-1/3 bg-white shadow-lg rounded-lg p-4 border border-red-200 hover:bg-gray-100 transition relative">
              <p><strong>ID:</strong> {user._id}</p>
              <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
              <p><strong>Joined:</strong> {new Date(user.joinedOn).toLocaleDateString()}</p>
              <p><strong>Phone:</strong> {user.phoneNumber}</p>
              <button
                onClick={() => triggerDelete(user._id, 'user')}
                className="mt-4 text-white bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Registered Hospitals Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-red-700">Registered Hospitals</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {registeredHospital.map((hospital) => (
            <div key={hospital._id} className="w-full sm:w-1/2 lg:w-1/3 bg-white shadow-lg rounded-lg p-4 border border-red-200 hover:bg-gray-100 transition relative">
              <p><strong>Name:</strong> {hospital.name}</p>
              <p><strong>ID:</strong> {hospital._id}</p>
              <p><strong>Joined:</strong> {new Date(hospital.joinedOn).toLocaleDateString()}</p>
              <p><strong>Phone:</strong> {hospital.contact.phone}</p>
              <button
                onClick={() => triggerDelete(hospital._id, 'hospital')}
                className="mt-4 text-white bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg"
              >
                Delete Hospital
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminManageUsers;
