const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/test:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

module.exports = router;
