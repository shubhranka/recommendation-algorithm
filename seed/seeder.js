// Seed the database
import { User,
    Event,
    Sport,
    Post,
    Comment,
    Like,
    Follows,
    PostData } from '../models/index.js';

import faker from 'faker';
import bcrypt from 'bcrypt';

// Random sports
const randomSports = [
    'Soccer',
    'Basketball',
    'Football',
    'Baseball',
    'Volleyball',
    'Tennis',
    'Golf',
    'Hockey',
    'Boxing',
    'MMA'
]

// Random Images URL
const randomImagesURL = [
    'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1681843294664-e15581e2d41f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1541704328070-20bf4601ae3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

]

const seedDatabase = async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
    await Sport.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Follows.deleteMany({});

    const totalUsers = 20;
    const totalFollows = 40;
    const totalSports = randomSports.length;
    const totalEvents = 5;
    const totalPosts = 40;
    const totalComments = 70;
    const totalLikes = 100;

    const users = [];
    const events = [];
    const sports = [];
    const posts = [];
    const comments = [];
    const likes = [];
    const follows = [];
    const decrptedUsers = [];
    
    for (let i = 0; i < totalUsers; i++) {
        const  password = faker.internet.password();
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            username: faker.internet.userName(),
            password: hashedPassword
        });
        users.push(user);
        decrptedUsers.push({
            username: user.username,
            password: password
        });

    }

    for (let i = 0; i < totalSports; i++) {
        const sport = new Sport({
            name: randomSports[i]
        });
        sports.push(sport);
    }

    for (let i = 0; i < totalEvents; i++) {
        const randomSportIndex = Math.floor(Math.random() * totalSports);
        const event = new Event({
            name: faker.random.words(),
            sport: sports[randomSportIndex]._id
        });
        events.push(event);
    }

    for (let i = 0; i < totalPosts; i++) {

        const randomUserIndex = Math.floor(Math.random() * totalUsers);
        const randomSportIndex = Math.floor(Math.random() * totalSports);
        const sport = sports[randomSportIndex];
        const eventForSport = events.filter(event => event.sport.equals(sport._id));
        const randomEventIndex = Math.floor(Math.random() * (eventForSport.length-1));
        const postData = new PostData({
            image: randomImagesURL[Math.floor(Math.random() * randomImagesURL.length)],
            description: faker.random.words()
        });
        await postData.save();

        const post = new Post({
            title: faker.random.words(),
            user: users[randomUserIndex]._id,
            sport: sports[randomSportIndex]._id,
            event: eventForSport[randomEventIndex]?._id,
            postData
        });
        posts.push(post);
    }

    for (let i = 0; i < totalComments; i++) {
        const randomUserIndex = Math.floor(Math.random() * totalUsers);
        const randomPostIndex = Math.floor(Math.random() * totalPosts);
        const post = posts[randomPostIndex];
        post.comments++;
        post.popularityScore += 2;
        const comment = new Comment({
            user: users[randomUserIndex]._id,
            post: posts[randomPostIndex]._id,
            content: faker.random.words()
        });
        comments.push(comment);
    }

    for (let i = 0; i < totalLikes; i++) {
        const randomUserIndex = Math.floor(Math.random() * totalUsers);
        const randomPostIndex = Math.floor(Math.random() * totalPosts);
        const post = posts[randomPostIndex];
        post.likes++;
        post.popularityScore++;
        const like = new Like({
            user: users[randomUserIndex]._id,
            post: posts[randomPostIndex]._id
        });
        likes.push(like);
    }

    for (let i = 0; i < totalFollows; i++) {
        const randomUserIndex = Math.floor(Math.random() * totalUsers);
        const randomUserIndex2 = Math.floor(Math.random() * totalUsers);
        if(randomUserIndex === randomUserIndex2) {
            i--;
            continue;
        }
        const follow = new Follows({
            follower: users[randomUserIndex]._id,
            followee: users[randomUserIndex2]._id
        });
        follows.push(follow);
    }

    await User.insertMany(users);
    await Sport.insertMany(sports);
    await Event.insertMany(events);
    await Post.insertMany(posts);
    await Comment.insertMany(comments);
    await Like.insertMany(likes);
    await Follows.insertMany(follows);
    
    return decrptedUsers;
};

export default seedDatabase;
