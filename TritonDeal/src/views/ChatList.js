import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ScrollView, ToastAndroid, RefreshControl, Dimensions } from 'react-native';
import { Overlay, Icon, Input } from 'react-native-elements';
import { ListItem, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import GradientButton from "../components/GradientButton";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';

export default class ChatList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      dialogText: 'Enter email',
      email: null,
      list: [],
      isRefreshing: false
    }
  }  

  componentDidMount = () => {
    if (this.props.initList) {
      this.setState({ list: this.props.initList })
    }
    this.refOn((chatListItem) => {
      var newList = [...this.state.list, chatListItem];
      newList.sort((a, b) => { return b.lastTime - a.lastTime })
      this.setState({list: newList});
    });
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
        imgURI = childSnapshot.val().img;
        itemName = childSnapshot.val().itemName;
        price = childSnapshot.val().price;
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
      lastTime: lastTime,
      chatID: chatID,
      imgURI: imgURI,
      itemName: itemName,
      price: price
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

  updateList = async () => {
    const snapshot = await this.chatListRef.once('value');
    const toWait = [];
    snapshot.forEach(async childSnapshot => {
      toWait.push(this.parse(childSnapshot));
    })
    const list = await Promise.all(toWait);
    list.sort((a, b) => { return b.lastTime - a.lastTime })
    this.setState({ list: list });
  }

  getList = async () => {
    const snapshot = await this.chatListRef.once('value');
    const toWait = [];
    snapshot.forEach(async childSnapshot => {
      toWait.push(this.parse(childSnapshot));
    })
    const list = await Promise.all(toWait);
    list.sort((a, b) => {return b.lastTime - a.lastTime})
    return list;
  }

  refOn = async (callback) => {
    var list_num = this.state.list.length;
    var event_count = 0
    this.chatListRef.on('child_added', async snapshot => {
      if (event_count >= list_num) {
        callback(await this.parse(snapshot));
      }
      event_count += 1;
    });
    this.chatByIdRef.on('child_changed', async snapshot => {
      this.updateList();
    })
  }

  refOff = () => {
    this.chatListRef.off();
  }

  onPressOK = async () => {
    this.setState({ isVisible: false });
    if (this.state.email) {
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
      if (!anotherUID) {
        ToastAndroid.show('User not found!', ToastAndroid.SHORT);
      } else {
        this.createChat(currUID, anotherUID, null)
      }
    }
  }

  createChat = (currUID, anotherUID, firstImgUrl, itemName, price) => {
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
      img: firstImgUrl,
      itemName: itemName,
      price: price
    }
    const chatRef = this.chatByIdRef.push(chat);
    const chatListRef = firebase.database().ref('user_to_chat');
    chatListRef.child(currUID).push({
      chatID: chatRef.key,
      //anotherUID: anotherUID
    });
    chatListRef.child(anotherUID).push({
      chatID: chatRef.key,
      //anotherUID: currUID
    });
    return chatRef.key;
  }

  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    await this.updateList();
    this.setState({ isRefreshing: false });
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
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh} />
        }
          style={{ height: Dimensions.get('window').height }}
        >
          {
            this.state.list.map((item, i) => (
              <ListItem
                key={i}
                leftAvatar={{ size: 65, source: { uri: item.avatar } }}
                title={item.name}
                titleStyle={style.title}
                subtitle={<Subtitle message={item.message} timeString={getTimeString(item.lastTime)} />}
                rightAvatar={{ size: 65, source: { uri: item.imgURI } }}
                onPress={() => {
                  Actions.chat({ title: item.name, chatID: item.chatID, imgURI: item.imgURI, itemName: item.itemName, price: item.price })
                }}
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

const TimeDisplay = ({ time }) => {
  return (
    <Text style={{ color: 'grey' }}>{getTimeString(time)}</Text>
  )
}

const getTimeString = (timestamp) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  return new Date(timestamp).toLocaleTimeString("en-US").slice(0, 5);
}

const Subtitle = ({ message, timeString }) => (
  <View>
    <Text style={style.message} numberOfLines={2}>{message}</Text>
    <Text style={style.time} numberOfLines={2}>{timeString}</Text>
  </View>
)

const style = StyleSheet.create({
  message: {
    fontSize: 16,
  },

  title: {
    fontSize: 20,
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
  time: {
    fontSize: 12,
    color: 'gray'
  }
})
