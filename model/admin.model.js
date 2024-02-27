const mongoose = require('mongoose');
// const URI = process.env.URL
const URI = "mongodb+srv://Adebayozz:Peterzz1994@cluster0.72sjynx.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(URI)
.then((response)=>{
    console.log("Admin connected to database successfully");
})
.catch((err)=>{
    console.log(err);
    console.log("There is an error in the database");
})

let staffSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true, unique:true}
})

let adminModel = mongoose.model('adminModel', staffSchema);

module.exports = adminModel;