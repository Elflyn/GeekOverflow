import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Icon, Button, Avatar} from 'react-native-elements';
import {InfoList, ChoiceList} from '../components/ProfileList';
import {Actions} from 'react-native-router-flux';

export default class UserProfileView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>My Profile</Text>
            <Avatar 
              size={120}
              rounded 
              /*source={image uri}*/ 
              icon={{name: 'user', type: 'font-awesome'}} 
              containerStyle={styles.avatar}
              showEditButton
              /*onEditPress={} */
            />
          </View>
        </View>
        <Button
          icon={<Icon name="edit" type="font-awesome" color="#005688" />}
          iconLeft
          titleStyle={editButtonStyle.title}
          buttonStyle={editButtonStyle.button}
          title="Edit Profile"
          onPress={() => Actions.editProfile()}
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
    marginBottom: 15,
  },

  headerText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
});
