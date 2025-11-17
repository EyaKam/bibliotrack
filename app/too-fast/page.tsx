import React, { use } from 'react' ;

const page = () => {
  return (
    <main className='root-container flex min-h-screen flex-col 
    items-center justify-center'>
        <h1 className='font-bebas-neue text-5xl font-bold text-light-100'>
            whoa,slow down there speedy</h1>
        <p className='mt-3 maw-w-xl text-light-400 '>
          looks like you have been making requests a bit too quickly.
          for your own safety and ours, we have to ask you to take a break
          and try again in a few minutes.
        </p>



        </main>
  )
};

export default page;