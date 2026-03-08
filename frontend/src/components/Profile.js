import React from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector,useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';
import EditProfileModal from './EditProfileModal';
import ConnectionsModal from './ConnectionsModal';
import Tweet from './Tweet';
import { TWEET_API_END_POINT } from '../utils/constant';

const Profile = () => {
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isConnectionsModalOpen, setIsConnectionsModalOpen] = React.useState(false);
    const [connectionsTab, setConnectionsTab] = React.useState('followers');
    const [userTweets, setUserTweets] = React.useState([]);
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    useGetProfile(id);
    const dispatch = useDispatch();

    React.useEffect(() => {
        const fetchUserTweets = async () => {
            try {
                const res = await axios.get(`${TWEET_API_END_POINT}/userstweets/${id}`, {
                    withCredentials: true
                });
                setUserTweets(res.data.tweets);
            } catch (error) {
                console.log("Error fetching user tweets:", error);
            }
        };
        fetchUserTweets();
    }, [id, profile]); // Refresh if profile changes or we navigate to a new ID

    const followAndUnfollowHandler = async () => {
        if(user.following.includes(id)){
            // unfollow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
            
        }else{
            // follow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
        }
    }

    return (
        <div className='w-[50%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden min-h-screen'>
            <div>
                <div className='flex items-center py-2 px-4 backdrop-blur-md bg-black/40 border-b border-white/10 sticky top-0 z-10'>
                    <Link to="/" className='p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white'>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-4'>
                        <h1 className='font-bold text-lg text-white'>{profile?.name}</h1>
                        <p className='text-gray-400 text-sm'>{userTweets.length} post{userTweets.length !== 1 && 's'}</p>
                    </div>
                </div>
                <img src="https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360" alt="banner" className='w-full object-cover h-48 opacity-90' />
                <div className='absolute top-40 ml-4 border-4 border-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]'>
                    <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="120" round={true} />
                </div>
                <div className='text-right m-4'>
                    {
                        profile?._id === user?._id ? (
                            <button onClick={() => setIsEditModalOpen(true)} className='px-4 py-1.5 hover:bg-white/10 rounded-full border border-gray-400 text-white font-bold transition-all'>Edit Profile</button>

                        ) : (
                            <button onClick={followAndUnfollowHandler} className='px-4 py-1.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all'>{user.following.includes(id) ? "Following" : "Follow"}</button>
                        )
                    }
                </div>
                <div className='m-4'>
                    <h1 className='font-bold text-xl text-white'>{profile?.name}</h1>
                    <p className='text-gray-400'>{`@${profile?.username}`}</p>
                </div>
                <div className='m-4 text-sm text-gray-200'>
                    <p>{profile?.bio || "No bio yet."}</p>
                    {profile?.location ? (
                        <div className="flex items-center text-gray-400 mt-2">
                           <span>📍 {profile.location}</span>
                        </div>
                    ) : null}
                    
                    <div className="flex items-center gap-4 mt-4 text-sm">
                        <div 
                            className="cursor-pointer hover:underline"
                            onClick={() => {
                                setConnectionsTab('following');
                                setIsConnectionsModalOpen(true);
                            }}
                        >
                            <span className="font-bold text-white">{profile?.following?.length || 0}</span> <span className="text-gray-500">Following</span>
                        </div>
                        <div 
                            className="cursor-pointer hover:underline"
                            onClick={() => {
                                setConnectionsTab('followers');
                                setIsConnectionsModalOpen(true);
                            }}
                        >
                            <span className="font-bold text-white">{profile?.followers?.length || 0}</span> <span className="text-gray-500">Followers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Tweets Feed */}
            <div className="border-t border-white/10 mt-4">
                {userTweets.map((tweet) => (
                    <Tweet key={tweet._id} tweet={tweet} />
                ))}
            </div>

            {isEditModalOpen && (
                <EditProfileModal 
                    onClose={() => setIsEditModalOpen(false)} 
                    initialName={profile?.name} 
                    initialBio={profile?.bio}
                    initialLocation={profile?.location}
                />
            )}

            <ConnectionsModal 
                isOpen={isConnectionsModalOpen} 
                onClose={() => setIsConnectionsModalOpen(false)} 
                userId={id} 
                initialTab={connectionsTab} 
            />
        </div>
    )
}

export default Profile