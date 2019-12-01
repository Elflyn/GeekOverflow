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

  list = [{
    name: 'Hello',
    message: 'super long message ffffffffffffffffffffffffffffffffffff',
  },
  {
    name: 'World',
    message: 'fadfasd',
  }]

  state = {
    isVisible: false,
    dialogText: 'Enter email',
    email: null
  }

  parse = (snapshot) => {
    const { createdAt, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot;

    const message = {
      id,
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  };

  addChat = () => {
    this.setState({ isVisible: true });
  }

  onPressOK = async () => {
    this.setState({ isVisible: false });
    const currUID = firebase.auth().currentUser.uid;
    var anotherUID = '';
    const uidRef = firebase.database().ref('email_to_uid');
    await uidRef.orderByChild('email').equalTo(this.state.email).once('value').then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        anotherUID = childSnapshot.val().uid;
      })
    }).catch((error) => {
      var errorMessage = error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    });
    var sha1 = require('sha1');
    const messageID = sha1(currUID + anotherUID);
    console.log(messageID);
  }

  get ref() {
    return firebase.database().ref('chat_by_id');
  }

  render() {
    return (
      <View>
        <ScrollView>
          {
            this.list.map((item, i) => (
              <ListItem
                key={i}
                /* avatar : source: { uri: l.avatar_url }*/
                leftAvatar={{ size: 'large', icon: { name: 'user', type: 'font-awesome' } }}
                title={item.name}
                titleStyle={style.title}
                subtitle={<Subtitle message={item.message} />}
                rightElement={<TimeDisplay time="11:30" />}
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

const TimeDisplay = ({ time }) => {
  return (
    <Text style={{ color: 'grey' }}>{time}</Text>
  )
}

const Subtitle = ({ message, description }) => (
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
