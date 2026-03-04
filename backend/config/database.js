import mongoose from "mongoose";

let cached = global._mongooseCache;
if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

const databaseConnection = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => {
            console.log("Connected to mongoDB");
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};

export default databaseConnection;