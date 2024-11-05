import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; 
import "./styles.css";
import axios from "axios";
import { BaseUrl } from "../Util/util";

const CampaignGallery = () => {
  const [gallery1, setGallery1] =useState(null);
  const [gallery2, setGallery2] =useState(null);
  const [gallery3, setGallery3] =useState(null);
  const [gallery4, setGallery4] = useState(null);
  const [gallery5, setGallery5] = useState(null);
  const [gallery6, setGallery6] = useState(null);
  const images = [
    { id: 1, src: gallery1, alt: "gallery image 1", animation: "fade-up" },
    { id: 2, src: gallery2, alt: "gallery image 2", animation: "fade-up" },
    { id: 3, src: gallery3, alt: "gallery image 3", animation: "fade-up" },
    { id: 4, src: gallery4, alt: "gallery image 4", animation: "fade-up" },
    { id: 5, src: gallery5, alt: "gallery image 5", animation: "fade-up" },
    { id: 6, src: gallery6, alt: "gallery image 6", animation: "fade-up" },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/getImages`);
        setGallery1(response.data[0].sectionThree.imageOne);
        setGallery2(response.data[0].sectionThree.imageTwo);
        setGallery3(response.data[0].sectionThree.imageThree);
        setGallery4(response.data[0].sectionFour.imageOne);
        setGallery5(response.data[0].sectionFour.imageTwo);
        setGallery6(response.data[0].sectionFour.imageThree);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Animation happens only once
    });
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className="text-3xl font-semibold">CAMPAIGN GALLERY</h2>
          <div className="w-20 h-1 bg-gray-500 mx-auto mt-2 mb-4"></div>
          <h4 className="text-lg text-gray-600">
            Our prestigious voluntary work on campaigns by the team
          </h4>
        </div>

        {/* Image Gallery Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden"
              data-aos={image.animation}
            >
              <figure className="relative border-animation-container">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-64 transition-transform duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-500"
                />
                {/* Red Border Animation */}
                <span className="border-animation"></span>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignGallery;
