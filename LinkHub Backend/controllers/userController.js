const expressAsyncHandler = require("express-async-handler");
const redis = require("../config/redis");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const BasicDetails = require("../models/basicDetailsModel");
const Link = require("../models/linksModel");
const Visit = require("../models/visitModel");
const Subscriber = require("../models/subscriberModel");
const OTPVerification = require("../models/otpVerificationModel");
const generateToken = require("../config/generateToken");

dotenv.config();

// Update Redis with the updated data
const updateRedis = expressAsyncHandler(async (username) => {
  const profilePic = await User.findOne({ username: username }).select(
    "profilePic"
  );
  const hub = await Visit.findOne({ username: username });
  const basicLinks = await BasicDetails.find({ username: username }).sort({
    createdAt: 1,
  });
  const links = await Link.find({ username: username }).sort({
    createdAt: 1,
  });
  if (hub) {
    // res.status(200).json({ hub: hub, basicLinks: basicLinks, links: links });
    data = {
      username: username,
      profilePic: profilePic,
      hub: hub,
      basicLinks: basicLinks,
      links: links,
    };

    await redis.set(username, JSON.stringify(data)); // Converting the javascript object to string using stringify and storing it in Redis using the key of username(Format of storing: username(key) --> data(data))
    await redis.expire(username, 3600); // Storing(caching) the data to Redis and setting expiry time to 1 hour(3600 seconds)
  }
});

// This function sends verification mail to unverified users
const sendMail = (client) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const token = jwt.sign(
    {
      data: client.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Email</title>
  </head>
  <body>
    <div
      style="
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background-color: rgba(229, 241, 248, 0.954);
        text-align: center;
        padding: 1rem;
        font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
      "
    >
      <img
        src="https://res.cloudinary.com/dor2rxkrs/image/upload/v1704310218/LinkHub%20Media/LinkHub_Wide-removebg-preview_nhcp7y.png"
        style="width: 18rem; height: 8rem"
      />
      <div style="font-size: 1.2rem">Hi ${client.username},</div>
      <br />
      <div style="font-size: 1.2rem">
        Thanks for signing up to LinkHub, great to have you!
        <br />
        <br />
        Please verify your email address by clicking the link below. This is mandatory to use our service.
        <br />
        <br />
        <div id="btn" style="margin-top: 1rem; margin-bottom: 2.5rem">
          <a
            style="
              padding: 0.7rem 2rem;
              text-decoration: none;
              border: none;
              border-radius: 1.8rem;
              background-color: rgb(10, 112, 214);
              color: white;
            "
            href="http://localhost:5000/user/verify/?token=${token}&email=${client.email}"
            target="_blank"
            >Verify Email</a
          >
        </div>
      </div>
      <br />
      <div style="font-size: 1.1rem">Thanks!</div>
      <br />
      <div style="margin: 1rem 0; font-size: small; color: rgb(76, 75, 75)">
        <div>LinkHub Pvt Ltd</div>
        <div>
          Lalbazar, Ward No. - 04, Sonamukhi, 722207, Bankura, West Bengal,
          India
        </div>
        <div>
          Contact:
          <a
            style="color: rgb(76, 75, 75)"
            href="mailto:rudrasubrata27@gmail.com"
            >rudrasubrata27@gmail.com</a
          >
        </div>
      </div>
    </div>
  </body>
</html>
`;

  const mailConfiguration = {
    from: process.env.EMAIL,
    to: client.email,
    subject: "Verify your email to activate your LinkHub",
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send verification email");
      throw Error(error);
    }
  });
};

// This function sends verification mail to unverified users
const sendWelcomeMail = (client) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome Email</title>
    </head>
    <body>
      <div
        style="
          justify-content: center;
          flex-direction: column;
          align-items: center;
          background-color: #f0f4f9;
          text-align: center;
          padding: 1rem;
          font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
        "
      >
        <img
          src="https://res.cloudinary.com/dor2rxkrs/image/upload/v1704310218/LinkHub%20Media/LinkHub_Wide-removebg-preview_nhcp7y.png"
          style="width: 18rem; height: 8rem"
        />
        <div style="font-size: 1.2rem">
          <h1 style="font-size: 2rem">Welcome to LinkHub!</h1>
          <div style="font-size: 1.2rem">
            <b>@${client.username}</b>, we are so happy you are here.
          </div>
          <br />
          <p style="font-size: 1.5rem">
            Now, no need to stress about sharing multiple links, just put all your
            links in your LinkHub and share just one link.
          </p>
          <br />
          <p style="font-size: 1.5rem; font-weight: 700">Steps to Get Started:</p>
          <div>
            <p>1. Go to LinkHub and Sign In</p>
            <p>
              2. Create hub for your profile just by adding a title and a short
              description. You can also add a profile picture for your hub.
            </p>
            <p>
              3. Add your favorite, best or most important links. Just paste a
              URL, title your link, and you’re set!
            </p>
          </div>
          <br />
          <br />
          <div id="btn" style="margin-top: 1rem; margin-bottom: 2.5rem">
            <a
              style="
                padding: 0.7rem 2rem;
                text-decoration: none;
                border: none;
                border-radius: 1.8rem;
                background-color: #4ed376;
                font-weight: 600;
                color: rgb(40, 40, 40);
              "
              href="http://localhost:5000/"
              target="_blank"
              >Go To LinkHub</a
            >
          </div>
        </div>
        <br />
        <div style="font-size: 1.1rem">Thanks!</div>
        <br />
        <div style="margin: 1rem 0; font-size: small; color: rgb(76, 75, 75)">
          <div>LinkHub Pvt Ltd</div>
          <div>
            Lalbazar, Ward No. - 04, Sonamukhi, 722207, Bankura, West Bengal,
            India
          </div>
          <div>
            Contact:
            <a
              style="color: rgb(76, 75, 75)"
              href="mailto:rudrasubrata27@gmail.com"
              >rudrasubrata27@gmail.com</a
            >
          </div>
        </div>
      </div>
    </body>
  </html>  
`;

  const mailConfiguration = {
    from: process.env.EMAIL,
    to: client.email,
    subject: "Welcome to LinkHub",
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send welcome email");
      throw Error(error);
    }
  });
};

// Send OTP to email for deletion of user's account
const mailOTPForDeletion = (client) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Email</title>
</head>
<body>
  <div
    style="
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background-color: #fcede8;
      text-align: center;
      padding: 1rem;
      font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
    "
  >
    <img
      src="https://res.cloudinary.com/dor2rxkrs/image/upload/v1704310218/LinkHub%20Media/LinkHub_Wide-removebg-preview_nhcp7y.png"
      style="width: 18rem; height: 8rem"
    />
    <br />
    <br />
    <div style="font-size: 1.07rem">
      Hey <b>${client.username}</b>, you have requested for deletion of your
      LinkHub Account.
      <br />
      Your 4 digit <b>OTP(One Time Password)</b> for <b>deletion</b> of your
      <b>LinkHub account</b>
      is:
      <b>${client.otp}</b>
      <br />
      <b>OTP Expires in: 10 minutes</b>
      <br />
      Please don't share this with anyone.
      <br />
      If this is not you who requested for deletion of this account, please
      just ignore this email.
    </div>
    <br />
    <div style="font-size: 1.1rem">Thanks!</div>
    <br />
    <div style="margin: 1rem 0; font-size: small; color: rgb(76, 75, 75)">
      <div>LinkHub Pvt Ltd</div>
      <div>
        Lalbazar, Ward No. - 04, Sonamukhi, 722207, Bankura, West Bengal,
        India
      </div>
      <div>
        Contact:
        <a
          style="color: rgb(76, 75, 75)"
          href="mailto:rudrasubrata27@gmail.com"
          >rudrasubrata27@gmail.com</a
        >
      </div>
    </div>
  </div>
</body>
</html>
`;

  const mailConfiguration = {
    from: process.env.EMAIL,
    to: client.email,
    subject: `OTP for deleting your LinkHub account is ${client.otp}`,
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send OTP for deleting account email");
      throw Error(error);
    }
  });
};

// Send email to reset account password
const sendPasswordResetLinkMail = (client) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Email</title>
    </head>
    <body>
      <div
        style="
          justify-content: center;
          flex-direction: column;
          align-items: center;
          background-color: rgba(229, 241, 248, 0.954);
          text-align: center;
          padding: 1rem;
          font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
        "
      >
        <img
          src="https://res.cloudinary.com/dor2rxkrs/image/upload/v1704310218/LinkHub%20Media/LinkHub_Wide-removebg-preview_nhcp7y.png"
          style="width: 18rem; height: 8rem"
        />
        <div style="font-size: 1.2rem">Hey ${client.username} !</div>
        <br />
        <div style="font-size: 1.2rem">
          You have requested to <b>reset</b> your <b>LinkHub Account password</b>.
          <br />
          <br />
          Use the link below within <b>15 minutes</b> to reset your LinkHub
          Account password.
          <br />
          <br />
          <div id="btn" style="margin-top: 1rem; margin-bottom: 2.5rem">
            <a
              style="
                padding: 0.7rem 2rem;
                text-decoration: none;
                border: none;
                border-radius: 1.8rem;
                background-color: rgb(19, 169, 6);
                color: white;
              "
              href="${client.link}"
              target="_blank"
              >Reset Password</a
            >
          </div>
          <p style="font-size: 1rem">
            If this is not you who have requested for password reset please just
            ignore this email.
          </p>
        </div>
        <br />
        <div style="font-size: 1.1rem">Thanks!</div>
        <br />
        <div style="margin: 1rem 0; font-size: small; color: rgb(76, 75, 75)">
          <div>LinkHub Pvt Ltd</div>
          <div>
            Lalbazar, Ward No. - 04, Sonamukhi, 722207, Bankura, West Bengal,
            India
          </div>
          <div>
            Contact:
            <a
              style="color: rgb(76, 75, 75)"
              href="mailto:rudrasubrata27@gmail.com"
              >rudrasubrata27@gmail.com</a
            >
          </div>
        </div>
      </div>
    </body>
  </html>  
`;

  const mailConfiguration = {
    from: process.env.EMAIL,
    to: client.email,
    subject: "LinkHub | Reset your password",
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send password reset email");
      throw Error(error);
    }
  });
};

// Register or Sign Up
const registerUser = expressAsyncHandler(async (req, res) => {
  const { email, password, profilePic } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the required details");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(202).send("This email is already registered to LinkHub.");
    return;
  }

  let username;
  const secondPart = email.split("@")[1];
  if (secondPart === "gmail.com") {
    username = email.split("@")[0];
  } else {
    username = email.replace(/[@.]/g, "_");
  }

  let user;
  if (!profilePic) {
    user = await User.create({
      username,
      email,
      password,
    });
  } else {
    user = await User.create({
      username,
      email,
      password,
      profilePic,
    });
  }

  if (user) {
    sendMail(user);
    res
      .status(201)
      .send(
        `We have sent a Verification Email to your email address ${email}. Please verify your email to continue setup. Check your inbox and verify.`
      );
  } else {
    res.status(400).send("Failed to create user");
    throw new Error("Failed to create user");
  }
});

const verifyUser = expressAsyncHandler(async (req, res) => {
  const token = req.query.token;
  try {
    // Getting the username by decoding the JWT token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.data;

    //Getting the user data from database by using the username
    const userFromToken = await User.findOne({ username: username });
    const userEmailVerified = userFromToken.emailVerified;
    const email = userFromToken.email;
    if (userEmailVerified === true) {
      res.status(200).render("emailVerifiedPage", {
        textData: `Your email "${email}" is already verified.`,
      });
      return;
    }

    let user;
    try {
      user = await User.findOneAndUpdate(
        { email: email },
        { emailVerified: true },
        { new: true }
      );
    } catch (error) {
      res
        .status(500)
        .send("Email verification failed due to internal server error");
      throw new Error(error);
    }
    res.status(200).render("emailVerifiedPage", {
      textData: `Your email "${email}" is verified successfully✅`,
    });

    // Send welcome mail to the new user
    const client = {
      username: user.username,
      email: email,
    };
    sendWelcomeMail(client);
  } catch (error) {
    res.status(202).render("emailVerificationFailedPage");
  }
});

// Authentication or Sign In
const authenticateUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Please provide all the necessary details");
    throw new Error("Please provide all the necessary details");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(204).send("User with this email is not registered to LinkHub.");
    return;
  }
  if ((user, await user.matchPassword(password))) {
    if (user.emailVerified === false) {
      res
        .status(202)
        .send(
          "Email is not verified yet. Please verify your email to login. We have sent a verification email just now. Check your inbox and verify and then try to login."
        );
      sendMail(user);
      return;
    }
    let hubExist = false;
    let hubTitle = "",
      hubDesc = "";
    const existHub = await Visit.findOne({ username: user.username });
    if (existHub) {
      hubExist = true;
      hubTitle = existHub.title;
      hubDesc = existHub.description;
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      hubExist: hubExist,
      hubTitle: hubTitle,
      hubDesc: hubDesc,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } else {
    res.status(203).send("Invalid email or password");
  }
});

// Update Profile Picture
const updateProfilePic = expressAsyncHandler(async (req, res) => {
  const { newProfilePic } = req.body;
  if (!newProfilePic) {
    res.status(400).send("Please send required valid details");
    throw new Error("Please send required valid details");
  }
  const updatedUser = await User.findOneAndUpdate(
    { username: req.user.username },
    { profilePic: newProfilePic },
    { new: true }
  );
  if (updatedUser) {
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
    updateRedis(updatedUser.username);
  } else {
    res.status(404).send("User not found");
    throw new Error("User not found");
  }
});

// To delete user account
const deleteUserRequest = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).send("Please send all the required details");
    console.log("Error: Please send all the required details");
    return;
  }
  const user = await User.findOne({ username: req.user.username });
  if ((user, await user.matchPassword(password))) {
    // Firstly authenticate using password
    if (user.emailVerified === false) {
      res
        .status(400)
        .send(
          "Your LinkHub account is not still created completely. To do that you have to firstly verify your email. We have sent a verification email to your given email address. Verify your email address, then log in to LinkHub and then try to delete your account."
        );
      sendMail(user);
      return;
    }
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`; // Generating 4-digit OTP
      // Hashing the OTP using bcrypt.js to store in database
      const salt = await bcrypt.genSalt(10);
      const hashedOTP = await bcrypt.hash(otp, salt);
      const username = user.username,
        email = user.email;
      await OTPVerification.create({
        username: username,
        otp: hashedOTP,
        expiresAt: Date.now() + 600000, // Here in the db we are storing the expiresAt time = time of creation + 10 minutes(i.e 600000 miliseconds)
      });
      // Now sending OTP to email
      const obj = {
        username: username,
        email: email,
        otp: otp,
      };
      mailOTPForDeletion(obj);
      res.status(200).json({
        status: "PENDING",
        message: "Verification OTP email sent",
      });
    } catch (error) {
      res.status(500).json({
        status: "FAILED",
        message: error.message,
      });
      console.log("Error: ", error.message);
    }
  } else {
    res.status(401).send("Invalid email or password");
    console.error("Invalid email or password");
  }
});

// To verify the OTP which was send for deleting user's account
const verifyOtpForUserDeletion = expressAsyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    res.status(400).send("Please send all the required details.");
    console.log("Error: Please send all the required details.");
    return;
  }
  try {
    const username = req.user.username;
    const OTPVerificationRecords = await OTPVerification.find({
      username: username,
    }).sort({
      createdAt: 1,
    });
    if (OTPVerificationRecords.length <= 0) {
      res.status(400).send("Account does not exist or already deleted.");
      console.log("Error: Account does not exist or already deleted.");
    } else {
      const { expiresAt } = OTPVerificationRecords[0];
      const hashedOTP = OTPVerificationRecords[0].otp;
      // Checking if the time limit of the OTP has exceeded or not
      if (expiresAt < Date.now()) {
        // Means OTP is expired
        await OTPVerification.deleteMany({ username: username }); // Deleting all the OTPs stored in db for this username as they are of no use
        res.status(400).send("The OTP has expired. Please try again.");
        return;
      } else {
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
          res
            .status(400)
            .send(
              "Invalid OTP Code sent. Please check your email inbox and enter the right OTP code"
            );
        } else {
          await OTPVerification.deleteMany({ username: username }); // Deleting all the OTPs stored in db for this username as we have used the OTP and now they are of no use.
          // Now we will delete all the records of the account
          await Visit.deleteOne({ username: username });
          await Subscriber.deleteOne({ username: username });
          await Link.deleteMany({ username: username });
          await BasicDetails.deleteMany({ username: username });
          await User.deleteOne({ username: username });
          res.status(200).send("LinkHub account deleted successfully.");
          await redis.del(username);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

// To send the User Interface to fill the email address and send to the server
const forgotPassword = expressAsyncHandler(async (req, res) => {
  res.status(200).render("forgotPasswordPage");
});

// To accept the email address sent to the server, and then send the password reset link to the gotten email address
const sendPasswordResetEmail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).send("Please send the email.");
    return;
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send("User doesn't exist.");
      return;
    }
    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      email: email,
      id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `http://localhost:5000/user/reset-password/${email}/${token}`;
    const obj = {
      username: user.username,
      email: email,
      link: link,
    };
    sendPasswordResetLinkMail(obj);
    res
      .status(200)
      .send("Password reset link sent to the email you have given.");
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error.message);
  }
});

// To send the User Interface to fill the password and send to server
const resetPasswordForm = expressAsyncHandler(async (req, res) => {
  const { email, token } = req.params;
  if (!email || !token) {
    res.status(400).send("Please send email and token.");
    return;
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      // Checking if the user exists or not
      res.status(404).send("User doesn't exist");
      return;
    }
    const secret = process.env.JWT_SECRET + user.password; // This secret's value is same as the above, as the password is still not changed. If the password is changed, then secret's value will also be changed, then the verification process which is happening below will fail, and thus it ensures only one time use of password resetting link. If the password is not changed then secret's value will be same as the previous one, thus there will be no problem in the below verification problem and password will be updated successfully.
    const payload = jwt.verify(token, secret); // If this succeed then flow will continue in this block and as a result password reset template will be sent, otherwise flow will go to the catch block and nothing will be sent.
    const obj = {
      email: email,
      username: user.username,
      token: token,
    };
    res.status(200).render("resetPasswordFormPage", obj);
  } catch (error) {
    res.status(500).send("The link is expired");
    console.error(error.message);
  }
});

// This actually receives the password along with the token and email and updates the password
const resetPassword = expressAsyncHandler(async (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;
  if (!email || !token || !password) {
    res.status(400).send("Please send email and token");
    return;
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      res.status(404).send("User doesn't exist");
      return;
    }
    // Verifying the token
    const secret = process.env.JWT_SECRET + userExist.password;
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id); // This is checked so we can confirm that the token is genuine and not tampered. As while generating the token the payload was used, and payload was made of email and id of the user.
    if (!user) {
      res.status(400).send("Invalid token send");
      return;
    }
    // Now finally updating the password
    user.password = password;
    await user.save();
    res.status(200).send("New Password Saved Successfully!");
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error.message);
  }
});

module.exports = {
  registerUser,
  verifyUser,
  authenticateUser,
  updateProfilePic,
  deleteUserRequest,
  verifyOtpForUserDeletion,
  forgotPassword,
  sendPasswordResetEmail,
  resetPasswordForm,
  resetPassword,
};
