const swaggerJsDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare API',
      version: '1.0.0',
      description: 'API for managing healthcare appointments',
      contact: {
        name: 'Support Team',
        url: 'http://BookMyDoc.com',
        email: process.env.EMAIL,
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./routes/v1/*.js', './routes/v2/*.js'], // Path to the API docs
};
console.log(`${process.env.PORT_FRONTEND}`);
module.exports = { swaggerOptions };
