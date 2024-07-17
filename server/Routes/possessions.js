const express = require('express');
const router = express.Router();
const possessionsController = require('../Controllers/possessionsController');

router.get('/', possessionsController.getAllPossessions);
router.post('/', possessionsController.createPossession);
router.put('/:id', possessionsController.updatePossession);
router.delete('/:id', possessionsController.deletePossession);

module.exports = router;
