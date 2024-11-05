import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Img from './images/bloodDonationLogin4.jpg';
import img1 from './images/bloodDonationLogin1.jpg';
import img2 from './images/bloodDonationLogin2.jpg';
import img3 from './images/bloodDonationLogin4.jpg';
import img4 from './images/bloodDonationLogin4.jpg';

import donor4 from './images/donarimage/charts.png';
import donor5 from './images/donarimage/doner2.jpg';
import donor6 from './images/donarimage/charts.png';
import donor7 from './images/donarimage/doner4.webp';
import bloodDonationImage from './images/welcomepage1.jpg';

import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from './Util/util';
import WelcomePageSlider from './Welcomepage/WelcomePageSlider';
import CampaignGallery from './Welcomepage/CampaignGallery';
import Banneradd from './Welcomepage/Banneradd';


const WelcomePage = () => {
    const [donor1, setDonor1] = useState(null)
    const [donor2, setDonor2] = useState(null)
    const [donor3, setDonor3] = useState(null)




    const images = [Img, img1, img2, img3];
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null);




    const testimonials = [
        {
            name: "John Doe",
            testimonial: "Donating blood was a simple process and I felt great knowing I was helping others. Highly recommend everyone to donate!",
            image: donor1,
        },
        {
            name: "Jane Smith",
            testimonial: "I was nervous at first, but the staff made me feel comfortable. It’s an easy way to make a big difference.",
            image: donor2,
        },
        {
            name: "Emily Johnson",
            testimonial: "Every donation can save lives. It's a small effort with a huge impact. Don’t hesitate to give blood!",
            image: donor3,
        }
    ];



    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/getImages`);
                console.log(response);
                setDonor1(response.data[0].sectionTwo.imageOne);
                setDonor2(response.data[0].sectionTwo.imageTwo);
                setDonor3(response.data[0].sectionTwo.imageThree);
                setVideoUrl(response.data[0].sectionFive.videoOne)
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        AOS.init({ duration: 1000 });
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2000); // Change image every 2 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollTo({
                left: sliderRef.current.clientWidth * currentIndex,
                behavior: 'smooth',
            });
        }
    }, [currentIndex]);



    const Marquee = ({ events }) => {
        return (
            <div className="  flex w-full">
                <span className="inline-block text-4xl mb-1 text-red-500 mr-2 marquee">
                    {events.map((event, index) => {
                        return (
                            <span className='mr-3' key={index}>
                                <a href='#upcomingevents' className='  hover:underline'>   {event.eventName} </a>
                            </span>
                        );
                    })}
                </span>
            </div>
        );
    };

    const Hospitalmar = () => {
        return (
            <>
                <div className=" text-3xl mb-1 text-red-500 mr-2 marquee">
                <Link to={'/hospitalbloodinfo'} className='hover:underline' > Hospital Blood Info</Link>   
                </div>
            </>
        );
    }





    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/getEvents`);
            setEvents(response.data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };


    //  fatching images from the backeng 
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/getImages`);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [])

    function formatDateToIndian(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const monthIndex = date.getMonth(); // Get the index of the month
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Array of month names
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];


        const month = months[monthIndex];

        return `${day} ${month} ${year}`;
    }


    return (
        <div className="bg-gray-100 p-  min-h-screen overflow-hidden">
            <div className='bg-red-50'>
            <marquee>  <Marquee events={events} /></marquee>
            </div>
                  
              
            <hr className='text-red-600'/>
            <div className="scroll-container bg-blue-100">
                <div className="scroll-content">
                    <Hospitalmar />
                </div>
            </div>


            <Banneradd />
            <WelcomePageSlider data-aos='fade-left' />

            <div className="container mx-auto mt-12">




                <div className="flex flex-col lg:flex-row items-center flex-wrap">


                    {/* Text Section */}
                    <div data-aos="fade-right" className="w-full lg:w-1/2 text-left p-4 lg:p-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-4">
                            Welcome to Blood Donation!
                        </h2>
                        <p className="text-gray-700 text-base sm:text-lg lg:text-xl mb-6">
                            Saving lives is just a drop away. Your blood donation can make a massive difference in someone's life. Join us in this noble cause and help those in need.
                        </p>
                        <p className="text-gray-700 text-base sm:text-lg lg:text-xl mb-6">
                            Millions of people need blood transfusions every year, and by donating your blood, you can save lives and help your community. One donation can save up to three lives!
                        </p>
                        <a href="/loginsignup" className="bg-red-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow hover:bg-red-700 transition duration-300">
                            Donate Now
                        </a>
                    </div>

                    {/* Image Section */}
                    <div data-aos="fade-left" className="w-full lg:w-1/2 p-4 lg:p-6">
                        {/* <img
                            src={images[currentIndex]}
                            alt="Blood Donation"
                            className="rounded-lg shadow-lg object-cover w-full h-64 sm:h-80 lg:h-96"
                        /> */}
                        <video className="w-full max-w-3xl rounded-lg shadow-lg"

                            src={videoUrl}
                            autoPlay
                            loop
                            muted // This ensures the video starts muted, allowing autoplay to work
                            playsInline // Helps autoplay on mobile devices
                            controls={false} // Hide default controls
                        >
                            {videoUrl ? (
                                <source src={videoUrl} type="video/mp4" />
                            ) : (
                                <p>Loading video...</p>
                            )}
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                {/* Why Donate Section */}
                <section id="donate" className="mt-12 lg:mt-20">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6" data-aos="fade-up">
                        Why Donate Blood?
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full lg:w-1/3" data-aos="fade-up">
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-red-600 mb-4">Save Lives</h4>
                            <p className="text-gray-700">Every blood donation has the potential to save up to three lives. Your contribution is invaluable.</p>
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full lg:w-1/3" data-aos="fade-up" data-aos-delay="200">
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-red-600 mb-4">Maintain Blood Supply</h4>
                            <p className="text-gray-700">Donating blood helps maintain the supply of blood needed for emergencies and surgeries.</p>
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full lg:w-1/3" data-aos="fade-up" data-aos-delay="400">
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-red-600 mb-4">Health Benefits</h4>
                            <p className="text-gray-700">Donating blood can improve your overall cardiovascular health and well-being.</p>
                        </div>
                    </div>
                </section>

                {/* Donor Section */}   {/* Testimonials Section */}
                <div className='mt-10 mb-10'>
                    <Carousel>
                        <Carousel.Item interval={1000}>
                            <img
                                className="w-full h-80 lg:h-[500px] object-cover"
                                src={donor1}
                                alt="First slide"
                            />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={500}>
                            <img
                                className="w-full h-80 lg:h-[500px] object-cover"
                                src={donor2}
                                alt="Second slide"
                            />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="w-full h-80 lg:h-[500px] object-cover"
                                src={donor3}
                                alt="Third slide"
                            />
                            <Carousel.Caption>

                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>

                </div>
                {/* Additional Section */}
                <section className="my-12 lg:my-20">
                    <div className="container w-full mx-auto">
                        <div className="flex flex-col lg:flex-row items-center">

                            {/* Left Side Image */}
                            <div className="w-full lg:w-1/2  lg:p-6" data-aos="fade-right">
                                <img
                                    src={bloodDonationImage}
                                    alt="Blood Donation"
                                    className="rounded-lg shadow-lg object-cover  w-full h-64 sm:h-80 lg:h-96"
                                />
                            </div>

                            {/* Right Side Text */}
                            <div className="w-full lg:w-1/2 mt-10 lg:mt-0 sm:mt-3 md:mt-0 xl:mt-0 lg:p-6" data-aos="fade-left">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                                    Why Blood Donation Matters
                                </h3>
                                <p className="text-gray-700 text-base sm:text-lg lg:text-xl mb-4">
                                    Blood donation is a critical part of maintaining a healthy blood supply for patients in need. It helps in various medical scenarios, including surgeries, trauma care, and treatment of chronic conditions.
                                </p>
                                <p className="text-gray-700 text-base sm:text-lg lg:text-xl mb-6">
                                    By donating blood, you are making a direct impact on the lives of individuals and helping to ensure that hospitals and clinics have the resources they need to care for patients in emergencies.
                                </p>
                                <a href="#donate" className="bg-red-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow hover:bg-red-700 transition duration-300">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="my-12 lg:my-20">
                    <div className="container mx-auto ">
                        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8" data-aos="fade-up">
                            What Our Donors Say
                        </h3>
                        <div className="flex flex-wrap justify-center gap-6">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="w-full sm:w-1/2 lg:w-1/3"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 200}
                                >
                                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full mb-4"
                                        />
                                        <p className="text-gray-700 mb-4">"{testimonial.testimonial}"</p>
                                        <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <CampaignGallery />

                <section className="my-12 lg:my-20" id='upcomingevents'>
                    <div className="container mx-auto ">
                        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8" data-aos="fade-up">
                            Upcoming Events
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    className=""
                                    data-aos="fade-up"
                                    data-aos-delay={index * 200}
                                >
                                    <div className="bg-white p-6 rounded-lg shadow-lg">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{event.eventName}</h4>
                                        <p className="text-gray-600 mb-2">{formatDateToIndian(event.eventDate) || 'Na'}</p>
                                        <p className="text-gray-600 mb-4">{event.eventLocation}</p>
                                        <p className="text-gray-700">{event.eventDescription}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default WelcomePage;
