import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js'
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE } from "../config/emailTemplates.js";


//user Registration function
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({name , email, password:hashedPassword});
    await user.save();

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7*24*60*60*1000
    });

  // Sending Welcome Email
    var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to : email,
        subject : 'Welcome To BlogX',
       // text : `Welcome to BlogX , Your account has been created with email id: ${email} `
         html: WELCOME_TEMPLATE.replace(/{{email}}/g, user.email).replace(/{{username}}/g, user.name)

    }
         
        await transporter.sendMail(mailOptions);

        return res.json({success:true});

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// user Login Function
export const login = async (req, res)=>{
     const {email , password} = req.body;

     if(!email || !password){
        return res.json({success: false, message:'Email and Password are Required'})
     }

     try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid Email' })
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){

        return res.json({success: false, message: 'Invalid Password' })

        };

         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7*24*60*60*1000
    });

    return res.json({success:true});
        
        
     } catch (error) {
        return  res.json({success: false, message: error.message});
        
     }
};

// user LogOut function
export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7*24*60*60*1000
    })

    return res.json({success: true, message: "Logged Out"})

    } catch (error) {
         return res.json({success: false,  message: error.message});
    }
};

// send Verification OTP to the user Email
export const sendVerifyOtp = async (req,res)=>{

    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
          return res.json({success:false, message: "Account Already Verified"})
        }

        const otp = String(Math.floor(100000 + Math.random()* 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();
         console.log("Verification OTP :", user.verifyOtp); //Here is the Varification OTP
        //send Varification Email
        const mailOption = { 
          from: process.env.SENDER_EMAIL,
           to : user.email,
          subject : 'Account Verification OTP ',
          html: EMAIL_VERIFY_TEMPLATE.replace(/{{otp}}/g, otp).replace(/{{email}}/g, user.email).replace(/{{username}}/g, user.name)
        }

        await transporter.sendMail(mailOption);

        res.json({success:true , message: 'Varification OTP Sent On Email'});



    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// it varify the Email account
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!otp) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User Not Found' });
    }

     console.log("Stored OTP in DB:", user.verifyOtp); //OTP Which is Stored in DB

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' });
    }
    
    user.isAccountVerified = true; 
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    
    await user.save();
    return res.json({ success: true, message: 'Email Verified Successfully' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Check if user is Authenticated
export const isAuthenticated = async (req, res)=>{
  try {
    return res.json({success: true});
    
  } catch (error) {
    res.json({success: false, message: error.message});
  }

};

//Send Password Reset OTP
export const sendResetOtp = async (req, res)=>{

  const {email} = req.body;

  if(!email){
    return res.json({success: false, message: "Email is Required"})
  }

  try {

    const user = await userModel.findOne({email});

    if(!user){
     return res.json({success: false, message: "User Not Found"})
     
    }

    const otp = String(Math.floor(100000 + Math.random()* 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = { 
          from: process.env.SENDER_EMAIL,
           to : user.email,
        subject : 'Password Reset OTP',
          html: PASSWORD_RESET_TEMPLATE.replace(/{{email}}/g, user.email).replace(/{{username}}/g, user.name).replace(/{{otp}}/g, otp)
          
        }
 
         console.log("Reset OTP:", user.resetOtp); // Here is The Reset OTP 

        await transporter.sendMail(mailOption);

        return res.json({success:true, message: "OTP send to Your Email"})
 
  } catch (error) {
    return res.json({success: false, error: error.message})
  }

};

//Reset User Password

export const resetPassword = async (req, res)=>{

    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:true, message: "Email, OTP and New Password are Required"})

    }

    try {

      const user = await userModel.findOne({email});
      if(!user){
        return res.json({success:true, message: "User Not Found"})
       
      }

      if(user.resetOtp === '' || user.resetOtp !== otp){
         return res.json({success:false , message: "Invalid OTP"})
       
      }

      if(user.resetOtpExpireAt < Date.now()){
         return res.json({success:false , message: "OTP Expired"})
       
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetOtp = '';
      user.resetOtpExpireAt = 0;

      await user.save();

       return res.json({success:true , message: "Password has been reset Successfully "})

      
    } catch (error) {
       return res.json({success:true, message: error.message})

    }
};

