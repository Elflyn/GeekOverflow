import React from 'react';
import { StyleSheet, TouchableOpacity, View, BackHandler, ToastAndroid, Alert, Linking, StatusBar } from 'react-native';
import { Scene, Router, Stack, Actions, Tabs, ActionConst } from 'react-native-router-flux';
import LoginPage from './src/views/LoginPage';
import SignupPage from './src/views/SignupPage';
import SplashScreen from './src/views/SplashScreen'
import HomePage from './src/views/HomePage'
import ItemDetail from './src/views/ItemDetail'
import Placeholder from './src/views/Placeholder'
import ChatList from './src/views/ChatList'
import Chat from './src/components/Chat'
import Post from './src/views/Post'
import Profile from './src/views/Profile';
import { Icon } from 'react-native-elements';
import EditProfile from './src/views/EditProfile';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/messaging';
import message from './src/message';
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';

export default class RouterComponent extends React.Component {

  async componentDidMount() {
    console.disableYellowBox = true;
    initLink = await firebase.dynamicLinks().getInitialLink();
    if (initLink) {
      var deepLinkParams = parseURL(initLink.url);
      var mode = deepLinkParams.mode;
      var oobCode = deepLinkParams.oobCode;

      switch (mode) {
        case 'verifyEmail':
         this.handleVerifyEmail(oobCode);
         break;
        default:
          ToastAndroid.show(initLink.url, ToastAndroid.SHORT);
      }
    }
    Linking.addEventListener("url", this.handeLaunchByUrl);
    BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
    if (firebase.auth().currentUser) {
      this.handleFCMRegister();
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handeLaunchByUrl);
    BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
  }

  handleFCMRegister = () => {
    const messaging = firebase.messaging();
    messaging.getToken().then((token) => {
      if (token) {
        this.sendTokenToDatabase(token);
      } else {
        ToastAndroid.show('No Instance ID token available.', ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error occurred while retrieving token. ', ToastAndroid.SHORT);
    });
    messaging.onTokenRefresh(() => {
      messaging.getToken().then((token) => {
        if (token) {
          this.sendTokenToDatabase(token);
        } else {
          ToastAndroid.show('No Instance ID token available.', ToastAndroid.SHORT);
        }
      }).catch((err) => {
        ToastAndroid.show('An error occurred while retrieving token. ', ToastAndroid.SHORT);
      });
    });
  }

  sendTokenToDatabase = async (token) => {
    const ref = firebase.database().ref('users');
    var key;
    await ref.orderByChild('uid').equalTo(firebase.auth().currentUser.uid).once('value').then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        key = childSnapshot.key;
      })
    }).catch((error) => {
      var errorMessage = error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    });
    ref.child(key).update({ fcmToken: token });
  }

  handeLaunchByUrl = (event) => {
    if (event) {
      var deepLinkParams = parseURL(decodeURIComponent(parseURL(event.url).link));
      var mode = deepLinkParams.mode;
      var oobCode = deepLinkParams.oobCode;

      switch (mode) {
        case 'verifyEmail':
          this.handleVerifyEmail(oobCode);
          break;
        default:
          ToastAndroid.show(event.url, ToastAndroid.SHORT);
      }
    }
  };

  handleVerifyEmail = (oobCode) => {
    firebase.auth().applyActionCode(oobCode).then(() => {
      Alert.alert(
        null,
        'Thank you. Your email address has been verified.',
        [{ text: 'OK'}],
      );
      firebase.auth().currentUser.reload().then(() => {
        Actions.refresh();
      });
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/expired-action-code') {
          ToastAndroid.show(message.LINK_EXPIRE, ToastAndroid.SHORT);
        } else if (errorCode == 'auth/invalid-action-code') {
          ToastAndroid.show(message.LINK_INVALID, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
      }
    });
  }

  handleBackButton = () => {
    if (Actions.currentScene === 'login') {
      Actions.root();
      return true;
    } else if (Actions.currentScene === 'splash') {
      return true;
    } else if (Actions.currentScene === 'home' || Actions.currentScene === 'message' || Actions.currentScene === 'profile') {
      Alert.alert(
        null,
        'Would you like to exit the app?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
      );
      return true;
    }
  }

  handleTabBarPress = ({ navigation, defaultHandler }) => {
    if (navigation.state.routeName == '_message' || navigation.state.routeName == "_account") {
      if (!firebase.auth().currentUser) {
        Actions.login();
        return true;
      }
    } else if (navigation.state.routeName == '_chatList') {
      Actions.jump('chatList', {initList: this.list});
      return true;
    }
    defaultHandler()
  }

  render() {
    return (
      <Router>
        <Stack transitionConfig={() => ({ screenInterpolator: StackViewStyleInterpolator.forHorizontal })}>
          <Scene key="root" headerLayoutPreset="center" hideNavBar>
            <Tabs
              key="nav"
              tabBarStyle={{ backgroundColor: '#FFFFFF' }}
              hideNavBar
              showLabel={false}
              activeTintColor="#016C9A"
              inactiveTintColor='grey'
              tabBarOnPress={this.handleTabBarPress}
            >
              <Scene key="_home" iconName={'home'} icon={TabIcon}>
                <Scene
                  key="home"
                  component={HomePage}
                  navigationBarStyle={style.nav}
                  title="Home"
                  titleStyle={style.title}
                />
              </Scene>
              <Scene key="_post" iconName={'plus-box-outline'} icon={TabIcon}>
                <Scene
                  key="post"
                  component={Post}
                  navigationBarStyle={style.nav}
                  title="Post Item"
                  titleStyle={style.title}
                />
              </Scene>
              <Scene key="_chatList" iconName={'message-text-outline'} icon={TabIcon} transitionConfig={() => ({ screenInterpolator: StackViewStyleInterpolator.forHorizontal })}>
                <Scene
                  key="chatList"
                  component={ChatList}
                  navigationBarStyle={style.nav}
                  title="Chat"
                  titleStyle={style.title}
                  //renderRightButton={() => renderAddButton()}
                />
                <Scene
                  key="chat"
                  component={Chat}
                  navigationBarStyle={style.nav}
                  title={this.props.title}
                  titleStyle={style.title}
                  hideTabBar
                  renderLeftButton={() => renderBackButton()}
                />
              </Scene>
              <Scene key="_account" iconName={'account'} icon={TabIcon}>
                <Scene key="profile" component={Profile} hideNavBar onEnter={() => {Actions.refresh()}}/>
              </Scene>
            </Tabs>
          </Scene>
          <Scene
            key="splash"
            component={SplashScreen}
            initial
            hideNavBar
            updateList={(list) => {
              this.list = list;
            }}
          />
          <Scene
            key="login"
            hideNavBar
            component={LoginPage}
          />
          <Scene
            key="signup"
            component={SignupPage}
            navigationBarStyle={style.nav}
            title="Register"
            titleStyle={style.title}
            renderLeftButton={() => renderBackButton()}
          />
          <Scene
            key="editProfile"
            component={EditProfile}
            navigationBarStyle={style.nav}
            title="Edit Profile"
            titleStyle={style.title}
            renderLeftButton={() => renderBackButton()}
          />
           <Scene
            key="detail"
            component={ItemDetail}
            navigationBarStyle={style.nav}
            title="Detail"
            titleStyle={style.title}
            renderLeftButton={() => renderBackButton()}
          />
        </Stack>
      </Router>
    );
  }
};

const renderBackButton = () => (
  <TouchableOpacity
    onPress={() => Actions.pop()}
  >
    <View style={{ alignItems: 'center' }}>
      <Icon iconStyle={style.iconStyle} name="keyboard-arrow-left" type="MaterialIcons" />
    </View>
  </TouchableOpacity>
);

const renderAddButton = () => (
  <TouchableOpacity
    onPress={() => {
      const cl = Actions.refs.chatList;
      cl.addChat();
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <Icon iconStyle={style.addIconStyle} name="person-add" type="MaterialIcons" />
    </View>
  </TouchableOpacity>
);

function parseURL(url) {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while (match = regex.exec(url)) {
    params[match[1]] = match[2];
  }
  return params;
}

class TabIcon extends React.Component {
  render() {
    const color = this.props.focused
      ? this.props.activeTintColor
      : this.props.inactiveTintColor

    return <Icon color={color} type="material-community" name={this.props.iconName} />
  }
}

const style = StyleSheet.create({
  nav: {
    height: StatusBar.currentHeight + 56,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#016C9A',
    textAlign: 'center',
  },

  title: {
    top: 0,
    color: 'white',
    flex: 1,
  },

  iconStyle: {
    color: 'white',
    marginLeft: 10,
  },

  addIconStyle: {
    color: 'white',
    marginRight: 10,
  },
});