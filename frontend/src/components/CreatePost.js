import React, { useState, useRef } from 'react';
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast"
import { useSelector, useDispatch } from "react-redux";
import { getAllTweets, getIsActive, getRefresh } from '../redux/tweetSlice';

const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { user } = useSelector(store => store.user);
    const {isActive} = useSelector(store=>store.tweet);
    const dispatch = useDispatch();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const submitHandler = async () => {
        if (!description.trim() && !selectedImage) {
            toast.error("Add some text or an image to post.");
            return;
        }
        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/create`, { description, id: user?._id }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post.");
            console.log(error);
        }
        setDescription("");
        removeImage();
    }

    const forYouHandler = () => {
         dispatch(getIsActive(true));
    }
    const followingHandler = () => {
        dispatch(getIsActive(false));
    }

    return (
        <div className='w-[100%]'>
            <div>
                <div className='flex items-center justify-evenly border-b border-white/10'>
                    <div onClick={forYouHandler} className={`${isActive ? "border-b-4 border-blue-500" : "border-b-4 border-transparent"} cursor-pointer hover:bg-white/5 w-full text-center px-4 py-3 transition-colors duration-200`}>
                        <h1 className='font-semibold text-gray-300 hover:text-white text-lg transition-colors'>For you</h1>
                    </div>
                    <div onClick={followingHandler} className={`${!isActive ? "border-b-4 border-blue-500" : "border-b-4 border-transparent"} cursor-pointer hover:bg-white/5 w-full text-center px-4 py-3 transition-colors duration-200`}>
                        <h1 className='font-semibold text-gray-300 hover:text-white text-lg transition-colors'>Following</h1>
                    </div>
                </div>
                <div>
                    <div className='flex items-center p-4'>
                        <div>
                            <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="40" round={true} />
                        </div>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} className='w-full outline-none border-none text-xl ml-2 bg-transparent text-white placeholder:text-gray-500' type="text" placeholder='What is happening?!' />
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative mx-4 mb-2">
                            <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-cover rounded-2xl border border-white/10" />
                            <div 
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full cursor-pointer hover:bg-black/90 transition-colors"
                            >
                                <IoMdClose size="20px" />
                            </div>
                        </div>
                    )}

                    <div className='flex items-center justify-between p-4 border-b border-white/10'>
                        <div>
                            {/* Hidden file input */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className='cursor-pointer text-blue-500 hover:bg-blue-500/10 p-2 rounded-full transition-colors'
                            >
                                <CiImageOn size="24px" />
                            </div>
                        </div>
                        <button onClick={submitHandler} className='bg-white text-black font-bold px-6 py-1.5 text-lg text-right border-none rounded-full hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all'>Post</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreatePost