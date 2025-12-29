import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    // If the database is already connected, don't connect again
    if (connected) {
        console.log('Mongodb is already connected...');
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
        console.log('Mongodb connected...');
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;