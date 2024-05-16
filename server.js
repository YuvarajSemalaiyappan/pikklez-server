import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
// import categoryRouter from  "./Routes/categoryRoute.js";
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDatabase();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define server URL
const PORT = process.env.PORT || 1000;


// Routes
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRouter);
// app.use("/api/categories", categoryRouter);


// PayPal configuration endpoint
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit the application if needed
  // process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optionally exit the application if needed
  // process.exit(1);
});

export default server;



// import express from "express";
// import dotenv from "dotenv";
// import connectDatabase from "./config/MongoDb.js";
// import ImportData from "./DataImport.js";
// import productRoute from "./Routes/ProductRoutes.js";
// import { errorHandler, notFound } from "./Middleware/Errors.js";
// import userRouter from "./Routes/UserRoutes.js";
// import orderRouter from "./Routes/orderRoutes.js";
// import cors from 'cors';

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// // const { createProxyMiddleware } = require('http-proxy-middleware');



// dotenv.config();
// connectDatabase();
// const app = express();
// app.use(express.json());
// app.use(cors());

// // app.use(
// //   '/api',
// //   createProxyMiddleware({
// //     target: 'https://pikklez-server.onrender.com',
// //     changeOrigin: true,
// //   })
// // );


// // API
// app.use("/api/import", ImportData);
// app.use("/api/products", productRoute);
// app.use("/api/user", userRouter);
// app.use("/api/orders", orderRouter);
// app.get("/api/config/paypal", (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID);
// });

// // ERROR HANDLER
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 1000;

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   // Optionally exit the application if needed
//   // process.exit(1);
// });

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   // Optionally exit the application if needed
//   // process.exit(1);
// });

// app.listen(PORT, console.log(`server run in port ${PORT}`));
