import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getRefresh } from '../redux/tweetSlice';

const EditProfileModal = ({ onClose, initialName, initialBio, initialLocation }) => {
    const [name, setName] = useState(initialName || '');
    const [bio, setBio] = useState(initialBio || '');
    const [location, setLocation] = useState(initialLocation || '');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${USER_API_END_POINT}/profile/update/${user?._id}`, { 
                name, bio, location 
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            
            if(res.data.success){
                toast.success(res.data.message);
                dispatch(getRefresh()); // Refresh to update the parent Profile component
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-[600px] bg-[#000000] border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] relative overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-6">
                        <div 
                            onClick={onClose} 
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-white"
                        >
                            <IoMdClose size="24px" />
                        </div>
                        <h2 className="text-white font-bold text-xl">Edit profile</h2>
                    </div>
                    <button 
                        onClick={submitHandler} 
                        disabled={loading}
                        className="bg-white text-black font-bold px-6 py-1.5 rounded-full hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
                
                <form className="p-4 space-y-6 max-h-[70vh] overflow-y-auto" onSubmit={submitHandler}>
                    {/* Name Input */}
                    <div className="rounded-md border border-white/20 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 px-3 py-2 transition-all">
                        <label className="text-gray-400 text-sm block">Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent text-white outline-none mt-1 text-lg" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Bio Input */}
                    <div className="rounded-md border border-white/20 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 px-3 py-2 transition-all">
                        <label className="text-gray-400 text-sm block">Bio</label>
                        <textarea 
                            className="w-full bg-transparent text-white outline-none mt-1 text-lg resize-none min-h-[100px]" 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    {/* Location Input */}
                    <div className="rounded-md border border-white/20 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 px-3 py-2 transition-all">
                        <label className="text-gray-400 text-sm block">Location</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent text-white outline-none mt-1 text-lg" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
