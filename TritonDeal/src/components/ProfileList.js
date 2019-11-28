import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ToastAndroid} from 'react-native';
import {Icon} from 'react-native-elements';
import { firebase } from '@react-native-firebase/auth';

const listStyle = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    marginTop: 12,
  },

  text: {
    fontSize: 15,
  },

  textContainer: {
    marginLeft: 15,
    height: '100%',
    borderBottomColor: '#f2eee5',

    width: '100%',
    paddingVertical: 15,
  },

  iconStyle: {
    alignSelf: 'flex-start',
    paddingLeft: 30,
    paddingVertical: 17,
  },

  rowContainer: {
    flexDirection: 'row',
  },

  button: {
    flexDirection: 'row',
  },

  buttonIcon: {
    alignSelf: 'flex-end',
  },
});

const ProfileList = ({touchable, list}) => {
  return (
    <View style={listStyle.background}>
      {list.map((item, i) => (
        <View style={listStyle.rowContainer}>
          <Icon iconStyle={item.style} name={item.icon} type={item.type} />
          <View style={[listStyle.textContainer, {borderBottomWidth: item.last ? 0 : 1}]}>
            {!touchable ? (
              <Text style={[listStyle.text, {color: item.verified ? 'black' : 'red'}]}>{item.title}</Text>
            ) : (
              <TouchableOpacity style={listStyle.button}>
                <Text style={listStyle.text}>{item.title}</Text>
                <Icon
                  style={listStyle.buttonIcon}
                  name="keyboard-arrow-right"
                  type="MaterialIcons"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const info = [
  {
    title: 'Name',
    type: 'evilicon',
    icon: 'user',
    style: {
      ...listStyle.iconStyle,
    },
    verified: true
  },
  {
    title: 'Email',
    type: 'evilicon',
    icon: 'envelope',
    style: {
      color: '#C57655',
      ...listStyle.iconStyle,
    },
    last: true,
    verified: false
  }
];

const choice = [
  {
    title: 'My Cart',
    type: 'evilicon',
    icon: 'cart',
    style: {
      color: '#1C7AA0',
      ...listStyle.iconStyle,
    },
  },
  {
    title: 'My Post',
    icon: 'comment',
    type: 'evilicon',
    style: {
      color: '#F9B300',
      ...listStyle.iconStyle,
    },
  },
  {
    title: 'My Purchase',
    type: 'evilicon',
    icon: 'credit-card',
    style: {
      ...listStyle.iconStyle,
      color: 'black',
    },
    last: true
  },
];

export class InfoList extends React.Component {
  
  constructor(props) {
    super(props);
    this.updateUserInfo();
  }

  componentWillUpdate = () => {
    this.updateUserInfo();
  }

  updateUserInfo = () => {
    var user = firebase.auth().currentUser;
    info[0].title = user.displayName;
    info[1].title = user.email;
    info[1].verified = user.emailVerified;
  }

  render() {
    return (
      <ProfileList list={info} />
    );
  }
}

const ChoiceList = () => <ProfileList touchable={true} list={choice} />;

export default ProfileList;
export {ChoiceList};
