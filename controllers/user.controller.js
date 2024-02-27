const LastModel = require('../model/user.model');
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
require("dotenv").config()
secret = process.env.SECRET
const jwt = require("jsonwebtoken")





const generateUniqueNumber = () => {
    const currentYear = new Date().getFullYear().toString();
    const randomNumber = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    const randomAlphabets = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const matricNumber = currentYear + randomNumber + randomAlphabets;

    return matricNumber;
}



const userRegister = (req, res) => {
    console.log(req.body);
    const matricNumber = generateUniqueNumber();
    const student = new LastModel(req.body);
    const { email } = req.body
    student.matricNumber = matricNumber;
    sendUniqueNumberToEmail(email, matricNumber)
    student.save()
        .then(() => {
            console.log("User saved successfully");
            res.status(201).send({ message: "User registered successfully", status: 200 });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
};


function sendUniqueNumberToEmail(email, matricNumber) {
    return new Promise((resolve, reject) => {
        // Example implementation using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ogunladeadebayopeter@gmail.com',
                pass: 'osqw clph ssqu jvxd'
            }
        });

        const mailOptions = {
            from: 'ogunladeadebayopeter@gmail.com',
            to: email,
            subject: 'Bestway',
            text: `Your unique number is: ${matricNumber}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}


const userLogin = (req, res) => {
    const { matricNumber, password } = req.body;

    LastModel.findOne({ matricNumber })
        .then((student) => {
            if (!student) {
                console.log("User not found");
                return res.status(404).json({ message: "User not found" });
            }

            bcrypt.compare(password, student.password, (err, match) => {
                if (err) {
                    console.log("Error comparing passwords:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                if (!match) {
                    console.log("Incorrect password");
                    return res.status(401).json({ message: "Incorrect password" });
                }else{
                    const token = jwt.sign({ matricNumber }, secret, { expiresIn: '1h' });
                    console.log("User signed in successfully");
                    res.send({ message: "User signed in successfully", status: true, user: student, token:token});
                }
            });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        });
};


const verifyToken = (req, res)=>{
    console.log(req.body);
    const { token } = req.body;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
      } else {
        console.log(decoded);
        console.log('Token verified successfully');
        res.send({ message: "Token verified successfully", status: true, decoded: decoded, valid:true, token:token });
      }
    });
  }

module.exports = { userRegister, userLogin, verifyToken};
