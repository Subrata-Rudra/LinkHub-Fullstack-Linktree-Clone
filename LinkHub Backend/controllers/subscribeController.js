const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Subscriber = require("../models/subscriberModel");

dotenv.config();

// This function sends verification mail to unverified users
const sendMail = (obj) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const jwt_data =
    obj.username + obj.email.split("@")[0] + process.env.JWT_DATA_MAKER;

  const token = jwt.sign(
    {
      data: jwt_data,
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
      class="container"
      style="
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background-color: rgba(229, 241, 248, 0.954);;
        text-align: center;
        padding: 1rem;
        font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
      "
    >
      <img
        src="https://res.cloudinary.com/dor2rxkrs/image/upload/v1704310218/LinkHub%20Media/LinkHub_Wide-removebg-preview_nhcp7y.png"
        alt="linkhub icon"
        style="width: 18rem; height: 8rem"
      />
      <div style="font-size: 1.2rem">Hi ${obj.email.split("@")[0]},</div>
      <br />
      <div style="font-size: 1.2rem">
        Please verify your email address by clicking the button below. This is a mandatory process for subscribing to <b>${
          obj.username
        }</b> on LinkHub.
        <br />
        <br />
        By subscribing you will get update when new links will be added to <b>${
          obj.username
        }</b>'s LinkHub.
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
            href="http://localhost:5000/subscribe/verify/?token=${token}&username=${
    obj.username
  }&email=${obj.email}"
            target="_blank"
            >Verify Email</a
          >
        </div>
      </div>
      <div style="font-size: 1rem">
        Having trouble verifying your email in our app?
        <a
          href="http://localhost:5000/subscribe/verify/?token=${token}&username=${
    obj.username
  }&email=${obj.email}"
          target="_blank"
          >Try in your browser</a
        >
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
    to: obj.email,
    subject: `Verify your email to subscribe to ${obj.username}'s LinkHub`,
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send verification email");
      throw Error(error);
    }
  });
};

// To send mails to visitors after subscribing to any LinkHub account syaing that "Congratulations you have subscribed to blah blah blah..."
const sendMailToSubscriber = (obj) => {
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
    <title>Email Subscribed</title>
  </head>
  <body>
    <div
      class="container"
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
        alt="linkhub icon"
        style="width: 18rem; height: 8rem"
      />
      <div style="font-size: 1.2rem">Hi ${obj.email.split("@")[0]},</div>
      <br />
      <div style="font-size: 1.2rem">
        Congratulations! You have subscribed to <b>${
          obj.username
        }</b> on LinkHub.
        <br />
        <br />
        Now you will get update when new links will be added to ${
          obj.username
        }'s LinkHub.
        <br />
        <br />
        To Unsubscribe <b>${
          obj.username
        }</b> on LinkHub you can click the Unsubscribe
        button anytime.
        <br />
        <br />
        <div id="btn" style="margin-top: 1rem; margin-bottom: 2.5rem">
          <a
            style="
              padding: 0.7rem 2rem;
              text-decoration: none;
              border: none;
              border-radius: 1.8rem;
              background-color: rgb(197, 4, 4);
              color: white;
            "
            href="http://localhost:5000/subscribe/unsubscribeRequest?username=${
              obj.username
            }&email=${obj.email}"
            target="_blank"
            >Unsubscribe</a
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
    to: obj.email,
    subject: `Subscribed to ${obj.username}'s LinkHub`,
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send verification email");
      throw Error(error);
    }
  });
};

// To handle requests for subscribing from frontend(visitors)
const subscribeRequest = expressAsyncHandler(async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;
  if (!username || !email) {
    res.status(404).send("Please send both username and email");
    console.log("Error: Please send both username and email");
    return;
  }
  const channel = await Subscriber.findOne({
    username: username,
  });
  if (channel && channel.count > 0 && channel.email.includes(email)) {
    res
      .status(400)
      .send(
        `You are already a subscriber of ${username}'s LinkHub, so no need to subscribe again.`
      );
    return;
  }
  const obj = {
    username: username,
    email: email,
  };
  sendMail(obj); // Sending mail to verify the email id of the visitor who want to subscribe
  res.status(200).send("We have sent an email to verify your email");
});

// To verify the email id given by sibscriber and give the visitor subscription accoording to the result of verification
const verifySubscriber = expressAsyncHandler(async (req, res) => {
  const token = req.query.token;
  const username = req.query.username;
  const email = req.query.email;
  const isVerified = jwt.verify(token, process.env.JWT_SECRET);
  if (!isVerified) {
    res
      .status(500)
      .send(
        "Email verification failed, possibly the link is invalid or expired"
      );
    console.log(
      "Error: Email verification failed, possibly the link is invalid or expired"
    );
  } else {
    try {
      const channel = await Subscriber.findOne({
        username: username,
      });
      if (!channel) {
        try {
          await Subscriber.create({
            username,
            email: [email],
            count: 1,
          });

          // To send mail to subscriber after subscribing to any LinkHub
          const obj = {
            username: username,
            email: email,
          };
          sendMailToSubscriber(obj);
          res.status(201).send(`Your email is verified successfully!`);
          return;
        } catch (error) {
          res.status(500).send("Internal server error");
          console.log("Error: ", error);
          return;
        }
      }
      if (channel && channel.count > 0 && channel.email.includes(email)) {
        res
          .status(400)
          .send(
            `You are already a subscriber of ${username}'s LinkHub, so no need to subscribe again.`
          );
        return;
      }
      const subscribed = await Subscriber.findOneAndUpdate(
        { username: username },
        { $push: { email: email }, $inc: { count: 1 } },
        { new: true }
      );
      if (subscribed) {
        // To send mail to subscriber after subscribing to any LinkHub
        const obj = {
          username: username,
          email: email,
        };
        sendMailToSubscriber(obj);

        res.status(201).send(`Your email is verified successfully!`);
      } else {
        res.status(404).send(`No LinkHub exists with the username ${username}`);
      }
    } catch (error) {
      res
        .status(500)
        .send("Email verification failed due to internal server error");
      throw new Error(error);
    }
  }
});

// To unsibscribe a visitor from a LinkHub Account
const unsubscribeRequest = expressAsyncHandler(async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;
  if (!username || !email) {
    res.status(400).send("Please send the username and email");
    console.error("Error: Please send the username and email");
  } else {
    const channel = await Subscriber.findOne({
      username: username,
    });
    if (channel) {
      if (channel.count > 0) {
        if (!channel.email.includes(email)) {
          res
            .status(200)
            .send(
              `You are not a subscriber of ${username}'s LinkHub. Maybe you have unsubscribed previously or never subscribed to this LinkHub. So no need to unsubscribe again.`
            );
          return;
        } else {
          try {
            await Subscriber.updateOne(
              { username: username },
              { $pull: { email: email }, $inc: { count: -1 } }
            );
            res
              .status(200)
              .send(
                `You have successfully unsubscribed from ${username} on LinkHub`
              );
          } catch (error) {
            res.status(500).send("Internal server error");
            console.error(error);
          }
        }
      } else {
        res
          .status(400)
          .send(
            `You are not a subscriber of ${username}'s LinkHub. Maybe you have unsubscribed previously or never subscribed to this LinkHub. So no need to unsubscribe again.`
          );
        return;
      }
    } else {
      res.status(400).send("LinkHub with this username is not found.");
    }
  }
});

// To get the count of subscriber(s)
const subscriberCount = expressAsyncHandler(async (req, res) => {
  const username = req.user.username;
  try {
    const sub = await Subscriber.findOne({ username });
    let count = sub ? sub.count : 0;
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).send("Error in getting subscriber data.");
    console.error(error);
  }
});

module.exports = {
  subscribeRequest,
  verifySubscriber,
  unsubscribeRequest,
  subscriberCount,
};
