import express from 'express';
import seedRouter from './routers/seedRouter.js';
import connectDB from './configs/connectDB.js';
import IP from 'ip';

const app = express();

// Connect to the database
await connectDB();


app.use("/seed", seedRouter);

const server = app.listen(3000, () => {

    const ip = IP.address();
    const port = server.address().port;
    console.log(`Server is running on - http://${ip}:${port}`);
})