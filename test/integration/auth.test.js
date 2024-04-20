import request from "supertest";
import app from "../../index.js";
import User from "../../models/User.js";
import { hashSync } from 'bcrypt';
import {assert} from "chai";


describe("Auth Test", () => {

    before(async () => {
        const hashedPassword = hashSync('password',10);
        const user = new User({
            username:"testuser",
            password: hashedPassword
        })
        await user.save();
    });


    it("should return 200 when user is authenticated", async () => {
        const response = await request(app)
            .post("/auth")
            .send({
                username: "testuser",
                password: "password"
            });

        assert.equal(response.status, 200);
    });;

    it("should return 401 when user is not authenticated", async () => {
        const response = await request(app)
            .post("/auth")
            .send({
                username: "testuser",
                password: "wrongpassword"
            });

        assert.equal(response.status, 401);
    });

    after(async () => {
        await User.deleteMany({});
    });
});