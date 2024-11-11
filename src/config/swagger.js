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
    },
    apis: ['../routes/v1/*.js', '../routes/v2/*.js'], // Update the path here
  };
  
  module.exports = { swaggerOptions };
  