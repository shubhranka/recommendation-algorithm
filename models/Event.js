import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport'
    },
});

export default mongoose.model('Event', eventSchema);