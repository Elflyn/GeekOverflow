import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { Overlay, Icon, Input } from 'react-native-elements';
import { ListItem, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import GradientButton from "../components/GradientButton";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';

export default class ChatList extends React.Component {

  state = {
    isVisible: false,
    dialogText: 'Enter email',
    email: null,
    list: []
  }

  componentDidMount = () => {
    this.refOn((chatListItem) => {
      console.log(chatListItem)
      this.setState(prevState => ({
        list: [...prevState.list, chatListItem]
      }))
    })
  }

  componentWillUnmount() {
    this.refOff();
  }

  parse = async (snapshot) => {
    const { chatID: chatID } = snapshot.val();
    const chatRef = firebase.database().ref('chat_by_id');
    var title, message, lastTime, anotherUID;
    await chatRef.orderByKey().equalTo(chatID).once('value').then(async (snapshot) => {
      snapshot.forEach(async childSnapshot => {
        if (childSnapshot.val().user1 === firebase.auth().currentUser.uid) {
          anotherUID = childSnapshot.val().user2;
        } else {
          anotherUID = childSnapshot.val().user1;
        }
        title = await this.getTitle(anotherUID);
        message = childSnapshot.val().lastText;
        lastTime = childSnapshot.val().lastTime;
      });
    }).catch((error) => {
      var errorMessage = error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    });
    const avatarURI = await this.getAvatar(anotherUID);
    const chatListItem = {
      name: title,
      message: message,
      avatar: avatarURI,
      lastTime: lastTime
    }
    return chatListItem;
  };

  getAvatar = async (uid) => {
    const ref = firebase.storage().ref('avatar').child(uid);
    var url;
    try {
      url = await ref.getDownloadURL();
    } catch (error) {
      url = await firebase.storage().ref('avatar').child('defaultAvatar.jpg').getDownloadURL();
    }
    return url;
  }

  getTitle = async (uid) => {
    var title;
    const uidRef = firebase.database().ref('users');
    await uidRef.orderByChild('uid').equalTo(uid).once('value').then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        title = childSnapshot.val().username;
      })
    }).catch((error) => {
      var errorMessage = error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    });
    return title;
  }

  addChat = () => {
    this.setState({ isVisible: true });
  }

  refOn = async (callback) => {
    this.chatListRef.on('child_added', async snapshot => callback(await this.parse(snapshot)));
  }

  refOff = () => {
    this.chatListRef.off();
  }

  onPressOK = async () => {
    this.setState({ isVisible: false });
    const currUID = firebase.auth().currentUser.uid;
    var anotherUID = '';
    const uidRef = firebase.database().ref('users');
    await uidRef.orderByChild('email').equalTo(this.state.email).once('value').then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        anotherUID = childSnapshot.val().uid;
      })
    }).catch((error) => {
      var errorMessage = error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    });
    this.createChat(currUID, anotherUID)
  }

  createChat = (currUID, anotherUID) => {
    const chat = {
      user1: currUID,
      user2: anotherUID,
      messages: [
        {
          text: 'Chat started',
          createdAt: this.timestamp,
          system: true,
        }
      ],
      lastText: 'Chat started',
      lastTime: this.timestamp,
    }
    const chatRef = this.chatByIdRef.push(chat);
    const chatListRef = firebase.database().ref('user_to_chat');
    chatListRef.child(currUID).push({ 
      chatID: chatRef.key,
      anotherUID: anotherUID,
     });
    chatListRef.child(anotherUID).push({
      chatID: chatRef.key,
      anotherUID: anotherUID,
    });
  }

  get chatByIdRef() {
    return firebase.database().ref('chat_by_id');
  }

  get chatListRef() {
    return firebase.database().ref('user_to_chat/' + firebase.auth().currentUser.uid);
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  render() {
    return (
      <View>
        <ScrollView>
          {
            this.state.list.map((item, i) => (
              <ListItem
                key={i}
                leftAvatar={{ size: 'medium', source: { uri: item.avatar } }}
                title={item.name}
                titleStyle={style.title}
                subtitle={<Subtitle message={item.message} style={style.message}/>}
                rightElement={<TimeDisplay time={item.lastTime} />}
                onPress={() => Actions.chat({ title: item.name })}
              />))
          }
        </ScrollView>
        <Overlay style={style.box}
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(255, 255, 255, .8)"
          overlayBackgroundColor="white"
          width={350}
          height="auto"
        >
          <View>
            <Text style={style.centerText}>{this.state.dialogText}</Text>
            <Input
              placeholder="Email"
              leftIcon={
                <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
              }
              onChangeText={(value) => this.setState({ email: value })}
            />
            <GradientButton
              text={"OK"}
              onPress={this.onPressOK}
            />
          </View>
        </Overlay>
      </View>
    )
  }
}

const TimeDisplay = ({time}) => {
  return (
    <Text style={{ color: 'grey' }}>{getTimeString(time)}</Text>
  )
}

const getTimeString = (timestamp) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  return new Date(timestamp).toLocaleTimeString("en-US").slice(0, 5);
}

const Subtitle = ({ message }) => (
  <View>
    <Text style={style.message} numberOfLines={2}>{message}</Text>
  </View>
)

const style = StyleSheet.create({
  message: {
    fontSize: 16,
  },

  title: {
    fontSize: 21,
  },

  centerText: {
    textAlign: 'center',
    fontSize: 20,
    paddingRight: 30,
    paddingLeft: 30,
  },
  box: {
    height: 40,
    width: 30,
  },
  iconStyle: {
    marginRight: 15,
    color: '#004862',
  },
})
