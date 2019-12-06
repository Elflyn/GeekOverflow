import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import { View, TouchableOpacity, StyleSheet, Text, ActivityIndicator, ToastAndroid, Button } from 'react-native';
import { ListItem, Icon, Overlay } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from "react-native-raw-bottom-sheet";

export default class Chat extends React.Component {

  state = {
    messages: [],
    avatarURI: null,
    finished: true
  }

  componentDidMount = async () => {
    this.updateAvatarURI();
    this.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    this.refOff();
  }

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };
  
  updateAvatarURI = async () => {
    const ref = firebase.storage().ref('avatar').child(firebase.auth().currentUser.uid);
    var url;
    try {
      url = await ref.getDownloadURL();
    } catch (error) {
      url = await firebase.storage().ref('avatar').child('defaultAvatar.jpg').getDownloadURL();
    }
    this.setState({ avatarURI: url });
  }

  refOn = (callback) => {
    this.ref.limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  refOff = () => {
    this.ref.off();
  }

  parse = (snapshot) => {
    const { createdAt, text, user, system, image } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot;

    const message = {
      id,
      _id,
      createdAt,
      text,
      user,
      system,
      image
    };

    const rootRef = firebase.database().ref('chat_by_id/' + this.props.chatID);
    if (message.user._id != firebase.auth().currentUser.uid) {
      rootRef.update({ lastRead: true });
    }
    return message;
  };

  send = async (messages) => {
    const cl = Actions.refs.chatList;
    cl.updateList();
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
    const rootRef = firebase.database().ref('chat_by_id/' + this.props.chatID);
    const users = await firebase.database().ref('chat_by_id').child(this.props.chatID).once('value').then(snapshot => {
      return {user1: snapshot.val().user1, user2: snapshot.val().user2}
    })
    const anotherUID = firebase.auth().currentUser.uid === users.user1 ? users.user2 : users.user1;
    rootRef.update({ lastText: messages[messages.length - 1].text, lastTime: this.timestamp, lastRead: false, lastBy: firebase.auth().currentUser.uid });
    var httpRequest = new XMLHttpRequest();
    const requestURI = 'https://us-central1-tritondeal.cloudfunctions.net/sendPushNotification?title=' + firebase.auth().currentUser.displayName + "&msg=" + messages[messages.length - 1].text + "&uid=" + anotherUID
    httpRequest.open('GET', requestURI, true);
    httpRequest.send();
  };

  get ref() {
    return firebase.database().ref('chat_by_id/' + this.props.chatID + '/messages');
  }

  get user() {
    return {
      name: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      avatar: this.state.avatarURI,
      _id: firebase.auth().currentUser.uid,
    };
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  handleSelectPic = () => {
    ImagePicker.openPicker({
      compressImageMaxHeight: 1080,
    }).then(image => {
      this.RBSheet.close();
      this.toggleActivityIndicator();
      fetch(image.path).then((response) => {
        response.blob().then((blob) => {
          const filename = image.path.split('/').pop();
          const ref = firebase.storage().ref('chat_img').child(filename);
          ref.put(blob).then(async () => {
            const url = await ref.getDownloadURL();
            await this.sendImage(url);
            this.toggleActivityIndicator();
            ToastAndroid.show('Upload sucessful', ToastAndroid.SHORT);
          })
        })
      })
    });
  };

  handleNewPhoto = () => {
    ImagePicker.openCamera({
      compressImageMaxHeight: 1080,
    }).then(image => {
      this.RBSheet.close();
      this.toggleActivityIndicator();
      fetch(image.path).then((response) => {
        response.blob().then((blob) => {
          const ref = firebase.storage().ref('chat_img');
          ref.put(blob).then(async () => {
            const url = await ref.getDownloadURL();
            await this.sendImage(url);
            this.toggleActivityIndicator();
            ToastAndroid.show('Upload sucessful', ToastAndroid.SHORT);
          })
        })
      })
    });
  }

  sendImage = async (url) => {
    const cl = Actions.refs.chatList;
    cl.updateList();
    const message = {
      text: '',
      image: url,
      user: this.user,
      createdAt: this.timestamp,
    };
    this.ref.push(message);
    const rootRef = firebase.database().ref('chat_by_id/' + this.props.chatID);
    await rootRef.update({ lastText: '[Image]', lastTime: this.timestamp, lastRead: false, lastBy: firebase.auth().currentUser.uid })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListItem 
          title={this.props.itemName} 
          leftAvatar={{ source: { uri: this.props.imgURI } }}
          rightElement={
            <Button title='Button' />
          }
          subtitle={'$ ' + this.props.price}/>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.send}
          user={this.user}
          showUserAvatar
          maxComposerHeight={40}
          textInputProps={{style: {fontSize: 17, width: 295, marginLeft: 5}}}
          renderActions={() => {
            return (
              <TouchableOpacity
                onPress={() => this.RBSheet.open()}
              >
                <Icon size={35} iconStyle={style.iconStyle} name="image" type="evilicon" />
              </TouchableOpacity>
            )
          }}
        />
        <RBSheet
          ref={ref => this.RBSheet = ref}
          height={150}
          duration={250}
        >
          <View>
            <TouchableOpacity style={style.menuButton} onPress={this.handleSelectPic}><Text style={style.menuButtonText}>Upload</Text></TouchableOpacity>
            <TouchableOpacity style={style.menuButton} onPress={this.handleNewPhoto}><Text style={style.menuButtonText}>New Photo</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => this.RBSheet.close()} style={style.menuButton}><Text style={style.menuButtonText}>Cancel</Text></TouchableOpacity>
          </View>
        </RBSheet>
        <Overlay
          isVisible={!this.state.finished}
          width="auto"
          height="auto"
        >
          <ActivityIndicator size='large' color='#eabb33' />
        </Overlay>
      </View>
    );
  }
}
;
const style = StyleSheet.create({
  iconStyle: {
    color: '#004862',
    paddingBottom: 10,
    paddingLeft: 10
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