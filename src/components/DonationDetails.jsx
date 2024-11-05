import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import userlogo from './images/User.png'
import { BaseUrl } from './Util/util';
const bloodGroups = [
    'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-', 'hh (bombay blood group)', 'inra'];

// Blood compatibility mapping
const compatibility = {
    'a+': ['a+', 'ab+'],
    'a-': ['a+', 'a-', 'ab+', 'ab-'],
    'b+': ['b+', 'ab+'],
    'b-': ['b+', 'b-', 'ab+', 'ab-'],
    'ab+': ['ab+'],
    'ab-': ['ab+', 'ab-'],
    'o+': ['o+', 'a+', 'b+', 'ab+'],
    'o-': ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'],
    'hh (bombay blood group)': ['hh (bombay blood group)'],
    'inra': ['inra']
};


const DonationDetails = ({ setToken }) => {
    const [donationDetails, setDonationDetails] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const location = useLocation();
    const [age, setage] = useState(null);
    const [weight, setweight] = useState(null);
    const [gender, setGender] = useState('');
    const [requiredBlood, setRequiredBlood] = useState('');
    const [filteredBloodGroups, setFilteredBloodGroups] = useState(bloodGroups);

    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('donationId');

    useEffect(() => {
        const getDonationDetails = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get(`${BaseUrl}/donatersDetail`, {
                    params: { donaterId: donationId },
                    headers: { Authorization: token }
                });
                setDonationDetails(response.data);
                console.log(response.data);
                const bloodGroupFromResponse = response.data.bloodGroup.toLowerCase();
                setRequiredBlood(bloodGroupFromResponse);
            } catch (error) {
                console.log(error);
                window.alert('Failed to get donation details');
            }
        };

        if (donationId) {
            getDonationDetails();
        }
    }, [donationId]);

    useEffect(() => {
        if (requiredBlood) {
            setFilteredBloodGroups(bloodGroups.filter(group => compatibility[group]?.includes(requiredBlood)));
        } else {
            setFilteredBloodGroups(bloodGroups);
        }
    }, [requiredBlood]);


    const handleSubmit = async () => {

        const token = localStorage.getItem('token')
        const data = {
            requestId: donationId,
            phoneNumber,
            bloodGroup
        };

        if (phoneNumber.length < 10) {
            window.alert('Phone number must be at least 10 characters long.');
            return;
        }
        
        if (age < 16 || age>65) {
            window.alert('You must be between 16 to 65 years old to donate.');
            return;
        }

        if (gender === 'male' && weight < 50) {
            window.alert('Males must weigh at least 50kg to donate.');
            return;
        }

        if (gender === 'female' && weight < 50) {
            window.alert('Females must weigh at least 50kg to donate.');
            return;
        }



        try {
            const response = await axios.post(`${BaseUrl}/addDonorToTheRequest`, data, {
                headers: { Authorization: token }
            });

            // Show the message returned from the server
            const message = response.data.message;
            console.log(message)
            window.alert(`${message} ,  ${response.data.previousDonationDate}`);

            // Clear input fields after successful submission
            setName('');
            setPhoneNumber('');
            setBloodGroup('');
        } catch (error) {
            // Check if there's an error message in the response
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message);
            } else {
                window.alert('Failed to submit data');
            }
            console.error('Error submitting data:', error);
        }
    };

    if (!donationDetails) {
        return <p>No details available</p>;
    }

    return (
        <div className="donation-details border ml-5 mt-5 p-4 mr-5 justify-center flex flex-col items-center  mb-10">
            <div className='flex flex-wrap  md:border-4 md:px-60 p-20 bg-gray-300 font-montserrat'>
                <div className='mt-32 flex items-center justify-center w-full  md:hidden  sm:hidden lg:hidden xl:hidden'>
                    <img className='h-40' src={userlogo} />
                </div>
                <div className='flex flex-col items-start h-full'>
                    <h1>Donation Details</h1>

                    <div className='flex flex-wrap justify-between w-full'>
                        <p><strong>Name:</strong></p>
                        <p>{donationDetails.name}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <p><strong>Phone Number:</strong></p>
                        <p>{donationDetails.phoneNumber}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <p><strong>Blood Group:</strong></p>
                        <p>{donationDetails.bloodGroup}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <strong>Date of Query:</strong>
                        <p>{new Date(donationDetails.dateOfQuery).toLocaleString()}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <strong>Expires At:</strong>
                        <p>{new Date(donationDetails.expireAt).toLocaleString()}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <strong>Location:</strong>
                        <p>Latitude: {donationDetails.location.latitude}, Longitude: {donationDetails.location.longitude}</p>
                    </div>

                    {/* Button stays at the bottom with mt-auto */}
                    <button
                        className='h-30 mt-auto text-red-500'
                        onClick={() => window.open(`https://www.google.com/maps?q=${donationDetails.location.latitude},${donationDetails.location.longitude}`, '_blank')}
                    >
                        View Location on Google Maps
                    </button>
                </div>

                <div className='mt-[35px] ml-20 md:hidden hidden sm:hidden lg:block xl:block'>
                    <img className='h-40' src={userlogo} />
                </div>
            </div>

            <br /><br />
            <div className='text-xl' >
                <p>Fill Out The Form To Donate The Blood.</p>
                <p>Your details will be shared with the Requestor so that he can contact you.</p>
            </div>
            <div className="flex flex-col items-center justify-center text-red-500 p-4 bg-gray-300">
                <h2 className="text-xl font-bold mb-4">Submit Your Details</h2>

                <div className="w-full max-w-md grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-2 font-semibold">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber" className="mb-2 font-semibold">Phone Number:</label>
                        <input
                            type="number"
                            id="phoneNumber"
                            className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="gender" className="mb-2 font-semibold">Gender</label>
                        <select
                            id="gender"
                            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="weight" className="mb-2 font-semibold">Weight:</label>
                        <input
                            type="number"
                            id="weight"
                            className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={weight}
                            onChange={(e) => setweight(e.target.value)}
                        />
                    </div>

                    

                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber" className="mb-2 font-semibold">Age:</label>
                        <input
                            type="number"
                            id="age"
                            className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={age}
                            onChange={(e) => setage(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="bloodGroup" className="mb-2 font-semibold">Blood Group:</label>
                        <select
                            id="bloodGroup"
                            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <option value="">Select Blood Group</option>
                            {filteredBloodGroups.map((group, index) => (
                                <option key={index} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-6 bg-indigo-600 font-montserrat font-light  text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 rounded-2xl text-xl transition"
                >
                    Submit
                </button>
            </div>


        </div>
    );
};

export default DonationDetails;
