const express = require('express')
const router = express()

const {createComment, deleteComment, likeComment, getMycomments, getComment} = require('../controllers/Comment_C')

router.route('/').get(getMycomments)
router.route('/:tid').post(createComment)
router.route('/:cid').patch(likeComment).delete(deleteComment).get(getComment)

module.exports = router