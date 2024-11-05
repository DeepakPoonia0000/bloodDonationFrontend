import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const ScrolltoTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0); // Scrolls to the top of the page
    }, [pathname]);
  
    return null;
}

export default ScrolltoTop
