import mongoose from 'mongoose';

const discoveredSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

export default mongoose.model('Discovered', discoveredSchema);