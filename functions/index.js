const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

exports.pushNotificationRN = functions.https.onRequest(async (req, res) => {
  admin
    .database()
    .ref('fcmToken')
    .once('value')
    .then((snapshot) => {
      let value = snapshot.val();
      let objectValues = Object.values(value);
      for (let token of objectValues) {
        console.log('TOKEN', token.token);
        var payload = {
          notification: {
            title: 'Glass Water',
            body: 'Drink a glass water',
          },
          data: {
            type: 'notification',
          },
        };
        admin.messaging().sendToDevice(token.token, payload, {
          // Required for background/quit data-only messages on iOS
          contentAvailable: true,
          // Required for background/quit data-only messages on Android
          priority: 'high',
        });
      }
    });

  return res.send(200);
});
