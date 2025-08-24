import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

export async function connect() {
  try {
    // Check if we have a connection to the database or if it's currently connecting
    if (connection.isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }

    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;
      if (connection.isConnected === 1) {
        console.log("Use previous connection to MongoDB");
        return;
      }
      await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGO_URI!);
    connection.isConnected = db.connections[0].readyState;

    const connectionInstance = mongoose.connection;

    connectionInstance.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connectionInstance.on("error", (err) => {
      console.log("MongoDB connection error: " + err);
      process.exit(1);
    });
  } catch (error) {
    console.log("Something went wrong while connecting to MongoDB");
    console.log(error);
    process.exit(1);
  }
}
