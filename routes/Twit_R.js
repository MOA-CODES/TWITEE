const express = require('express');
const router = express.Router();

const {createTwit, deleteTwit, likeTwit, getMyTwits, getTwit} = require('../controllers/Twit_C')
const {getTwitComments} = require('../controllers/Comment_C')


router.route('/').post(createTwit).get(getMyTwits)
router.route('/comment/:id').get(getTwitComments)
router.route('/:id').patch(likeTwit).delete(deleteTwit).get(getTwit)

module.exports = router