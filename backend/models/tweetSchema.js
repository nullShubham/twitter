import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userDetails:{
        type:Array,
        default:[]
    },
    comments:{
        type:[
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                name: String,
                username: String,
                comment: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        default:[]
    }
},{timestamps:true});
export const Tweet = mongoose.model("Tweet", tweetSchema);