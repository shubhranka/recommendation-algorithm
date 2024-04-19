// Connect to the database
import { connect } from 'mongoose';
await connect(process.env.MONGODB_CONNECTION_STRING)

console.log('Connected to the database');