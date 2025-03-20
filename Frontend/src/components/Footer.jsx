import React from 'react'

function Footer() {
  return (
    <>
    <footer className="text-gray-300 body-font border-t">
  <div className="container p-5 mx-auto flex items-center sm:flex-row flex-col">
    <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
      <span className="ml-3 text-base">MSU Computer Center</span>
    </a>
    <p className="text-sm text-center text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2024-2025 All Rights Reserved - Developed By <span className='font-bold'>Maheswari Panda</span>
    </p>
    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
      <a className="text-gray-500">
         <i className="fa-brands fa-facebook-f"></i>
      </a>
      <a className="ml-3 text-gray-500">
        <i className="fa-brands fa-x-twitter"></i>
      </a>
      <a className="ml-3 text-gray-500">
        <i className="fa-brands fa-instagram"></i>
      </a>
      <a className="ml-3 text-gray-500">
        <i className="fa-brands fa-linkedin-in"></i>
      </a>
    </span>
  </div>
</footer>
    </>
  )
}

export default Footer