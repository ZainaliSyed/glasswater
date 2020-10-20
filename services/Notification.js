import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

class Notification {
  hasPermission = (callback) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          console.log('permission  hasPermission: ', enabled);
          // user has permissions
          callback(enabled);
        } else {
          callback(enabled);
          console.log("permission user doesn't have permission : ", enabled);
          // user doesn't have permission
        }
      });
  };

  notificationPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      // user has permissions
      alert('notificationPermission');
      return enabled;
    } else {
      try {
        const requestPermission = await messaging().requestPermission();

        return requestPermission;
      } catch (error) {
        console.log('Error notificationPermission : ', error);
        return error;
        // User has rejected permissions
      }
      // user doesn't have permission
    }
  };

  fcmToken = (callback) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          // user has a device token
          console.log('fcm token : ', fcmToken);
          callback(fcmToken);
        } else {
          callback(fcmToken);
          console.log("user doesn't have a device token yet");
          // user doesn't have a device token yet
        }
      });
  };

  notificationInitialize = (callback) => {
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
          callback(notificationOpen);
        }
      })
      .catch((error) => {
        callback(error);
      });
  };

  onNotificationOpened = (callback) => {
    firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
          callback(notificationOpen);
        }
      });
  };

  notificationForeground = (callback) => {
    firebase.notifications().onNotification((notification: Notification) => {
      callback(notification);
    });
  };
}
export default new Notification();
