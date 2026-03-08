import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import Avatar from "react-avatar";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';

const ConnectionsModal = ({ isOpen, onClose, userId, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'followers');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${USER_API_END_POINT}/connections/${userId}`, {
                    withCredentials: true
                });
                setFollowers(res.data.followers);
                setFollowing(res.data.following);
            } catch (error) {
                console.log("Error fetching connections:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchConnections();
    }, [isOpen, userId]);

    if (!isOpen) return null;

    const displayList = activeTab === 'followers' ? followers : following;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-[500px] h-[500px] bg-[#000000] border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] relative flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10 shrink-0">
                    <div 
                        onClick={onClose} 
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-white mr-4"
                    >
                        <IoMdClose size="24px" />
                    </div>
                    <h2 className="text-white font-bold text-xl">Connections</h2>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 shrink-0">
                    <div 
                        onClick={() => setActiveTab('followers')}
                        className={`flex-1 text-center py-3 cursor-pointer transition-colors font-bold ${activeTab === 'followers' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                        Followers
                    </div>
                    <div 
                        onClick={() => setActiveTab('following')}
                        className={`flex-1 text-center py-3 cursor-pointer transition-colors font-bold ${activeTab === 'following' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                        Following
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex justify-center p-8 text-gray-500">Loading...</div>
                    ) : displayList.length === 0 ? (
                        <div className="flex justify-center p-8 text-gray-500">
                            No {activeTab} yet.
                        </div>
                    ) : (
                        displayList.map((user) => (
                            <div key={user._id} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="40" round={true} />
                                    <div>
                                        <h1 className="font-bold text-white text-sm hover:underline" onClick={() => {
                                            onClose();
                                            window.location.href = `/profile/${user._id}`;
                                        }}>
                                            {user.name}
                                        </h1>
                                        <p className="text-sm text-gray-400">@{user.username}</p>
                                    </div>
                                </div>
                                <button onClick={() => {
                                    onClose();
                                    window.location.href = `/profile/${user._id}`;
                                }} className="px-4 py-1.5 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-200 transition-colors">
                                    Profile
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConnectionsModal;
