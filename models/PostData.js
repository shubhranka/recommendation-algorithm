import mongoose from "mongoose";

const PostDataSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export default mongoose.model("PostData", PostDataSchema);
