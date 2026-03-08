import React from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { FaHeart, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { TWEET_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { bookmarkUpdate } from '../redux/userSlice';
import { timeSince } from "../utils/constant";
import { useState } from "react";
import { Link } from 'react-router-dom';

const Tweet = ({ tweet }) => {
    const { user } = useSelector(store => store.user); 
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [loadingComment, setLoadingComment] = useState(false);
     
    const dispatch = useDispatch();
    const likeOrDislikeHandler = async (id) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, {
                withCredentials: true
            })
            console.log(res);
            dispatch(getRefresh());
            toast.success(res.data.message);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to like tweet.");
            console.log(error);
        }
    }

    const bookmarkHandler = async (id) => {
        try {
            const res = await axios.put(`${USER_API_END_POINT}/bookmark/${id}`, { id: user?._id }, {
                withCredentials: true
            })
            dispatch(bookmarkUpdate(id));
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to bookmark.");
            console.log(error);
        }
    }
    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            console.log(res);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }
    const commentHandler = async (e) => {
        e.preventDefault();
        if(!commentText.trim()) return;
        setLoadingComment(true);
        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/comment/${tweet?._id}`, {
                userId: user?._id,
                comment: commentText
            }, {
                withCredentials: true
            });
            dispatch(getRefresh());
            setCommentText(""); // Auto clear box on success
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment.");
            console.log(error);
        } finally {
            setLoadingComment(false);
        }
    }

    return (
        <div className='border-b border-white/10'>
            <div>
                <div className='flex p-4'>
                    <Link to={`/profile/${tweet?.userId}`}>
                        <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="40" round={true} />
                    </Link>
                    <div className=' ml-2 w-full'>
                        <div className='flex items-center'>
                            <Link to={`/profile/${tweet?.userId}`} className="hover:underline">
                                <h1 className='font-bold text-white'>
                                    {tweet?.userId === user?._id ? 'You' : tweet?.userDetails[0]?.name}
                                </h1>
                            </Link>
                            <p className='text-gray-400 text-sm ml-1'>{`@${tweet?.userDetails[0]?.username} · ${timeSince(tweet?.createdAt)}`}</p>
                        </div>
                        <div>
                            <p className='text-white mt-1'>{tweet?.description}</p>
                        </div>
                        <div className='flex justify-between my-3'>
                            <div className='flex items-center text-gray-500 hover:text-green-500 transition-colors cursor-pointer group' onClick={() => setShowComments(!showComments)}>
                                <div className='p-2 group-hover:bg-green-500/20 rounded-full transition-colors'>
                                    <FaRegComment size="20px" />
                                </div>
                                <p className='ml-1'>{tweet?.comments?.length || 0}</p>
                            </div>
                            <div className='flex items-center text-gray-500 hover:text-pink-500 transition-colors cursor-pointer group' onClick={() => likeOrDislikeHandler(tweet?._id)}>
                                <div className='p-2 group-hover:bg-pink-500/20 rounded-full transition-colors'>
                                    {tweet?.like?.includes(user?._id) ? (
                                        <FaHeart size="24px" className="text-pink-500" />
                                    ) : (
                                        <CiHeart size="24px" />
                                    )}
                                </div>
                                <p className='ml-1'>{tweet?.like?.length}</p>
                            </div>
                            <div className='flex items-center text-gray-500 hover:text-yellow-500 transition-colors cursor-pointer group' onClick={() => bookmarkHandler(tweet?._id)}>
                                <div className='p-2 group-hover:bg-yellow-500/20 rounded-full transition-colors'>
                                    {user?.bookmarks?.includes(tweet?._id) ? (
                                        <FaBookmark size="24px" className="text-yellow-500" />
                                    ) : (
                                        <CiBookmark size="24px" />
                                    )}
                                </div>
                            </div>
                            {
                                user?._id === tweet?.userId && (
                                    <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center text-gray-500 hover:text-red-500 transition-colors cursor-pointer group'>
                                        <div className='p-2 group-hover:bg-red-500/20 rounded-full transition-colors'>
                                            <MdOutlineDeleteOutline size="24px" />
                                        </div>
                                    </div>
                                )
                            }

                        </div>

                        {/* Comments Section Dropdown */}
                        {showComments && (
                            <div className="mt-4 border-t border-white/10 pt-4">
                                <form onSubmit={commentHandler} className="flex items-center space-x-2 w-full mb-4">
                                    <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="30" round={true} />
                                    <input 
                                        type="text" 
                                        placeholder="Post your reply" 
                                        className="flex-1 bg-transparent text-white border-b border-white/20 focus:border-blue-500 outline-none px-2 py-1 text-sm transition-colors mr-2"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={loadingComment || !commentText.trim()}
                                        className="bg-white text-black font-bold px-4 py-1 text-sm rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                    >
                                        Reply
                                    </button>
                                </form>

                                {/* Render existing comments */}
                                {tweet?.comments && tweet.comments.map((c, index) => (
                                    <div key={index} className="flex mt-3 space-x-2 pb-2">
                                        <Link to={`/profile/${c.userId}`} className="mt-1 shrink-0">
                                            <Avatar name={c.name} size="30" round={true} />
                                        </Link>
                                        <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center space-x-1">
                                                <Link to={`/profile/${c.userId}`} className="hover:underline">
                                                    <h1 className="font-bold text-white text-sm">
                                                        {c.userId === user?._id ? 'You' : c.name}
                                                    </h1>
                                                </Link>
                                                <p className="text-gray-400 text-xs">@{c.username}</p>
                                            </div>
                                            <p className="text-sm text-gray-200 mt-1">{c.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet