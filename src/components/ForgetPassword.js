import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing Toastify CSS
import { BaseUrl } from './Util/util';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle email submission to send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/forgetPassword`, { email });
      console.log(response);
      setEmailSent(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error: Network issue or invalid request.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset submission
  const resetPassword = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/verifyOtp`, { email, otp, newPassword });
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error: Network issue or invalid request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Your Password?</h2>

        {/* Email Input Section */}
        {!emailSent && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailSent} // Disable if OTP is sent
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${emailSent ? 'bg-gray-100' : ''}`}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {loading ? 'Sending OTP...' : 'Submit'}
            </button>
          </form>
        )}

        {/* OTP and Password Reset Section */}
        {emailSent && (
          <div className="mt-4">
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                Enter OTP:
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter the OTP"
              />
            </div>

            <label htmlFor="new-password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password:
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your new password"
            />

            <button
              type="button"
              onClick={resetPassword}
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors"
              disabled={!otp || !newPassword || loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        )}

        {/* Success message */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgetPassword;
