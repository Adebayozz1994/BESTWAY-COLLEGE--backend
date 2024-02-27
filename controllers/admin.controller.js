const adminModel = require('../model/admin.model')


const adminRegister = (req, res) =>{
    let staff = new adminModel(req.body)
    staff.save()
    .then((result)=>{
        console.log("admin info saved successfully");
    }).catch((err)=>{
        console.log("There is an error in the database");
    })
}

const adminLogin = (req, res) =>{
    const {email, password} = req.body
    console.log(req.body);
}

module.exports = {adminRegister, adminLogin}