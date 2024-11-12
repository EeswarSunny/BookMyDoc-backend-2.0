const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/test", (req, res) => {
    res.send("Test endpoint works!");
  });
  
  module.exports = router;
  
