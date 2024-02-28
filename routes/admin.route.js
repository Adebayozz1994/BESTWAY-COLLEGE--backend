const express = require('express')
const router = express.Router()
const {adminRegister, adminLogin, verifyToken} = require('../controllers/admin.controller')


router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogin)
router.post('/admin/verifyToken', verifyToken)

module.exports = router 