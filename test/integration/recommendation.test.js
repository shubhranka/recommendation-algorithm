import { hashSync } from "bcrypt";
import Follows from "../../models/Follows.js";
import Post from "../../models/Post.js";
import PostData from "../../models/PostData.js";
import User from "../../models/User.js";
import Sport from "../../models/Sport.js";
import request from "supertest";
import app from "../../index.js";
import { assert } from "chai";

describe('Recommendation Test', () => {
    before(async () => {
        const hashedPassword = hashSync('password',10);
        const user = new User({
            username:"testuser",
            password: hashedPassword
        })
        await user.save();

        // Create a post data
        const postData = new PostData({
            image: "image.jpg",
            description: "Test Description"
        });
        await postData.save();

        // Create a sport
        const sport = new Sport({
            name: "Football"
        });
        await sport.save();

        // Create a post
        const post = new Post({
            title: "Test Post",
            sport: sport._id,
            user: user._id,
            popularityScore: 10,
            postData: postData._id
        });
        await post.save();

        // create another user
        const user2 = new User({
            username:"testuser2",
            password: hashedPassword
        })
        await user2.save();

        // Create a post
        const post2 = new Post({
            title: "Test Post 2",
            sport: sport._id,
            user: user2._id,
            popularityScore: 20,
            postData: postData._id
        });
        await post2.save();

        // Follow user2
        const follow = new Follows({
            follower: user._id,
            followee: user2._id
        });
        await follow.save();
    });

    it('should return 200 with posts', async () => {

        // Get token
        const tokenresponse = await request(app)
            .post("/auth")
            .send({
                username: "testuser",
                password: "password"
            });
        const token = tokenresponse.body.token;
        
        const response = await request(app)
            .get("/api/recommendations/posts")
            .set('Authorization', `${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.length, 1);
    });

    it('should return 401 when token is not provided', async () => {
        const response = await request(app)
            .get("/api/recommendations/posts");

        assert.equal(response.status, 401);
    });

    it('should return no post for user2', async () => {
        // Get token
        const tokenresponse = await request(app)
            .post("/auth")
            .send({
                username: "testuser2",
                password: "password"
            });
        const token = tokenresponse.body.token;
        
        const response = await request(app)
            .get("/api/recommendations/posts")
            .set('Authorization', `${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.length, 0);
    })
});