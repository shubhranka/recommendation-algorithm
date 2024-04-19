import { default as mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    popularityScore: {
        type: Number,
        default: 0
    },
});

export default mongoose.model('Post', postSchema);