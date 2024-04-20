import express from 'express';
import seedRouter from './routers/seedRouter.js';
import dbConfigs from './configs/connectDB.js';
import IP from 'ip';
import authRouter from './routers/auth.js';

const app = express();

// Connect to the database
await dbConfigs.connectDB(); 

app.use(express.json());
app.use("/seed", seedRouter);
app.use("",authRouter)

const server = app.listen(3000, () => {
    const ip = IP.address();
    const port = server.address().port;
    console.log(`Server is running on - http://${ip}:${port}`);
})

export default app;