import React from 'react';

const Events = () => {
  // Dummy event data
  const events = [
    { name: "Blood Drive", date: "2024-09-20", location: "Community Center" },
    { name: "Donation Camp", date: "2024-10-05", location: "Hospital Main Hall" },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
        <ul>
          {events.map((event, index) => (
            <li key={index} className="border-b py-2">
              <p><strong>Name:</strong> {event.name}</p>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Events;
