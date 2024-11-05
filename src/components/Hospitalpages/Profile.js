import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    hospitalName: "City Hospital",
    email: "contact@cityhospital.com",
    phone: "+1234567890",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-4 shadow rounded">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital / Organization Name</label>
            <input
              type="text"
              name="hospitalName"
              value={profile.hospitalName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
