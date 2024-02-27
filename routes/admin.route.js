const express = require('express')
const adminRouter = express.Router()
const {adminRegister, adminLogin} = require('../controllers/admin.controller')


adminRouter.post('/admin/register', adminRegister)
adminRouter.post('/admin/login', adminLogin)

module.exports = adminRouter