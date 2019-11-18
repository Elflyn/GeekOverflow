import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {ListItem, Icon, Button} from 'react-native-elements';

export default class UserProfileView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              style={styles.avatar}
              source={{
                uri:
                  'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/54519275_630941387367096_5376254316682149888_o.jpg?_nc_cat=105&_nc_oc=AQka3xZuK6vCwU2fyykoP52RbX3tWm-NOcZuB-hPyvfDylY-HcML6yZDQjMxybkFDv4&_nc_ht=scontent-lax3-1.xx&oh=fd4f9134ee28cfa4ad557abd1e7e8897&oe=5E3F0B06',
              }}
            />
            <Text style={styles.name}>Michael Yao </Text>
          </View>
        </View>
        <Button title="Edit Profile" />
        <List />

        <Button
          icon={<Icon name="shopping-cart" size={20} color="white" />}
          title="My Cart"
        />
        <Button
          icon={<Icon name="inbox" size={20} color="white" />}
          title="My Post"
        />
        <Button
          icon={<Icon name="list" size={20} color="white" />}
          title="My Purchase"
        />
      </View>
    );
  }
}

const List = () => {
  const list = [
    // {
    //     title: 'Michael yao',
    //     icon: 'verified-user'
    // },
    {
      title: 'michael@gmail.com',
      icon: 'email',
    },
    {
      title: '123455677',
      icon: 'phone',
    },
    {
      title: '1234 Caminito Sueno',
      icon: 'navigation',
    },
  ];
  return (
    <View style={styles.list}>
      {list.map((item, i) => (
        <ListItem
          key={i}
          title={item.title}
          leftIcon={{name: item.icon}}
          bottomDivider
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'grey',
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 16,
    color: '#778899',
    fontWeight: '600',
  },
  body: {
    backgroundColor: '#778899',
    height: 500,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  iconContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: '#FFFFFF',
  },
  list: {
    marginBottom: 50,
  },
});
