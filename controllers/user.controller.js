const LastModel = require('../model/user.model');
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
require("dotenv").config()
secret = process.env.SECRET
const jwt = require("jsonwebtoken")





const generateUniqueNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000); 

    return `STUDENT/${currentYear}/${randomDigits}`;
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
                } else {
                    const token = jwt.sign({ matricNumber }, secret, { expiresIn: '1h' });
                    console.log("User signed in successfully");
                    res.send({ message: "User signed in successfully", status: true, user: student, token: token });
                }
            });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        });
};


const verifyToken = (req, res) => {
    console.log(req.body);
    const { token } = req.body;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
        } else {
            console.log(decoded);
            console.log('Token verified successfully');
            res.send({ message: "Token verified successfully", status: true, decoded: decoded, valid: true, token: token });
        }
    });
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPToEmail = (email, otp) => {
    return new Promise((resolve, reject) => {
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
            subject: 'Bestway forgotten pasword OTP',
            text: `Your one time password OTP is : ${otp}
This OTP is valid for 30 minutes. Please do not share this OTP with anyone.
            `
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

const forgotten = (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000);


    LastModel.findOneAndUpdate(
        { email },
        { otp, otpExpiration: expirationTime },
        { new: true, upsert: true }
    )
        .then((user) => {
            if (user) {
                sendOTPToEmail(email, otp)
                    .then(() => {
                        res.status(200).send({ message: 'OTP sent to email', status: true, otp: otp });
                    })
                    .catch((error) => {
                        res.status(500).json({ error: 'Failed to send OTP to email' });
                    });
            } else {
                console.log("user not found");
            }
        })
        .catch((err) => {
            res.status(500).json({ error: 'Database error' });
        });
}

const verifyOTP = (req, res) => {
    const { otp } = req.body;

    LastModel.findOne({ otp })
        .then((user) => {
            if (user.otp == otp && user.otpExpiration > new Date()) {

                res.status(200).json({ message: 'OTP verified successfully', status: true });
            } else {
                res.status(400).json({ message: 'invalid OTP', status: false });
            }

        })
        .catch((error) => {
            res.status(500).json({ error: 'Database error' });
        });
}



const createNewPassword = (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal Server Error" });
        }
        LastModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        )
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "User not found", status: false });
                } else {
                    res.status(200).send({ message: "Password updated successfully", status: true });
                }
            })
            .catch((error) => {
                console.error("Error updating password:", error);
                res.status(500).json({ message: "Internal Server Error" });
            });
    });
};



module.exports = { userRegister, userLogin, verifyToken, forgotten, verifyOTP, createNewPassword };
