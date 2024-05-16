import User from "../Models/UserModel.js";
import * as EmailUtils from "../utils/EmailUtils.js";
import generateToken from "../utils/generateToken.js";

// Generate and save OTP
const generateAndSaveOTP = async function (user) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;

  const now = new Date();
  user.otpExpires = new Date(now.getTime() + 60 * 60000);

  await user.save();
  return otp;
};

export async function verifyUserAndSendMail(email) {
  const user = await User.findOne({ email });

  if (user) {
    const generatedOTP = await generateAndSaveOTP(user);

    const subject = "OTP for Login";
    const message = `Your OTP for login is: ${generatedOTP}.`;

    try {
      await EmailUtils.sendEmail({
        email: user.email,
        subject,
        message,
      });

      return {
        status: 200,
        data: {
          success: true,
          message: `OTP sent to ${user.email}`,
        },
      };
    } catch (error) {
      console.log("Error sending mail");
      console.error("Error sending email:", error.message);
      return {
        status: 500,
        data: {
          success: false,
          message: "Error sending OTP email. Retry Login.",
        },
      };
    }
  } else {
    return {
      status: 401,
      data: {
        success: false,
        message:
          "Email id  does not exist.",
      },
    };
  }
}

export async function verifyOTPForUser(email, enteredOTP) {
  const user = await User.findOne({ email });
 
  if (user) {
    if (
      user.otp &&
      user.otpExpires &&
      user.otp == enteredOTP &&
      user.otpExpires > new Date()
    ) {
      const token = generateToken(user._id);
      user.otp = null;
      user.otpExpires = null;
      user.save();
      
      return {
        status: 200,
        data: {
          success: true,
          userId: user._id,
          email: user.email,
          name: user.name,
          joined: user.created_at,
          isAdmin: user.isAdmin,
          token,
        },
      };
    } else if (user.otp && user.otpExpires && user.otpExpires < new Date()) {
      return {
        status: 401,
        data: {
          success: false,
          message: "OTP Expired.",
        },
      };
    } else {
      return {
        status: 401,
        data: {
          success: false,
          message: "Invalid OTP",
        },
      };
    }
  } else {
    return {
      status: 401,
      data: {
        success: false,
        message: "User not found",
      },
    };
  }
}

export async function getUser(id){
  const customer = await User.findById(id);

    if (customer) {
      return {
        status: 200,
        data: {
        _id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        mobile: customer.phone,
        isAdmin: customer.isAdmin,
        createdAt: customer.createdAt,
        orders_count: customer.orders_count,
        total_spent: customer.total_spent,
        bank_details_obtained: customer.bank_details_obtained,
        referral_count: customer.referral_count,
        referral_earned_value: customer.referral_earned_value, 
        referral_processed_value: customer.referral_processed_value,
        bank_details: customer.bank_details,
        success: true,
      }
    };
    } else {
      return {
        status: 404,
        data: {
          success: false,
          message: "User not found"
        }
    }
  }
}

export async function registerUserAndSendOTP(name, email, mobile) {
  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return {
      status: 409,
      data: {
        success: false,
        message: "User already exists.",
      },
    };
  }

  // Create a new user
  const newUser = new User({
    name,
    email,
    mobile
    
  });

  // Save the new user to the database
  try {
    await newUser.save();
  } catch (error) {
    console.error("Error creating user:", error.message);
    return {
      status: 500,
      data: {
        success: false,
        message: "Error creating user. Please try again.",
      },
    };
  }

  // Generate and save OTP
  const generatedOTP = await generateAndSaveOTP(newUser);

  // Send OTP email
  const subject = "OTP for Registration";
  const message = `Your OTP for registration is: ${generatedOTP}.`;

  try {
    console.log(email)
    await EmailUtils.sendEmail({
     email: email,
      subject,
      message,
    });

    return {
      status: 200,
      data: {
        success: true,
        message: `OTP sent to ${email} for registration.`,
      },
    };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return {
      status: 500,
      data: {
        success: false,
        message: "Error sending OTP email for registration. Please try again.",
      },
    };
  }
}