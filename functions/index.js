const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

exports.pushNotificationRN = functions.https.onRequest(async (req, res) => {
  var payload = {
    notification: {
      title: 'ABC',
      body: 'ABC',
    },
    data: {
      type: 'notification',
    },
  };
  admin
    .messaging()
    .sendToDevice(
      'ciK9fEFFTCikXi-iOZCHjN:APA91bGCYV3-7SL_ycyk_VpQEM_YWFJtAmOr76e2OrcGVY68dhUJCyU1Vr8JsA-bHKpWC0RFINloWRh4dwJXy-qfqYTDmJtAOMB0jxaMnEvpzp3P18mvlRniMjBh3rL59e1Cwwo_Dv_i',
      payload,
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      },
    );
  return res.send(200);
});
