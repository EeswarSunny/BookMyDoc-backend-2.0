const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/mongo");
const { swaggerOptions } = require("./config/swagger"); 
const routesV1 = require("./routes/v1");
const path = require("path");
const logger = require("./utils/logger");
const morgan = require("morgan");
const helmet = require("helmet");  // for secure HTTP headers
const Joi = require('joi');
const { isAuthenticated } = require("./middleware/authMiddleware");
const errorHandler = require("./utils/errorHandler");
const morganFormat = ":method :url :status :response-time ms";
// Load environment variables
dotenv.config();
const envSchema = Joi.object({
    PORT: Joi.number().required(),
    MONGO_URI_LOCAL: Joi.string().uri().required(),
    EMAIL: Joi.string().email().required(),
    PORT_FRONTEND: Joi.number().required()
}).unknown().required();

const { error } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Environment variable validation error: ${error.message}`);
}

// Initialize app
const app = express();

// Middleware
app.use(helmet()); 
app.use(express.json({ limit: '300kb' }));
app.use(isAuthenticated);
app.use(express.urlencoded({ extended: true }));

// Improved CORS with regex pattern for production
const corsOptions = {
    origin: new RegExp(`^http://localhost:${process.env.PORT_FRONTEND}$`), // Development regex
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    
                    url: message.split(" ")[1],
                    
                    status: message.split(" ")[2],
                    
                    responseTime: message.split(" ")[3],
        };
        
        logger.info(JSON.stringify(logObject));
    },
},
})
);

// Connect to MongoDB
connectDB();

// Swagger docs setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api/v1", routesV1);

// Centralized error handling middleware for API route errors
app.use(async (err, req, res) => {
    try {
      logger.error(err.stack);
      await errorHandler.handleError(err, res);
    } catch (handlerError) {
      logger.error("Error in error handler:", handlerError);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later. Internal Server Error",
      });
    }
  });

// Global error handling for uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception:", error);
    errorHandler.handleError(error);  // Handle uncaught errors gracefully
    process.exit(1);
  });
  
//  empty JSON body to all POST requests results in crash
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled rejection:", reason);
    errorHandler.handleError(reason);  // Handle unhandled promise rejections
    process.exit(1);
});

// Start the server
const server = app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    server.close(() => {
        logger.info("Server closed");
        process.exit(0);
    });
});
