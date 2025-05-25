import mongoose from "mongoose"

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}Brainly`);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // Stop the server
  }
}

export default dbConnect;
