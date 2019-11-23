import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

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
    borderBottomWidth: 1,
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
          <View style={listStyle.textContainer}>
            {!touchable ? (
              <Text style={listStyle.text}>{item.title}</Text>
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
  },
  {
    title: 'email',
    type: 'evilicon',
    icon: 'envelope',
    style: {
      color: '#C57655',
      ...listStyle.iconStyle,
    },
  },
  {
    title: 'phone',
    icon: 'phone',
    type: 'simple-line-icon',
    style: {
      color: '#c9c9c9',
      ...listStyle.iconStyle,
    },
  },
  {
    title: 'Address',
    type: 'evilicon',
    icon: 'location',
    style: {
      ...listStyle.iconStyle,
      color: '#1A789F',
    },
  },
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
  },
];

const InfoList = () => <ProfileList list={info} />;
const ChoiceList = () => <ProfileList touchable={true} list={choice} />;

export default ProfileList;
export {InfoList, ChoiceList};
