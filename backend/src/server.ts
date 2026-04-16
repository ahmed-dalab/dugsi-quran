import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(Number(env.PORT), () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();