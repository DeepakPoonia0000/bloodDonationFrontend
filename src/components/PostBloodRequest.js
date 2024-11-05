import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from './Util/util';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const PostBloodRequest = ({sendLocation}) => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        longitude,
                        latitude
                    });
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("Please enable location permissions for this app.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable. Please try again later.");
                            break;
                        case error.TIMEOUT:
                            alert("The request to get your location timed out. Please try again.");
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("An unknown error occurred. Please try again.");
                            break;
                        default:
                            console.log("There is no error is fetching location");
                    }
                }
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    };



    const bloodRequest = async () => {
        if (!bloodGroup || !location) {
            window.alert("Blood Group and location is required for sending request");
        } else {
            const userData = { bloodGroup, location, name };
            const token = localStorage.getItem("token")
            try {
                const response = await axios.post(`${BaseUrl}/sendBloodRequest`, userData, {
                    headers: { Authorization: token }
                });
                toast.success("Successfully Submitted a Blood request")
                sendLocation();
                console.log("response is this from =>", response.data);
            } catch (error) {
                console.error('Request failed:', error);
                toast.error('Failed to send blood request. Please try again.')
            }
        }

    
    };


  return (
    <div>
       <div className="blood-request-form">
                    <label htmlFor="bloodGroup" className="form-label">
                        Enter the Blood Group in small case letters e.g., a+, b+, o-
                    </label>
                    <br />
                    <select className='h-10 border-2 border-black' value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                        <option value="">Select Your Blood Group</option>
                        <option value="a+">A+</option>
                        <option value="a-">A-</option>
                        <option value="b+">B+</option>
                        <option value="b-">B-</option>
                        <option value="ab+">AB+</option>
                        <option value="ab-">AB-</option>
                        <option value="o+">O+</option>
                        <option value="o-">O-</option>
                        <option value="a2+">A2+</option>
                        <option value="a2-">A2-</option>
                        <option value="a2b+">A2B+</option>
                        <option value="a2b-">A2B-</option>
                        <option value="hh">HH (Bombay Blood Group)</option>
                        <option value="inra">INRA</option>
                    </select>
                    <br />
                    <label htmlFor="Name" className="form-label">
                        Enter The Name
                    </label>
                    <br />
                    <input
                        type="text"
                        id="name"
                        placeholder="Name Of Requestor"
                        className="form-input"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <button className="form-button !bg-red-400 hover:!bg-red-500" onClick={bloodRequest}>
                        Request Blood
                    </button><br />
                    <br />
                    <Link to={'/bloodRequirement'}>My Requests</Link>
                </div>
    </div>
  )
}

export default PostBloodRequest
