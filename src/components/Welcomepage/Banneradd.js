import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../Util/util';
import { toast } from 'react-toastify';

const Banneradd = () => {
    const [data, setdata] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/getAllBanners`);
                setdata(response.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
                toast.error('Failed to load banners');
            }
        };
        fetchBanners();
    }, []);


    return (

        <>

            {data && <div className=' mb-2 mt-2 z-20 w-full'>
                <marquee>
              {data.map((bannerItem) => (
                    <div key={bannerItem._id} className=" mb-2 bg-white p-4 rounded-lg shadow">
                        <h1 className="text-3xl font-bold mb-2">{bannerItem.title}</h1>
                        <img src={bannerItem.image} alt={bannerItem.description} className="mb-2" />
                        <h2 className='text-2xl'>{bannerItem.description}</h2>
                    </div>
                    ))}
                </marquee>
            </div>}
        </>
    )
}

export default Banneradd
