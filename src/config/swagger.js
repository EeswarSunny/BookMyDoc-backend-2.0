const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Healthcare API",
      version: "1.0.0",
      description: "API for managing healthcare appointments",
      contact: {
        name: "Support Team",
        url: "http://BookMyDoc.com",
        email: process.env.EMAIL,
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    security: [
        {
          BearerAuth: [],  // Global application of Bearer authentication
        },
    ],
  },
  apis: [
    path.resolve(__dirname, "../routes/v1/*.js"),
    path.resolve(__dirname, "../routes/v2/*.js"),
  ],
};

module.exports = { swaggerOptions };
