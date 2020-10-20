import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import Notification from './services/Notification';
import database from '@react-native-firebase/database';
const db = database().ref('fcmToken');

const signInView = (setEmail, setPassword, onLogin, setSignIn) => {
  return (
    <View style={{marginHorizontal: 16}}>
      <Text style={{textAlign: 'center', fontSize: 25, marginTop: 100}}>
        Sign In
      </Text>
      <Text>Email</Text>
      <TextInput
        style={{backgroundColor: 'lightgrey'}}
        onChangeText={(text) => setEmail(text)}
      />
      <Text style={{marginTop: 20}}>Password</Text>
      <TextInput
        style={{backgroundColor: 'lightgrey', marginBottom: 20}}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity onPress={() => setSignIn(false)}>
        <Text style={{textAlign: 'right'}}>Don't have an account, Sign Up</Text>
      </TouchableOpacity>
      <Button title="Login" onPress={onLogin} />
    </View>
  );
};
const signUpView = (setEmail, setPassword, onLogin, setSignIn) => {
  return (
    <View style={{marginHorizontal: 16}}>
      <Text style={{textAlign: 'center', fontSize: 25, marginTop: 100}}>
        Sign Up
      </Text>
      <Text>Email</Text>
      <TextInput
        style={{backgroundColor: 'lightgrey'}}
        onChangeText={(text) => setEmail(text)}
      />
      <Text style={{marginTop: 20}}>Password</Text>
      <TextInput
        style={{backgroundColor: 'lightgrey', marginBottom: 20}}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity onPress={() => setSignIn(true)}>
        <Text style={{textAlign: 'right'}}>
          Already have an account, Sign In
        </Text>
      </TouchableOpacity>
      <Button title="Login" onPress={onLogin} />
    </View>
  );
};

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signIn, setSignIn] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  function onSignup() {
    if (!email && !password) return null;
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  }

  function onLogin() {
    if (!email && !password) return null;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        console.log('User account created & signed in!');
        Notification.fcmToken((token) => {
          db.push({email: data.user._user.email, token});
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  }
  function logout() {
    let user = auth().currentUser;
    let userEmail = user._user.email;
    db.once('value').then((snapshot) => {
      let value = snapshot.val();
      let objectValues = Object.values(value);
      let objectKeys = Object.keys(value);
      let filterData = objectValues.find(
        (filData) => filData.email === userEmail,
      );
      if (filterData) {
        database()
          .ref(`fcmToken/${objectKeys[objectValues.indexOf(filterData)]}`)
          .remove();
      }
    });

    auth()
      .signOut()
      .then((data) => console.log('User signed out!'));
  }

  useEffect(() => {
    Notification.hasPermission();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        {signIn
          ? signInView(setEmail, setPassword, onLogin, setSignIn)
          : signUpView(setEmail, setPassword, onSignup, setSignIn)}
      </View>
    );
  }

  return (
    <View style={{marginHorizontal: 16, marginTop: 100}}>
      <Text style={{marginBottom: 20, fontSize: 20}}>Welcome {user.email}</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
}

export default App;
