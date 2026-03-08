import React from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";

const Notifications = () => {
    return (
        <div className='w-[50%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden min-h-screen'>
            <div className='flex items-center p-4 border-b border-white/10'>
                <h1 className='font-bold text-xl text-white'>Notifications</h1>
            </div>
            
            <div className='flex flex-col items-center justify-center p-12 text-center h-[60%]'>
                <div className='p-6 bg-white/5 rounded-full mb-6 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
                    <IoIosNotificationsOutline size="64px" className="text-white opacity-80" />
                </div>
                <h1 className='text-2xl font-bold text-white mb-2'>Nothing to see here — yet</h1>
                <p className='text-gray-400 max-w-sm'>When someone likes or replies to one of your Tweets, you'll see it here.</p>
            </div>
        </div>
    );
}

export default Notifications;
