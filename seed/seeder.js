// Seed the database
import { User,
    Event,
    Sport,
    Post,
    Comment,
    Like } from './models/index.js';

const users = [
new User({ username: 'user1', password: 'password1' }),
new User({ username: 'user2', password: 'password2' }),
new User({ username: 'user3', password: 'password3' })
];

const sports = [
new Sport({ name: 'Soccer' }),
new Sport({ name: 'Basketball' }),
new Sport({ name: 'Tennis' })
];

const events = [
new Event({ name: 'Event1', sport: sports[0] }),
new Event({ name: 'Event2', sport: sports[1] }),
new Event({ name: 'Event3', sport: sports[2] })
];

const posts = [
new Post({ title: 'Post1', user: users[0], sport: sports[0], event: events[0] }),
new Post({ title: 'Post2', user: users[1], sport: sports[1], event: events[1] }),
new Post({ title: 'Post3', user: users[2], sport: sports[2], event: events[2] })
];

const comments = [
new Comment({ user: users[0], post: posts[0], content: 'Comment1' }),
new Comment({ user: users[1], post: posts[1], content: 'Comment2'}),
new Comment({ user: users[2], post: posts[2], content: 'Comment3'})
];

const likes = [
new Like({ user: users[0], post: posts[0] }),
new Like({ user: users[1], post: posts[1] }),
new Like({ user: users[2], post: posts[2] })
];

await User.insertMany(users);
await Sport.insertMany(sports);
await Event.insertMany(events);
await Post.insertMany(posts);
await Comment.insertMany(comments);
await Like.insertMany(likes);

console.log('Seeded the database');