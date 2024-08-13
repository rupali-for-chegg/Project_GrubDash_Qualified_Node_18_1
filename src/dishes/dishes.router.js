const express = require('express');
const router = express.Router();
const controller = require('./dishes.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

// Route for listing and creating dishes
router
    .route('/')
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

// Route for reading and updating a specific dish by ID
router
    .route('/:dishId')
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
