import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center h-24'>
      <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-white border-gray-800'></div>
      <p className='text-rose-600 ms-5'>Server is Loading...</p>
    </div>
  )
}

export default Loader
