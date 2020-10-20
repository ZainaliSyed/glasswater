// // const functions = require('firebase-functions');
// // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = require('firebase-functions');

// // The Firebase Admin SDK to access Cloud Firestore.
// const admin = require('firebase-admin');
// admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Take the text parameter passed to this HTTP endpoint and insert it into
// // Cloud Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Cloud Firestore using the Firebase Admin SDK.
//   const writeResult = await admin
//     .firestore()
//     .collection('messages')
//     .add({original: original});
//   // Send back a message that we've succesfully written the message
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

/////////////////////////////////////////
//apna
const functions = require('firebase-functions');
exports.pushNotification = functions.https.onRequest(async (req, res) => {
  // Create a notification
  const payload = {
    notification: {
      title: 'glass water',
      body: 'One class water',
      sound: 'default',
    },
  };

  //Create an options object that contains the time to live for the notification and the priority
  const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  return admin.messaging().sendToTopic('pushNotifications', payload, options);
});
////////////////////////////////////////

// //import firebase functions modules
// const functions = require('firebase-functions');
// //import admin module
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);

// exports.pushNotification = functions.database
//   .ref('/YourNode/{pushId}')
//   .onWrite((change, context) => {
//     console.log('Push notification event triggered');

//     //  Get the current value of what was written to the Realtime Database.
//     const valueObject = change.after.val();

//     // Create a notification
//     const payload = {
//       notification: {
//         title: valueObject.title,
//         body: valueObject.message,
//         sound: 'default',
//       },
//     };

//     //Create an options object that contains the time to live for the notification and the priority
//     const options = {
//       priority: 'high',
//       timeToLive: 60 * 60 * 24,
//     };

//     return admin.messaging().sendToTopic('pushNotifications', payload, options);
//   });
