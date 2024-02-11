import mongoose from "mongoose";
const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGODB_CONNECTION);
    // console.log(`MongoDB Connected: ${connected.connection.host}`);
  } catch (error) {
    // console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;

// pwd
// GUA5qPmI5yQNwOE9
