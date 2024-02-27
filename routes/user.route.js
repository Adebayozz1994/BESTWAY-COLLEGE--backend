const express = require('express')
const router = express.Router()
const {userRegister, userLogin, verifyToken} = require('../controllers/user.controller')


router.post('/user/register', userRegister)
router.post('/user/login', userLogin)
router.post('/user/verifyToken', verifyToken)

module.exports = router 