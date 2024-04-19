import { default as mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        min: [0, 'Likes cannot be less than 0']
    },
    comments: {
        type: Number,
        default: 0,
        min: [0, 'Comments cannot be less than 0']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    popularityScore: {
        type: Number,
        default: 0
    },
});

export default mongoose.model('Post', postSchema);