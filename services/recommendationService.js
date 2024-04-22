import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Follows from "../models/Follows.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Discovered from "../models/Discovered.js";
import mongoose, { get } from 'mongoose';
import { client as redisClient }  from "../configs/connectRedis.js";
import PostData from "../models/PostData.js";

export default {
    getPosts : async (req,res) => {
        try{
            const { user_id } = req;
            const limit = req.query.limit || 10;
            const postWithoutPostData = await getPostWithoutPostData(user_id,limit);
            const seventyPercentPopularityScore = await redisClient.get("seventyPercentPopularityScore");
            // Check if postId is in redis
            const posts = postWithoutPostData.map(post=>{
              const postDataId = post.postData;
              if(post.popularityScore >= seventyPercentPopularityScore && redisClient.exists(JSON.stringify(postDataId))){
                redisClient.get(JSON.stringify(postDataId)).then((postData)=>{
                  post.postData = JSON.parse(postData);
                })
              }else{
                PostData.findById(postDataId).then(async (postData)=>{
                  if(post.popularityScore >= seventyPercentPopularityScore)
                    redisClient.set(JSON.stringify(postDataId),JSON.stringify(postData));
                  post.postData = postData;
                })
              }
              return post;
            })

            
            return res.json(posts);
        }catch(err){
            console.log(err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
}

const getPostWithoutPostData = async (user_id,limit) => {

          

          // Convert user_id to ObjectId
          const userObjectId = new mongoose.Types.ObjectId(user_id);
          
          // Get liked sports of user
          const likedSportsOfUser = await getAggregatedSports([userObjectId],Like);

          // Get commented sports of user
          const commentedSportsOfUser = await getAggregatedSports([userObjectId],Comment);

          // Get followed users
          const followedUsersModels = await Follows.find({follower: userObjectId});
          const followedUsers = followedUsersModels.map(follow => follow.followee);

          // Get liked sports of followed users
          const likedSportsOfFollowedUsers = await getAggregatedSports(followedUsers,Like);
          
          // Get commented sports of followed users
          const commentedSportsOfFollowedUsers = await getAggregatedSports(followedUsers,Comment);

          // Combine liked sports and commented sports of user and followed users
          const likedSports = [...likedSportsOfUser, ...likedSportsOfFollowedUsers];
          const commentedSports = [...commentedSportsOfUser, ...commentedSportsOfFollowedUsers];

          // Get interests of user
          const interestsModel = await User.findById(userObjectId)
          const interests = interestsModel.interests;

          // Get viewed posts of user
          const discovered = await Discovered.find({user: userObjectId})
          const viewedPosts = discovered.map(discovered => discovered.post);
          

          const recommendation = await getRecommendedPostWithoutPostData(followedUsers, likedSports, commentedSports, interests, viewedPosts, limit,likedSportsOfUser,commentedSportsOfUser);
          await Discovered.insertMany(recommendation.map(post => ({user: userObjectId, post: post._id})));

          return recommendation;
    }

const getRecommendedPostWithoutPostData = async (followedUsers, likedSports, commentedSports, interests, viewedPosts,limit,userLikedSports,userCommentedSports) => {
    const posts = await Post.aggregate([
        {
          $match: {
            $or: [
              { user: { $in: followedUsers } },
              { sport: { $in: [...likedSports, ...commentedSports, ...interests] } },
            ],
            _id: {$nin: viewedPosts}
          }
        },
        {
          $addFields: {
            customPopularityScore: {
              $sum: [
                "$popularityScore",
                {
                  $cond: { if: { $in: ["$sport", userLikedSports] }, then: 2, else: 0 }
                },
                {
                  $cond: { if: { $in: ["$sport", userCommentedSports] }, then: 3, else: 0 }
                }
              ]
            }
          }
        },
        { $sort: { customPopularityScore: -1 } }, // Sort by customPopularityScore in descending order
        { $limit: limit },
      ])
    return posts;
}

const getAggregatedSports = async (user_ids,model) => {
    const sports = await model.aggregate([
        {
            $match: {user: {$in: user_ids}}
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'post',
                foreignField: '_id',
                as: 'post'
            }
        },
        {
            $unwind: '$post'
        },
        {
            $group: {
                _id: '$post.sport'
            }
        },
        {
            $project: {
                _id: 0,
                sportId: '$_id'
            }
        }
    ]);
    return sports.map(sport => sport.sportId);
}