const nodemailer = require("nodemailer");

const { addToCache } = require("./cache");

module.exports = async function ({
  email,
  pin,
  Verification = true,
  subject = "",
}) {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "bdonation074@gmail.com",
      pass: "myzdyorkwpbyshbk",
      //heroko myzdyorkwpbyshbk123456789*
      //https://blood-donation-mah.herokuapp.com/
      //https://git.heroku.com/blood-donation-mah.git
    },
  });

  var mailOptions = {
    from: "bdonation074@gmail.com",
    to: email,
    subject: Verification ? "Verification Your Email" : subject,
    text: pin,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      if (Verification) await addToCache(email, pin);
    }
  });
};
