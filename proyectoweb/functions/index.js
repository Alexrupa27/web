const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin
admin.initializeApp();

// Configure the email transport using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "plagatronic@gmail.com",
    pass: "ymin bpei mqzu fdwk",
  },
});

// Cloud Function - using the correct syntax for Firebase Storage triggers
exports.onPhotoUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const fileName = filePath.split("/").pop().split(".")[0]; // Remove file extension if present
  console.log(`Uploaded file name: ${fileName}`);
  const usersSnapshot = await admin.database().ref("users").once("value");
  const users = usersSnapshot.val();

  for (const emailKey in users) {
    if (Object.prototype.hasOwnProperty.call(users, emailKey)) {
      const user = users[emailKey];
      if (user.devices) {
        for (const deviceCode in user.devices) {
          if (Object.prototype.hasOwnProperty.call(user.devices, deviceCode)) {
            if (deviceCode === fileName) {
              const emailAddress = emailKey.replace("_", "@");

              const mailOptions = {
                from: "plagatronic@gmail.com",
                to: emailAddress,
                subject: "Photo Uploaded for Your Device",
                text: `A photo matching your device (${deviceCode}) was just uploaded!`,
              };

              try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${emailAddress}`);
              } catch (error) {
                console.error(`Failed to send email: ${error}`);
              }

              return;
            }
          }
        }
      }
    }
  }

  console.log("No matching device found.");
});
