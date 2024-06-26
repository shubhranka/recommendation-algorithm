import mongoose from 'mongoose';


export const connectDB = async () => {
    console.log('Trying to connect to the database');
    const intervalLog = setInterval(() => {
        process.stdout.write('.');
    }, 500);
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    clearInterval(intervalLog);
    console.log('OK \nConnected to the database');
}