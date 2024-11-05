import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Util/util';
import { toast } from 'react-toastify';

const PostBloodRequest = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    name: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bloodGroup) {
      setError('Please select a blood group');
      return;
    }
    const token = localStorage.getItem('htoken')
    try {
      const response = await axios.post(`${BaseUrl}/sendBloodRequestHospital`, formData,{
        headers: { Authorization: token }});
      setSuccess('Request sent successfully!');
      toast.success('Request send successfull')
      setError('');
      console.log('Response data:', response.data);
    } catch (error) {
      setError('Failed to send request. Please try again.');
      setSuccess('');
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Post Blood Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Blood Group Dropdown */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Blood Group:</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        
        {/* Name Field */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Your Name"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Request
        </button>
      </form>
      
      {/* Error and Success Messages */}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
    </div>
  );
};

export default PostBloodRequest;
