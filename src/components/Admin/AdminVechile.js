import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BaseUrl} from '../Util/util'
import { toast } from 'react-toastify';

const AdminVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/getAllVehicles`); // Adjust this endpoint as needed
        console.log(response.data)
        setVehicles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Function to delete a vehicle
  const deleteVehicle = async (id) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response =  await axios.delete(`${BaseUrl}/deleteVehicle`,
        {
          params: {vehicleId:id },
          headers: { Authorization: token }
        }
      );
      console.log(response)
      toast.success("Vechile Deleted !");
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading vehicles...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-red-50 p-5'>
      <h1 className='text-4xl font-bold text-red-600 mb-5'>Vehicle Management</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className='bg-white border border-red-300 rounded-lg p-4 shadow-lg'>
            <h2 className='text-xl font-semibold text-red-600'>Owner: {vehicle.ownerName}</h2>
            <p className='text-gray-700'>Type: {vehicle.vehicleType}</p>
            <p className='text-gray-700'>License Plate: {vehicle.licensePlate}</p>
            <p className='text-gray-700'>Capacity: {vehicle.capacity}</p>
            <p className='text-gray-700'>Contact: {vehicle.contactNumber}</p>
            <p className='text-gray-700'>
              Availability: {vehicle.availability ? 'Available' : 'Not Available'}
            </p>
            <p className='text-gray-700'>Date of Availability: {new Date(vehicle.dateOfAvailability).toLocaleDateString()}</p>
            <p className='text-gray-700'>Expiration Date: {new Date(vehicle.expirationDate).toLocaleDateString()}</p>
            <p className='text-gray-700'>Registered At: {new Date(vehicle.registeredAt).toLocaleDateString()}</p>
            <button
              onClick={() => deleteVehicle(vehicle._id)}
              className='mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
            >
              Delete Vehicle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVehicle;
