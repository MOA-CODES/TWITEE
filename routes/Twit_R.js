const express = require('express');
const router = express.Router();

const {createTwit, deleteTwit, likeTwit} = require('../controllers/Twit_C')

router.route('/').post(createTwit)
router.route('/:id').patch(likeTwit).delete(deleteTwit)

module.exports = router