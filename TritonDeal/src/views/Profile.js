import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, StatusBar, ActivityIndicator } from 'react-native';
import { Icon, Button, Avatar, Overlay } from 'react-native-elements';
import { InfoList, ChoiceList } from '../components/ProfileList';
import GradientButton from '../components/GradientButton';
import { Actions } from 'react-native-router-flux';
import firebase from '@react-native-firebase/app';
import message from '../message';
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';

export default class UserProfileView extends Component {

  state = {
    finished: true,
    avatarURI: null,
  };

  componentDidMount = async () => {
    this.updateAvatarURI();
  }

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };

  updateAvatarURI = async () => {
    const ref = firebase.storage().ref('avatar').child(firebase.auth().currentUser.uid);
    try {
      const url = await ref.getDownloadURL();
      this.setState({ avatarURI: url });
    } catch (error) {
      const url = await firebase.storage().ref('avatar').child('defaultAvatar.jpg').getDownloadURL();
      this.setState({ avatarURI: url });
    }
  }
  
  handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      ToastAndroid.show('Successfully signed out.', ToastAndroid.SHORT)
      Actions.login();
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

  handleSelectPic = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      this.toggleActivityIndicator();
      fetch(image.path).then((response) => {
        response.blob().then((blob) => {
          const ref = firebase.storage().ref('avatar').child(firebase.auth().currentUser.uid);
          ref.put(blob).then(() => {
            this.toggleActivityIndicator();
            this.updateAvatarURI();
            ToastAndroid.show('Upload sucessful!', ToastAndroid.SHORT);
            this.RBSheet.close();
          })
        })
      })
    });
  };

  handleNewPhoto = () => {
    ImagePicker.openCamera({
      width: 512,
      height: 512,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      this.toggleActivityIndicator();
      fetch(image.path).then((response) => {
        response.blob().then((blob) => {
          const ref = firebase.storage().ref('avatar').child(firebase.auth().currentUser.uid);
          ref.put(blob).then(() => {
            this.toggleActivityIndicator();
            this.updateAvatarURI();
            ToastAndroid.show('Upload sucessful!', ToastAndroid.SHORT);
            this.RBSheet.close();
          })
        })
      })
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Overlay
          isVisible={!this.state.finished}
          width="auto"
          height="auto"
        >
          <ActivityIndicator size='large' color='#eabb33' />
        </Overlay>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>My Profile</Text>
            <Avatar 
              size={120}
              rounded 
              title={firebase.auth().currentUser.displayName[0]}
              source={{ uri: this.state.avatarURI }}
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
            <TouchableOpacity style={styles.menuButton} onPress={this.handleSelectPic}><Text style={styles.menuButtonText}>Upload</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={this.handleNewPhoto}><Text style={styles.menuButtonText}>New Photo</Text></TouchableOpacity>
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
