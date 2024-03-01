const express = require('express')
const router = express.Router()
const {userRegister, userLogin, verifyToken,forgotten, verifyOTP, createNewPassword} = require('../controllers/user.controller')


router.post('/user/register', userRegister)
router.post('/user/login', userLogin)
router.post('/user/verifyToken', verifyToken)
router.post('/user/forgot', forgotten)
router.post('/user/verifyotp', verifyOTP)
router.post('/user/createnewpassword', createNewPassword)

module.exports = router 