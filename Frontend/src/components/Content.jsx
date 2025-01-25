import React from 'react'

function Content() {
  return (
    <>
<section className="text-gray-600 body-font">
<div className="container px-5 py-10 sm:py-1 mx-auto">
<div className="flex flex-col text-center w-full mb-20">
  <div className="flex flex-wrap items-center justify-center p-6 space-y-4 lg:space-y-0 lg:space-x-6 bg-white rounded-xl shadow-lg hover:shadow-xl">
    {/* Search Bar */}
    <div className="flex bg-gray-100 p-4 w-full max-w-md space-x-4 rounded-lg">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input
        className="bg-gray-100 outline-none flex-grow"
        type="text"
        placeholder="Search Documents..."
      />
    </div>

    {/* Filters Dropdown */}
    <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
      <details className="dropdown">
        <summary
          tabIndex={0}
          role="button"
          className="btn m-1 flex items-center space-x-2"
        >
          <i className="fa-solid fa-sliders"></i> <span>Filters</span>
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a>Inward</a>
          </li>
          <li>
            <a>Outward</a>
          </li>
          <li>
            <a>Letter</a>
          </li>
          <li>
            <a>Circular</a>
          </li>
          <li>
            <a>Notice</a>
          </li>
          <li>
            <a>Bills</a>
          </li>
        </ul>
      </details>
    </div>

    {/* Search Button */}
    <div className="bg-indigo-600 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 cursor-pointer">
      <span>Search</span>
    </div>
  </div>
</div>


    <div className="flex flex-wrap -m-4">
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      <div className="lg:w-1/4 md:w-1/2 p-4 w-full border-2 hover:border-blue-300 rounded">
        <a className="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" className="object-cover border-2 rounded object-center w-full h-full block" src="../src/assets/Default_Doc.png"/>
        </a>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">TAG : Letter </h3>
            <h2 className="text-gray-900 title-font text-lg font-medium">Project Report Formate</h2>
            <p className="mt-1">recieved by xyz_user</p>
          </div>
          <div className="mt-4">
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
            <i className="fa-solid fa-ellipsis-vertical"></i></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
              <li><a>View Details</a></li>
              <li><a>Add Comment</a></li>
            </ul>
          </div>

          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>
    </>
  )
}

export default Content