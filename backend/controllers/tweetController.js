import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!id) {
            return res.status(401).json({
                message: "User id is required.",
                success: false
            });
        };
        const user = await User.findById(id).select("-password");
        await Tweet.create({
            description,
            userId:id,
            userDetails:user
        });
        return res.status(201).json({
            message:"Tweet created successfully.",
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}
export const deleteTweet = async (req,res) => {
    try {
        const {id}  = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likeOrDislike = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User disliked your tweet."
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User liked your tweet."
            })
        }
    } catch (error) {
        console.log(error);
    }
};
export const getAllTweets = async (req,res) => {
    // loggedInUser ka tweet + following user tweet
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:loggedInUserTweets.concat(...followingUserTweet),
        })
    } catch (error) {
        console.log(error);
    }
}
export const getFollowingTweets = async (req,res) =>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAllExploreTweets = async (req,res) => {
    try {
        const allTweets = await Tweet.find().sort({ createdAt: -1 });
        return res.status(200).json({
            tweets: allTweets
        });
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const tweetId = req.params.id;
        const { userId, comment } = req.body;

        if (!userId || !comment) {
            return res.status(400).json({ message: "UserId and comment text are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const tweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $push: {
                    comments: {
                        userId: user._id,
                        name: user.name,
                        username: user.username,
                        comment: comment
                    }
                }
            },
            { new: true }
        );

        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found." });
        }

        return res.status(200).json({
            message: "Comment added successfully.",
            tweet: tweet,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getUserTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const tweets = await Tweet.find({ userId: id }).sort({ createdAt: -1 });
        return res.status(200).json({
            tweets: tweets
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
}