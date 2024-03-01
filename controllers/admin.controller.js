const FirstModel = require('../model/admin.model');
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
require("dotenv").config()
secret = process.env.SECRET
const jwt = require("jsonwebtoken")





const generateUniqueNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    return `STAFF/${currentYear}/${randomDigits}`;
}




const adminRegister = (req, res) => {
    console.log(req.body);
    const adminId = generateUniqueNumber();
    const staff = new FirstModel(req.body);
    const { email } = req.body
    staff.adminId = adminId;
    sendUniqueNumberToEmail(email, adminId)
    staff.save()
        .then(() => {
            console.log("admin saved successfully");
            res.status(201).send({ message: "admin registered successfully", status: 200 });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
};


function sendUniqueNumberToEmail(email, adminId) {
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
            text: `Your unique number is: ${adminId}`
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


const adminLogin = (req, res) => {
    const { adminId, password } = req.body;

    FirstModel.findOne({ adminId })
        .then((staff) => {
            if (!staff) {
                console.log("admin not found");
                return res.status(404).json({ message: "admin not found" });
            }

            bcrypt.compare(password, staff.password, (err, match) => {
                if (err) {
                    console.log("Error comparing passwords:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                if (!match) {
                    console.log("Incorrect password");
                    return res.status(401).json({ message: "Incorrect password" });
                }else{
                    const token = jwt.sign({ adminId }, secret, { expiresIn: '1h' });
                    console.log("admin signed in successfully");
                    res.send({ message: "admin signed in successfully", status: true, admin: staff, token:token});
                }
            });
        })
        .catch((error) => {
            console.error("Error finding admin:", error);
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


    FirstModel.findOneAndUpdate(
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
                console.log("admin not found");
            }
        })
        .catch((err) => {
            res.status(500).json({ error: 'Database error' });
        });
}

const verifyOTP = (req, res) => {
    const { otp } = req.body;

    FirstModel.findOne({ otp })
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
        FirstModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        )
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "admin not found", status: false });
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

module.exports = { adminRegister, adminLogin, verifyToken, forgotten, verifyOTP, createNewPassword};
