const express = require('express')
const router = express()

const {createComment, deleteComment, likeComment} = require('../controllers/Comment_C')

router.route('/:tid').post(createComment)
router.route('/:cid').patch(likeComment).delete(deleteComment)

module.exports = router