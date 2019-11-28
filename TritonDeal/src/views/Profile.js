import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ToastAndroid, StatusBar} from 'react-native';
import {Icon, Button, Avatar} from 'react-native-elements';
import {InfoList, ChoiceList} from '../components/ProfileList';
import GradientButton from '../components/GradientButton';
import {Actions} from 'react-native-router-flux';
import { firebase } from '@react-native-firebase/auth';
import message from '../message';
import RBSheet from "react-native-raw-bottom-sheet";

export default class UserProfileView extends Component {

  handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      ToastAndroid.show('Successfully signed out.', ToastAndroid.SHORT)
      Actions.root();
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/no-current-user') {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: message.NO_USER,
          }));
        } else {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: errorMessage,
          }));
        }
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>My Profile</Text>
            <Avatar 
              size={120}
              rounded 
              /*source={image uri}*/ 
              icon={{name: 'user', type: 'font-awesome'}} 
              containerStyle={styles.avatar}
              showEditButton
              onEditPress={() => this.RBSheet.open() }
            />
          </View>
        </View>
        <Button
          icon={<Icon name="edit" type="font-awesome" color="#005688" />}
          iconLeft
          titleStyle={editButtonStyle.title}
          buttonStyle={editButtonStyle.button}
          title="Edit Profile"
          onPress={() => Actions.editProfile()}
        />
        <View style={styles.background}>
          <InfoList />
          <ChoiceList />
          <GradientButton
            text={"Sign Out"}
            onPress={this.handleSignOut}
          />
        </View>
        <RBSheet
          ref={ref => this.RBSheet = ref}
          height={150}
          duration={250}
          >
          <View>
              <TouchableOpacity style={styles.menuButton}><Text style={styles.menuButtonText}>Upload</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuButton}><Text style={styles.menuButtonText}>New Photo</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.RBSheet.close()}style={styles.menuButton}><Text style={styles.menuButtonText}>Cancel</Text></TouchableOpacity>
          </View>      
      </RBSheet>
      </View>
    );
  }
}

const editButtonStyle = StyleSheet.create({
  title: {
    color: '#005688',
  },
  button: {
    width: 200,
    alignSelf: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: -20,
    zIndex: 1,
    borderRadius: 10,
  },
});

const styles = StyleSheet.create({
  header: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#00395B',
  },

  background: {
    paddingTop: 28,
    backgroundColor: '#ededed',
  },

  headerContent: {
    padding: 17,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 15,
  },

  headerText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },

  menuButton: {
    width: "100%",
    borderBottomColor: 'black',
    paddingVertical: 10,
  },

  menuButtonText: {
      textAlign: 'center',
      fontSize: 20,
  },
});
