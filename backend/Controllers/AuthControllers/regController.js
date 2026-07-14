const userModel = require("../../Model/userModel");
const otpModel = require("../../Model/otpModel");
const transporter = require("../../config/emailConfig");
const emailSender = require("../../Utils/emailSender");
const { regToken } = require("../../Utils/TokenGenerator");
const decodeToken = require("../../Utils/decodeToken");
const bcrypt = require("bcrypt");


async function verifyEmail(req, res) {
    try {
        let body = req.body;
        if(!body.email){
            return res.status(400).json({
                message:"Email is required"
            })
        }
        let user = await userModel.findOne({email:body.email})
        if(user){
            return res.status(403).json({
                message:"User already exists"
            })

        }
         let existingOtp = await otpModel.findOne({ email: body.email })

        if (existingOtp) {
            return res.status(404).json({
                message: "otp is already sent"

            })
        }
        let info = await emailSender( body)


        if (!info) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        let setOtp = await otpModel.create({
            otp: info.otp,
            email : body.email
        })

        if (!setOtp) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        res.status(200).json({
            message:"otp sent successfully",
            
        })


    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

async function verifyOtp(req, res) {
    try {

    
        let body = req.body;
        if (!body.otp) {
            return res.status(400).json({
                message: "OTP is required"
            });
        }

        const deletedOtp = await otpModel.findOneAndDelete({ otp: body.otp });

        if (!deletedOtp) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

         // Pass only the email string to regToken, not an object.
         let token = regToken(deletedOtp.email);

         if(!token){
            return res.status(400).json({
                message:"Something went wrong"
            })
         }


        res.status(200).json({
            message: "OTP verified successfully",
            token:token

        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}



async function regController(req, res) {
    try {
        const { name, password, phone } = req.body;
        let head = req.headers.authorization;
        if (!head || !head.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token is missing or invalid"
            });
        }
        let token = head.split(" ")[1];
        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({
                message: "Session token is invalid. Please verify your email again."
            });
        }

        let decoded = decodeToken(token, res);
        if (res.headersSent) return;

        if (!name  || !password || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let userToProcess = await userModel.create({
            name: name,
            email: decoded.email, // Use the verified email from the token
            password: hashedPassword,
            phone: phone,
            isVerified: true // User is verified upon successful registration
        });

        if (!userToProcess) {
            return res.status(400).json({
                message: "Something went wrong during user creation"
            });
        }

        res.status(200).json({
            message: "User registered successfully",
            
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}



module.exports = { regController, verifyOtp,verifyEmail };
