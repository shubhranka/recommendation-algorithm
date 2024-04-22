import express from 'express';
import seedRouter from './routers/seedRouter.js';
import {connectDB} from './configs/connectDB.js';
import IP from 'ip';
import authRouter from './routers/auth.js';
import recommendationRouter from './routers/recommendationRouter.js';
import { connectRedis } from './configs/connectRedis.js';

const app = express();

// Connect to the database
await connectDB(); 
await connectRedis();

app.use(express.json());
app.use("/seed", seedRouter);
app.use("",authRouter)


app.use("/api/recommendations",recommendationRouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

const server = app.listen(3000, () => {
    const ip = IP.address();
    const port = server.address().port;
    console.log(`Server is running on - http://${ip}:${port}`);
})


export default app;