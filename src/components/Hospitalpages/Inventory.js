import React from 'react';

const Inventory = () => {
  // Dummy inventory data
  const inventory = [
    { bloodType: "A+", quantity: 50 },
    { bloodType: "A-", quantity: 20 },
    { bloodType: "B+", quantity: 35 },
    { bloodType: "B-", quantity: 10 },
    { bloodType: "AB+", quantity: 15 },
    { bloodType: "AB-", quantity: 5 },
    { bloodType: "O+", quantity: 60 },
    { bloodType: "O-", quantity: 25 },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Blood Inventory</h2>
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-xl font-semibold mb-2">Current Blood Stock</h3>
        <ul>
          {inventory.map((item, index) => (
            <li key={index} className="border-b py-2">
              <p><strong>Blood Type:</strong> {item.bloodType}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;
