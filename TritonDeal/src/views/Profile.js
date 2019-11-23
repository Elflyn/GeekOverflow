import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {InfoList, ChoiceList} from '../components/ProfileList';

export default class UserProfileView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>My Profile</Text>
            <Image
              style={styles.avatar}
              source={{
                uri:
                  'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/54519275_630941387367096_5376254316682149888_o.jpg?_nc_cat=105&_nc_oc=AQka3xZuK6vCwU2fyykoP52RbX3tWm-NOcZuB-hPyvfDylY-HcML6yZDQjMxybkFDv4&_nc_ht=scontent-lax3-1.xx&oh=fd4f9134ee28cfa4ad557abd1e7e8897&oe=5E3F0B06',
              }}
            />
          </View>
        </View>
        <Button
          icon={<Icon name="edit" type="font-awesome" color="#005688" />}
          iconLeft
          titleStyle={editButtonStyle.title}
          buttonStyle={editButtonStyle.button}
          title="Edit Profile"
        />
        <View style={styles.background}>
          <InfoList />
          <ChoiceList />
        </View>
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
    width: 130,
    height: 125,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },

  headerText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
});
