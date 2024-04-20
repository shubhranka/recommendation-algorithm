// Seed the database
import { User,
    Event,
    Sport,
    Post,
    Comment,
    Like,
    Follows } from '../models/index.js';

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

        const post = new Post({
            title: faker.random.words(),
            user: users[randomUserIndex]._id,
            sport: sports[randomSportIndex]._id,
            event: eventForSport[randomEventIndex]?._id,
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
