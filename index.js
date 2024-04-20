import { connect } from 'mongoose';

// Connect to the database
await connect(process.env.MONGODB_CONNECTION_STRING)
console.log('Connected to the database');


