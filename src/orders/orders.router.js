const express = require('express');
const router = express.Router();
const controller = require('./orders.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

// Route for listing and creating orders
router
    .route('/')
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

// Route for reading, updating, and deleting a specific order by ID
router
    .route('/:orderId')
    .get(controller.read)
    .put(controller.update)
    .delete(controller.destroy) // Use controller.destroy instead of controller.remove
    .all(methodNotAllowed);

module.exports = router;
