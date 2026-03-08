import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import Tweet from './Tweet';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Bookmarks = () => {
    const [bookmarkedTweets, setBookmarkedTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector(store => store.user);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user?._id) return;
            try {
                const res = await axios.get(`${USER_API_END_POINT}/bookmarks/${user?._id}`, {
                    withCredentials: true
                });
                if (res.data.tweets) {
                    setBookmarkedTweets(res.data.tweets);
                }
            } catch (error) {
                console.error("Error fetching bookmarked tweets:", error);
                toast.error("Failed to load bookmarks.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, [user?._id]);

    return (
        <div className='w-[50%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden min-h-screen'>
            <div className='flex items-center p-4 border-b border-white/10'>
                <h1 className='font-bold text-xl text-white'>Bookmarks</h1>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-400">Loading your saved tweets...</p>
                </div>
            ) : bookmarkedTweets.length === 0 ? (
                <div className="flex flex-col justify-center items-center p-12 text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Save Tweets for later</h2>
                    <p className="text-gray-400">Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.</p>
                </div>
            ) : (
                bookmarkedTweets.map((tweet) => <Tweet key={tweet?._id} tweet={tweet} />)
            )}
        </div>
    );
}

export default Bookmarks;
