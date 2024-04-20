import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Follows from "../models/Follows.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Discovered from "../models/Discovered.js";
import mongoose from 'mongoose';

export default {
    getPosts : async (req,res) => {
        try{

        const { user_id } = req;

        const userObjectId = new mongoose.Types.ObjectId(user_id);

        const likedSportsOfUser = await getAggregatedSports([userObjectId],Like);
        const commentedSportsOfUser = await getAggregatedSports([userObjectId],Comment);

        const followedUsersModels = await Follows.find({follower: userObjectId});
        const followedUsers = followedUsersModels.map(follow => follow.followee);

        const likedSportsOfFollowedUsers = await getAggregatedSports(followedUsers,Like);
        const commentedSportsOfFollowedUsers = await getAggregatedSports(followedUsers,Comment);

        const likedSports = [...likedSportsOfUser, ...likedSportsOfFollowedUsers];
        const commentedSports = [...commentedSportsOfUser, ...commentedSportsOfFollowedUsers];

        const interestsModel = await User.findById(userObjectId)
        const interests = interestsModel.interests;
        const discovered = await Discovered.find({user: userObjectId})
        const viewedPosts = discovered.map(discovered => discovered.post);
        const limit = req.query.limit || 10;

        const recommendation = await getRecommendedPost(followedUsers, likedSports, commentedSports, interests, viewedPosts, limit,likedSportsOfUser,commentedSportsOfUser);
        await Discovered.insertMany(recommendation.map(post => ({user: userObjectId, post: post._id})));
        return res.json(recommendation);
        }catch(err){
            console.log(err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
}

const getRecommendedPost = async (followedUsers, likedSports, commentedSports, interests, viewedPosts,limit,userLikedSports,userCommentedSports) => {
    const posts = await Post.aggregate([
        {
          $match: {
            $or: [
              { user: { $in: followedUsers } },
              { sport: { $in: [...likedSports, ...commentedSports, ...interests] } },
            ],
            _id: { $nin: viewedPosts }
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
        { $limit: limit }
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