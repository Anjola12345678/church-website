const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Create the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anjolaoluwaakintunde2@gmail.com', // Your church email
    pass: 'bkfb ncdv yder zjgl'      // IMPORTANT: Use an App Password!
  }
});

exports.sendSermonNotification = functions.firestore
  .document('sermon/{sermonId}')
  .onCreate(async (snap, context) => {
    const sermon = snap.data();
    
    // Send the email
    return transporter.sendMail({
      from: 'YOUR_EMAIL@gmail.com',
      to: 'RECIPIENT_EMAIL@example.com', // You can also pull this from a database
      subject: `New Sermon: ${sermon.title}`,
      text: `A new sermon by ${sermon.preacher} is now live!`
    });
  });