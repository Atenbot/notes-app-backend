require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/database");
const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch(console.error);
