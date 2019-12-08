import React, {Component} from 'react';
import {
  Input,
  ListItem,
  Overlay,
  Divider,
  Avatar,
  Badge,
} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import GradientButton from '../components/GradientButton';
import InputBox from '../components/InputBox';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import Dialog from '../components/Dialog';
import {Actions} from 'react-native-router-flux';
import message from '../message';

class Post extends Component {
  state = {
    title: '',
    date: '10-10-2020',
    condition: 'good',
    showDatePicker: false,
    dateValue: new Date(),
    tags: [],
    showInputBox: false,
    ipnutText: '',
    description: '',
    photos: [],
    isVisible: false,
    dialogText: '',
    handleDialog: this.closeDialog,
    finished: true,
    price: 0,
  };

  closeDialog = () => {
    this.setState({
      isVisible: false,
    });
  };

  handleSentPostSuccess = () => {
    Actions.pop();
    this.setState({
      isVisible: false,
      title: '',
      date: '10-10-2020',
      condition: 'good',
      showDatePicker: false,
      dateValue: new Date(),
      tags: [],
      showInputBox: false,
      ipnutText: '',
      description: '',
      photos: [],
      dialogText: '',
      handleDialog: this.closeDialog,
      finished: true,
      price: 0,
    });
  };

  handleNewPost = () => {
    const user = firebase.auth().currentUser;
    const postRef = firebase.database().ref('post');
    const {
      dateValue,
      condition,
      description,
      title,
      tags,
      photos,
      price,
    } = this.state;
    if (title === '') {
      this.setState({
        isVisible: true,
        dialogText: message.POST_MISSING_TITLE,
        handleDialog: this.closeDialog,
      });
    } else if (tags.length === 0) {
      this.setState({
        isVisible: true,
        dialogText: message.POST_MISSING_TAG,
        handleDialog: this.closeDialog,
      });
    } else if (photos.length === 0) {
      this.setState({
        isVisible: true,
        dialogText: message.POST_MISSING_PHOTO,
        handleDialog: this.closeDialog,
      });
    } else {
      this.setState({finished: false});
      const snap = postRef.push({
        date: dateValue,
        condition: condition,
        description: description,
        title: title,
        tags: tags,
        user: user.uid,
        active: true,
        photos: photos.length,
        price: price,
        username: user.displayName,
      });
      const key = snap.key;
      photos.forEach((photo, i) => {
        fetch(photo).then(response => {
          response.blob().then(blob => {
            const ref = firebase
              .storage()
              .ref('postImage')
              .child(`${key}-${i}`);
            ref.put(blob);
          });
        });
      });
      const postListRef = firebase.database().ref('user_to_post/' + user.uid);
      postListRef.push({
        post: key,
      });
      this.setState({
        isVisible: true,
        dialogText: message.POST_SUCCESS,
        handleDialog: this.handleSentPostSuccess,
        finished: true,
      });
    }
  };

  setDate = (event, date) => {
    date = date || this.state.date;
    var s = this.formatDate(date);
    this.setState({
      showDatePicker: Platform.OS === 'ios' ? true : false,
      date: s,
      dateValue: date,
    });
  };

  datePicker = () => {
    this.setState({showDatePicker: true});
  };

  toggleInputBox = () => {
    this.setState({showInputBox: !this.state.showInputBox});
  };

  updateTags = input => {
    this.setState({tags: [...this.state.tags, input]});
  };

  removeTag = index => {
    let temp = this.state.tags;
    temp = temp.filter((_, i) => i !== index);
    this.setState({tags: temp});
  };

  selectImage = () => {
    ImagePicker.openPicker({
      compressImageMaxHeight: 1080,
    }).then(image => {
      this.setState({photos: [...this.state.photos, image.path]});
    });
  };

  formatDate = date => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  render() {
    const {
      showDatePicker,
      date,
      condition,
      dateValue,
      tags,
      showInputBox,
      title,
      photos,
      price,
    } = this.state;
    const conditions = ['Brand New', 'Like New', 'Used', 'Acceptable'];
    return (
      <ScrollView>
        <View style={style.upperContainer}>
          <View style={style.section}>
            <Text style={style.title}>Item Title:</Text>
            <Input
              value={title}
              placeholder="Title"
              onChangeText={value => this.setState({title: value})}
            />
            <Text style={style.title}>Price:</Text>
            <Input
              value={price}
              keyboardType={'numeric'}
              placeholder="Price"
              onChangeText={value => this.setState({price: value})}
            />
            <Divider style={style.divider} />
          </View>
          <View style={style.section}>
            <Text style={style.title}>Upload Photo:</Text>
            <View style={style.photos}>
              {photos.map(photo => (
                <Avatar source={{uri: photo}} size="large" />
              ))}
              <Avatar
                containerStyle={style.padding}
                title="+"
                size={"large"}
                onPress={this.selectImage}
              />
            </View>
            <Divider style={style.divider} />
          </View>
          <View style={style.tagContainer}>
            {tags.map((tag, index) => (
              <Badge
                onPress={() => this.removeTag(index)}
                badgeStyle={style.badgeStyle}
                textStyle={{fontSize: 18}}
                containerStyle={style.badge}
                value={tag}
                status="primary"
              />
            ))}
            <Avatar
              containerStyle={style.padding}
              rounded
              title="+"
              size="18"
              onPress={this.toggleInputBox}
            />
            <Text style={{fontSize: 18, marginLeft: 5, paddingVertical: 5}}>
              Add Tag
            </Text>
          </View>
          <Divider style={style.divider} />
          <View style={style.section}>
            <Text style={style.title}>Description:</Text>
            <Input
              maxLength={300}
              placeholder="Put description for your item"
              onChangeText={value => this.setState({description: value})}
            />
          </View>
        </View>
        <View>
          <ListItem
            title="Condition"
            rightElement={
              <Picker
                selectedValue={condition}
                style={{height: 50, width: '41%'}}
                onValueChange={value => this.setState({condition: value})}>
                {conditions.map((condition, index) => (
                  <Picker.Item
                    value={condition}
                    label={condition}
                    key={index}
                  />
                ))}
              </Picker>
            }
          />
          <ListItem
            title="Expiration Date"
            rightTitle={date}
            onPress={this.datePicker}
          />
        </View>
        <View style={{marginBottom: 50}}>
          {showDatePicker && (
            <DateTimePicker
              value={dateValue}
              mode={'date'}
              is24Hour={true}
              display="spinner"
              onChange={this.setDate}
              minimumDate={new Date()}
            />
          )}
          <GradientButton text="Post" onPress={this.handleNewPost} />
        </View>

        <InputBox
          cancel={this.toggleInputBox}
          confirm={input => {
            this.updateTags(input);
            this.toggleInputBox();
          }}
          isVisible={showInputBox}
          text="Add Tag"
        />
        <Dialog
          isVisible={this.state.isVisible}
          text={this.state.dialogText}
          onPress={this.state.handleDialog}
        />
        <Overlay isVisible={!this.state.finished} width="auto" height="auto">
          <ActivityIndicator size="large" color="#eabb33" />
        </Overlay>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  upperContainer: {
    backgroundColor: 'white',
    marginBottom: 20,
  },

  section: {
    marginVertical: 5,
  },

  tagContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },

  photos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  divider: {
    backgroundColor: 'grey',
    marginTop: 10,
  },

  title: {
    fontSize: 16,
    marginBottom: 3,
    paddingLeft: 10,
    color: '#222831',
  },

  padding: {
    marginLeft: 5,
    marginTop: 3,
  },

  badge: {
    marginTop: 1,
    paddingVertical: 4,
    marginHorizontal: 2,
  },

  badgeStyle: {
    height: 30,
  },
});

export default Post;
