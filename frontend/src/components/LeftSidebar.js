import React from 'react';
import { CiHome } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { Link,useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';
import CreatePostModal from './CreatePostModal';

const LeftSidebar = () => {
    const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);

    const {user} = useSelector(store=>store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getMyProfile(null));
            navigate('/login');
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-[20%]'>
            <div>
                <div className='my-4'>
                    <Link to="/" className='flex items-center my-2 px-4 py-2 hover:bg-white/10 hover:cursor-pointer rounded-full transition-all duration-200'>
                        <div>
                            <CiHome size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Home</h1>
                    </Link>
                    <Link to="/explore" className='flex items-center my-2 px-4 py-2 hover:bg-white/10 hover:cursor-pointer rounded-full transition-all duration-200'>
                        <div>
                            <CiHashtag size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Explore</h1>
                    </Link>
                    <Link to="/notifications" className='flex items-center my-2 px-4 py-2 hover:bg-white/10 hover:cursor-pointer rounded-full transition-all duration-200'>
                        <div>
                            <IoIosNotificationsOutline size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Notifications</h1>
                    </Link>
                    <Link to={`/profile/${user?._id}`} className='flex items-center my-2 px-4 py-2 hover:bg-white/10 hover:cursor-pointer rounded-full transition-all duration-200'>
                        <div>
                            <CiUser size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Profile</h1>
                    </Link>
                    <Link to="/bookmarks" className='flex items-center my-2 px-4 py-2 hover:bg-white/10 hover:cursor-pointer rounded-full transition-all duration-200'>
                        <div>
                            <CiBookmark size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Bookmarks</h1>
                    </Link>
                    <div onClick={logoutHandler} className='flex items-center my-2 px-4 py-2 hover:bg-white/10 hover:cursor-pointer rounded-full text-red-400 hover:text-red-500 transition-all duration-200'>
                        <div>
                            <AiOutlineLogout size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Logout</h1>
                    </div>
                     <button onClick={() => setIsPostModalOpen(true)} className='px-4 py-2 border-none text-md bg-white text-black font-bold w-full rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] mt-2'>Post</button>
                </div>
            </div>
            {isPostModalOpen && <CreatePostModal onClose={() => setIsPostModalOpen(false)} />}
        </div>
    )
}

export default LeftSidebar