import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = await MongoMemoryServer.create();
process.env.MONGODB_CONNECTION_STRING = mongod.getUri();
process.env.JWT_SECRET="testsecret";
console.log("MONGO_URI",process.env.MONGODB_CONNECTION_STRING);

export default mongod;