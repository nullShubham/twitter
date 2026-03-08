import React from 'react'
import CreatePost from './CreatePost.js'
import Tweet from './Tweet.js'
import {useSelector} from "react-redux";

const Feed = () => {
  const {tweets} = useSelector(store=>store.tweet);
  return (
    <div className='w-[50%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden'>
      <div>
        <CreatePost/>
        {
          tweets?.map((tweet)=> <Tweet key={tweet?._id} tweet={tweet}/>)
        }
        
         
      </div>
    </div>
  )
}

export default Feed