import React, { useState, useEffect } from 'react'
import { BaseUrl } from '../Util/util';
import axios from 'axios';

const HospitalNgoMembers = () => {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the NGO members from the backend
        const fetchNgoMembers = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/getNgoMembers`, {
                    headers: {
                        Authorization: localStorage.getItem('hToken'), // replace userToken if the auth token key is different
                    },
                });
                setMembers(response.data.members);
            } catch (err) {
                setError('Failed to fetch members. Please try again.');
                console.log(err)
            }
        };

        fetchNgoMembers();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">NGO Members</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-500 text-white text-lg">
                            <th className="py-3 px-6 text-left">NGO Name</th>
                            <th className="py-3 px-6 text-left">Member Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Blood Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? (
                            members.map((member, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        } hover:bg-blue-100 transition duration-200`}
                                >
                                    <td className="py-4 px-6">{member.ngoName}</td>
                                    <td className="py-4 px-6">{member.memberName}</td>
                                    <td className="py-4 px-6">{member.memberEmail}</td>
                                    <td className="py-4 px-6">{member.memberBloodGroup}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500">
                                    No members found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HospitalNgoMembers