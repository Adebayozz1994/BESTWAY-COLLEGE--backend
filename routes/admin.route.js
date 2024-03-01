const express = require('express')
const router = express.Router()
const {adminRegister, adminLogin, verifyToken, forgotten, verifyOTP, createNewPassword} = require('../controllers/admin.controller')


router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogin)
router.post('/admin/verifyToken', verifyToken)
router.post('/admin/forgot', forgotten)
router.post('/admin/verifyotp', verifyOTP)
router.post('/admin/createnewpassword', createNewPassword)


module.exports = router 