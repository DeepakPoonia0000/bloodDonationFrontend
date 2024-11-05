import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from './Util/util';
import { toast } from 'react-toastify';

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDate: '',
    eventLocation: '',
    eventDescription: ''
  });

  const [deleteEventId, setDeleteEventId] = useState('');


  useEffect(() => {
    fetchEvents();
  }, []);
 
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/getEvents`);
      console.log(response);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.post(`${BaseUrl}/setNewEvent`, newEvent, {
        headers: { Authorization: token }
      });
      setEvents([...events, response.data]);
      window.scroll(0, 0)
      toast.success(response.data.message)
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(error.data.message)
    }
  };
  useEffect(()=> {
    fetchEvents();
  },[handleAddEvent])

  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const respose = await axios.delete(`${BaseUrl}/deleteEvent`, {
        params: { id: id },
        headers: { Authorization: token }
      });
      console.log(respose)
      window.scroll(0, 0);
      toast.success(respose.data.message);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    fetchEvents()
  };



  function formatDateToIndian(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }


  return (
    <div className='min-h-screen bg-gray-100 p-6 flex flex-col'>
    <header className='bg-red-600 text-white p-4 rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold text-center'>Blood Donation Events Admin</h1>
    </header>
  
    <main className='flex-1 mt-6'>
      <div className='max-w-3xl mx-auto'>
      <form onSubmit={handleAddEvent} className='bg-white p-6 rounded-lg shadow-md'>
  <h2 className='text-2xl font-semibold mb-4 text-red-600'>Add New Event</h2>
  <div className='space-y-4'>
    <div>
      <label htmlFor='eventName' className='block text-sm font-medium text-gray-700'>Event Name</label>
      <input
        id='eventName'
        type='text'
        placeholder='Event Name'
        value={newEvent.eventName}
        onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
        className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
        required
      />
    </div>
    <div>
      <label htmlFor='eventDate' className='block text-sm font-medium text-gray-700'>Event Date</label>
      <input
        id='eventDate'
        type='date'
        value={newEvent.eventDate}
        onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
        className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
        required
      />
    </div>
    <div>
      <label htmlFor='eventLocation' className='block text-sm font-medium text-gray-700'>Event Location</label>
      <input
        id='eventLocation'
        type='text'
        placeholder='Event Location'
        value={newEvent.eventLocation}
        onChange={(e) => setNewEvent({ ...newEvent, eventLocation: e.target.value })}
        className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
        required
      />
    </div>
    <div>
      <label htmlFor='eventDescription' className='block text-sm font-medium text-gray-700'>Event Description</label>
      <textarea
        id='eventDescription'
        placeholder='Event Description'
        value={newEvent.eventDescription}
        onChange={(e) => setNewEvent({ ...newEvent, eventDescription: e.target.value })}
        className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
        rows='4'
      />
    </div>
    <button type='submit' className='bg-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700'>
      Add Event
    </button>
  </div>
</form>

  
        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-4 text-red-600 text-center'>Event List</h2>
          <ul className='bg-white p-6 rounded-lg shadow-md'>
            {events.map(event => (
              <li key={event.id} className='flex flex-col sm:flex-row items-start sm:items-center mb-4 p-4 border border-gray-200 rounded-lg'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-red-600'>{event.eventName}</h3>
                  <p className='text-gray-700'>{formatDateToIndian(event.eventDate) || 'Na'}</p>
                  <p className='text-gray-600 mt-1'>{event.eventDescription}</p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className='bg-red-600 text-white p-2 rounded-lg ml-0 sm:ml-4 mt-4 sm:mt-0 hover:bg-red-700'
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  </div>
  

  );
}

export default EventsAdmin
