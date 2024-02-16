const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const uri = "mongodb+srv://Adebayozz:Peterzz1994@cluster0.72sjynx.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri)
.then((response)=>{
    console.log("connected to database successfully");
})
.catch((err)=>{
    console.log(err);
    console.log("There is an error in the database");
})

let studentSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true, unique:true}
})

studentSchema.pre("save", function(next){
    bcrypt.hash (this.password, 10, (err, hash)=>{
        console.log(hash);
        this.password = hash;
        next();
    })
})

let Student = mongoose.model("Student", studentSchema)

module.exports = Student