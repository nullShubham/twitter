import React from 'react';
import { IoMdClose } from "react-icons/io";
import CreatePost from './CreatePost';

const CreatePostModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-[600px] bg-[#000000] border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] relative">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-white font-bold text-xl">Create Post</h2>
                    <div 
                        onClick={onClose} 
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-white"
                    >
                        <IoMdClose size="24px" />
                    </div>
                </div>
                <div onClick={(e) => {
                    // Hack to close modal automatically after a successful post if they click post 
                    // This relies on the click bubbling up.
                    if (e.target.tagName === 'BUTTON' && e.target.innerText === 'Post') {
                        setTimeout(() => onClose(), 500); 
                    }
                }}>
                    <CreatePost />
                </div>
            </div>
        </div>
    );
}

export default CreatePostModal;
