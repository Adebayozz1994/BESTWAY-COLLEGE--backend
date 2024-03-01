const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const URI = process.env.URL
const URI = "mongodb+srv://ogunladeadebayopeter:Peterzz1994@cluster0.pk4j5fd.mongodb.net/bestway?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(URI)
.then((response)=>{
    console.log("admin connected to database successfully");
})
.catch((err)=>{
    console.log(err);
    console.log("There is an error in the database");
})

let adminSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true,},
    adminId: { type: String, unique: true },
    otp:{type: String, unique: true},
    otpExpiration: {
      type: Date
    }
})

adminSchema.pre("save", function(next){
    bcrypt.hash(this.password, 10, ((err, hash)=>{
      console.log(hash);
      this.password = hash
      next()
    }))
  })

let FirstModel = mongoose.model('FirstModel', adminSchema);

module.exports = FirstModel;