import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import { View, ToastAndroid, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

export default class Chat extends React.Component {

  state = {
    messages: [],
    avatarURI: null
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
    const { createdAt, text, user, system } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot;

    const message = {
      id,
      _id,
      createdAt,
      text,
      user,
      system
    };
    return message;
  };

  send = (messages) => {
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
    rootRef.update({ lastText: messages[messages.length - 1].text, lastTime: this.timestamp })
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListItem 
          title={this.props.itemName} 
          leftAvatar={{ source: { uri: this.props.imgURI } }}
          rightElement 
          subtitle={'$ ' + this.props.price}/>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.send}
          user={this.user}
          showUserAvatar
          multiline={false}
        />
      </View>
    );
  }
}
;
const styles = StyleSheet.create({
});