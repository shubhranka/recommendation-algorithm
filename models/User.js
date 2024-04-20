import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    interests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sport'
        }
    ]
});

export default mongoose.model('User', userSchema);
