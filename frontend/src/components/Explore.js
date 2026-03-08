import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TWEET_API_END_POINT } from '../utils/constant';
import Tweet from './Tweet';
import toast from 'react-hot-toast';

const Explore = () => {
    const [exploreTweets, setExploreTweets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExploreTweets = async () => {
            try {
                const res = await axios.get(`${TWEET_API_END_POINT}/explore`, {
                    withCredentials: true
                });
                if (res.data.tweets) {
                    setExploreTweets(res.data.tweets);
                }
            } catch (error) {
                console.error("Error fetching explore tweets:", error);
                toast.error("Failed to load explore feed.");
            } finally {
                setLoading(false);
            }
        };
        fetchExploreTweets();
    }, []);

    return (
        <div className='w-[50%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden min-h-screen'>
            <div className='flex items-center p-4 border-b border-white/10'>
                <h1 className='font-bold text-xl text-white'>Explore</h1>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-400">Loading global feed...</p>
                </div>
            ) : exploreTweets.length === 0 ? (
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-400">No tweets found in the database.</p>
                </div>
            ) : (
                exploreTweets.map((tweet) => <Tweet key={tweet?._id} tweet={tweet} />)
            )}
        </div>
    );
}

export default Explore;
