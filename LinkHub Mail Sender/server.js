const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const colors = require("colors");
const Subscriber = require("./models/subscriberModel");
const port = process.env.PORT || 8000;

dotenv.config();

connectDb();

const app = express();

app.use(express.json());

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
      <title>New Links Added</title>
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
        <div style="font-size: 1.2rem">Hi ${obj.emailId.split("@")[0]},</div>
        <br />
        <div style="font-size: 1.2rem">
          <b>${obj.linkCount}</b> New links are added to
          <b>${obj.username}</b>'s LinkHub.
          <br />
          <br />
          <div style="margin-top: 1rem; margin-bottom: 2.5rem">
            <a
              style="
                padding: 0.5rem 1.4rem;
                text-decoration: none;
                border: none;
                border-radius: 1.8rem;
                background-color: rgb(59, 197, 4);
                color: white;
              "
              href="http://localhost:5000/${obj.username}"
              target="_blank"
              >Check Out</a
            >
          </div>
          To Unsubscribe <b>${obj.username}</b>'s LinkHub you can click the
          Unsubscribe button anytime.
          <br />
          <br />
          <div style="margin-top: 1rem; margin-bottom: 2.5rem">
            <a
              style="
                padding: 0.4rem 1.2rem;
                text-decoration: none;
                border: none;
                border-radius: 1.8rem;
                background-color: rgb(197, 4, 4);
                color: white;
              "
              href="http://localhost:5000/subscribe/unsubscribeRequest?username=${
                obj.username
              }&email=${obj.emailId}"
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
    to: obj.emailId,
    subject: `${obj.linkCount} New links are added to ${obj.username}'s LinkHub`,
    html: htmlContent,
  };

  transporter.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.log("Failed to send update email");
      throw Error(error);
    }
  });
};

async function performTask(obj) {
  return new Promise((resolve) => {
    sendMailToSubscriber(obj);
    setTimeout(() => {
      resolve();
    });
  });
}

const updateHandler = expressAsyncHandler(async (req, res) => {
  const { username, linkCount } = req.body;
  if (!username || !linkCount) {
    res.status(400).send("Please send the username");
    console.log("Error: Please send the username");
  } else {
    try {
      const user = await Subscriber.findOne({ username: username });
      const emails = user.email;
      if (emails.length > 0) {
        for (const item of emails) {
          const obj = {
            username: username,
            emailId: item,
            linkCount: linkCount,
          };
          await performTask(obj);
        }
        res
          .status(200)
          .send("Emails are sent to all the subscribers successfully!");
      } else {
        res.status(404).send("No subscribers found for this LinkHub username");
      }
    } catch (error) {
      res.status(500).send("Internal server error");
      console.log("Error: ", error);
    }
  }
});

app.get("/test", (req, res) => {
  res.status(200).send("Email📩 server🖥️ is okay!");
});

// This endpoint is used to send emails to subscribers of LinkHub accounts
app.post("/", updateHandler);

app.listen(port, () => {
  console.log(`Email server is running on http://localhost:${port}`.bold);
});
