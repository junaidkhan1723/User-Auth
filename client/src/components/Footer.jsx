import React from 'react';

function Footer() {
  return (
    <footer className="py-4 sm:py-6  text-gray-100 text-sm px-4 sm:px-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left w-full">

        <div className="flex flex-col items-center sm:items-start">
          <h4 className="text-white font-bold text-base sm:text-md mb-1 sm:mb-2 sm:ms-16 shimmer-text">User-Auth</h4>
          <p className="text-gray-300 text-xs sm:text-sm">© 2025 :: All rights reserved.</p>
        </div>


        <div className="flex flex-col items-center text-base sm:text-md sm:items-end gap-1">
          <p className='mb-1 sm:mb-3'>
            Developed by :: <span className="font-semibold text-white shimmer-text-footer mx-2 tracking-wide">Junaid Khan</span>
          </p>
          <div className="flex items-center gap-16 text-xl text-gray-300">
            <a
              href="https://github.com/junaidkhan1723"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub" 
            >
              <i className="bi bi-github hover:text-white transition"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/junaidkhan1723"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin hover:text-blue-600 transition"></i>
            </a>
            <a
              href="mailto:patanjunaid7888@gmail.com"
              aria-label="Email"
            >
              <i className="bi bi-envelope hover:text-red-600 transition"></i>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
