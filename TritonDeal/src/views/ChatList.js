import React from 'react';
import { StyleSheet, View, Text, ScrollView, ToastAndroid, RefreshControl, Dimensions } from 'react-native';
import { Overlay, Icon, Input } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
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
    var title, message, lastTime, anotherUID, imgURI, itemName, price, lastRead, lastBy, sellerUID, postID;
    await chatRef.orderByKey().equalTo(chatID).once('value').then(async (snapshot) => {
      snapshot.forEach(async childSnapshot => {
        sellerUID = childSnapshot.val().user2;
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
        lastRead = childSnapshot.val().lastRead;
        lastBy = childSnapshot.val().lastBy;
        postID = childSnapshot.val().postID;
      });
    }).catch((error) => {
      var errorMessage = error.message;
      //ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
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
      price: price,
      read: lastRead,
      sellerUID: sellerUID,
      postID: postID,
    }
    const postRef = firebase.database().ref('post');
    const active = await postRef.child(chatListItem.postID).once('value').then(snapshot => {
      return snapshot.val().active;
    })
    chatListItem.active = active;
    if (lastBy == firebase.auth().currentUser.uid) {
      chatListItem.read = true;
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
    var list_num;
    if (this.props.initList.length) {
      list_num = this.props.initList.length;
    } else {
      list_num = 0;
    }
    var event_count = 0;
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

  createChat = (currUID, anotherUID, firstImgUrl, itemName, price, postID) => {
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
      price: price,
      lastRead: false,
      postID: postID,
    }
    const chatRef = this.chatByIdRef.push(chat);
    const chatListRef = firebase.database().ref('user_to_chat');
    chatListRef.child(currUID).push({
      chatID: chatRef.key,
      anotherUID: anotherUID
    });
    chatListRef.child(anotherUID).push({
      chatID: chatRef.key,
      anotherUID: currUID
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
      this.state.list.length != 0 ?
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
              (!item.read) ?
              <ListItem
                key={i}
                leftAvatar={{ size: 65, source: { uri: item.avatar } }}
                title={item.name}
                titleStyle={style.title}
                subtitle={<Subtitle message={item.message} timeString={getTimeString(item.lastTime)} />}
                rightAvatar={{ size: 65, source: { uri: item.imgURI } }}
                onPress={() => {
                  Actions.chat({ title: item.name, chatID: item.chatID, imgURI: item.imgURI, itemName: item.itemName, price: item.price, sellerUID: item.sellerUID, postID: item.postID, active: item.active })
                  firebase.database().ref('chat_by_id/' + item.chatID).update({lastRead: true});
                }}
                badge
              /> :
                <ListItem
                  key={i}
                  leftAvatar={{ size: 65, source: { uri: item.avatar } }}
                  title={item.name}
                  titleStyle={style.title}
                  subtitle={<Subtitle message={item.message} timeString={getTimeString(item.lastTime)} />}
                  rightAvatar={{ size: 65, source: { uri: item.imgURI } }}
                  onPress={() => {
                    Actions.chat({ title: item.name, chatID: item.chatID, imgURI: item.imgURI, itemName: item.itemName, price: item.price, sellerUID: item.sellerUID, postID: item.postID, active: item.active })
                  }}
                />
              ))
          }
        </ScrollView>
      </View>
      :
      <Text style={style.text}>No active chat</Text>
    )
  }
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
  },
  text: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 18,
    marginTop: 50
  },
})
