import express from "express";
import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, likeOrDislike, getAllExploreTweets, addComment, getUserTweets } from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
 
router.route("/create").post(isAuthenticated,createTweet);
router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
router.route("/like/:id").put(isAuthenticated,likeOrDislike);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
router.route("/explore").get(isAuthenticated, getAllExploreTweets);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/userstweets/:id").get(isAuthenticated, getUserTweets);

export default router;