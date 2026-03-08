import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from 'react-router-dom';

const RightSidebar = ({ otherUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = otherUsers?.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return user?.name?.toLowerCase().includes(q) || user?.username?.toLowerCase().includes(q);
  });

  return (
    <div className='w-[25%]'>
      <div className='flex items-center p-2 bg-white/10 rounded-full outline-none w-full border border-white/10 text-white'>
        <CiSearch size="20px" className='text-white' />
        <input 
          type="text" 
          className='bg-transparent outline-none px-2 w-full text-white placeholder:text-gray-400' 
          placeholder='Search' 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className='p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 my-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]'>
        <h1 className='font-bold text-lg text-white mb-2'>{searchQuery.trim() ? 'Search Results' : 'Who to follow'}</h1>
        {
          filteredUsers?.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No users found.</p>
          ) : (
            filteredUsers?.map((user) => {
              return (
                <div key={user?._id} className='flex items-center justify-between my-3'>
                  <div className='flex'>
                    <div>
                      <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="40" round={true} />
                    </div>
                    <div className='ml-2'>
                      <h1 className='font-bold text-white'>{user?.name}</h1>
                      <p className='text-sm text-gray-400'>{`@${user?.username}`}</p>
                    </div>
                  </div>
                  <div>
                    <Link to={`/profile/${user?._id}`}>
                      <button className='px-4 py-1.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)]'>Profile</button>
                    </Link>
                  </div>
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default RightSidebar