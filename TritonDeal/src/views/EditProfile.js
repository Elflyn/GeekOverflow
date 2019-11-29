import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import { Input, Icon, ListItem, Button, Overlay } from 'react-native-elements';
import { firebase } from '@react-native-firebase/auth';
import { Actions } from 'react-native-router-flux';
import message from '../message';
import ReauthDialog from '../components/ReauthDialog'
//import GradientButton from './GradientButton';
//import auth from '@react-native-firebase/auth';
//import { firebase } from '@react-native-firebase/auth';
//import { Actions } from 'react-native-router-flux';

export default class EditProfile extends React.Component {

  state = { isVisible: false, text: "empty", finished: true, info: null, dialogVisible: false };


  toggleBox = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };

  handleError = (error) => {
    this.toggleActivityIndicator();
    var errorCode = error.code;
    var errorMessage = error.message;
    ToastAndroid.show(errorCode + ": " + errorMessage, ToastAndroid.SHORT);
  }

  handleUpdateProfile = () => {
    this.setState({ isVisible: !this.state.isVisible, finished: false });
    switch (this.state.text) {
      case "Name":
        this.handleUpdateDisplayName();
        break;
      case "Password":
        this.handleUpdatePassword();
        break;
      case "Email":
        this.handleUpdateEmail();
        break;
      case "Phone":
        this.handleupdatePhone();
        break;
      default:
        this.toggleActivityIndicator();
    };
  };

  handleUpdateEmail = () => {
    firebase.auth().currentUser.updateEmail(this.state.info).then(() => {
      var actionCodeSettings = {
        url: 'https://ucsd.edu',
        android: {
          packageName: 'com.tritondeal',
          installApp: true,
          minimumVersion: '12'
        },
        handleCodeInApp: true,
        dynamicLinkDomain: "tritondeal.page.link"
      };
      firebase.auth().currentUser.sendEmailVerification(actionCodeSettings);
      ToastAndroid.show(message.VALIDATE_EAMIL, ToastAndroid.SHORT);
      firebase.auth().currentUser.reload().then(() => {
        this.toggleActivityIndicator();
      }).catch(this.handleError);
    }).catch((error) => {
      this.toggleActivityIndicator();
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/requires-recent-login") {
        ToastAndroid.show("Session exipred. Please re-enter your password.", ToastAndroid.SHORT);
        this.setState({ dialogVisible: true, finished: true });
      } else {
        ToastAndroid.show(errorCode + ": " + errorMessage, ToastAndroid.SHORT);
      }
    });
  };

  handleUpdateDisplayName = () => {
    firebase.auth().currentUser.updateProfile({ displayName: this.state.info }).then(() => {
      firebase.auth().currentUser.reload().then(() => {
        this.toggleActivityIndicator();
        ToastAndroid.show('Successfully changed display name.', ToastAndroid.SHORT)
      }).catch(this.handleError);
    }).catch(this.handleError);
  };

  handleupdatePhone = () => {
    firebase.auth().currentUser.updatePhoneNumber(this.state.info).then(() => {
      firebase.auth().currentUser.reload().then(() => {
        this.toggleActivityIndicator();
      }).catch(this.handleError);
    }).catch(this.handleError);
  };

  handleUpdatePassword = () => {

  };

  //UPDATE new information to database

  render() {
    return (
      <View style={style.container}>
        <ListItem
          title="Name"
          bottomDivider
          chevron
          onPress={() => {
            this.setState({ isVisible: true, text: "Name" });
          }}
        />
        <ListItem
          title="Email"
          bottomDivider
          chevron
          onPress={() => {
            this.setState({ isVisible: true, text: "Email" });
          }}
        />
        <ListItem
          title="Phone"
          bottomDivider
          chevron
          onPress={() => {
            this.setState({ isVisible: true, text: "Phone" });
          }}
        />
        <Overlay
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(255, 255, 255, .8)"
          overlayBackgroundColor="white"
          width={350}
          height="auto"
        >
          <ListItem
            title={this.state.text}
            titleStyle={style.titleStyle}
            leftElement={<Button title="Cancel" type="clear" onPress={() => {
              this.toggleBox();
              this.setState({ info: null });
            }} />}
            rightElement={<Button title="Save" type="solid" onPress={() => {
              if (this.state.info) {
                this.handleUpdateProfile();
              }
            }} />}
          />
          <Input
            placeholder={this.state.text}
            onChangeText={(value) => this.setState({ info: value })}
          />
        </Overlay>
        <Overlay
          isVisible={!this.state.finished}
          width="auto"
          height="auto"
        >
          <ActivityIndicator size='large' color='#eabb33' />
        </Overlay>
        <ReauthDialog visible={this.state.dialogVisible} newEmail={this.state.info} />
      </View>
    )
  };
};

const style = StyleSheet.create({

  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  iconStyle: {
    color: 'white',
  },

  hyperlink: {
    color: '#94B4AF',
    textDecorationLine: 'underline',
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 10,
  },

  container: {
    textAlign: 'center',
  },

  titleStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

