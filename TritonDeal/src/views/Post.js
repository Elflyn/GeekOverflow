import React, {Component} from 'react';
import {Input, ListItem, Icon, Button, Divider, Avatar, Badge} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView

} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import GradientButton from '../components/GradientButton';
import InputBox from '../components/InputBox';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '@react-native-firebase/app';
import Dialog from '../components/Dialog'
import {Actions} from 'react-native-router-flux';
import message from '../message'


class Post extends Component {

  state = {
    title: '',
    bid: false,
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
    photos: []
  }

  closeDialog = () => {
    this.setState({isVisible: false});
  }

  handleSentPostSuccess = () => {
    Actions.home();
    this.setState({isVisible: false});
  }

  handleNewPost = () => {
    const user = firebase.auth().currentUser
    const postRef = firebase.database().ref('post')
    const {bid, dateValue, condition, description, title, tags, photos} = this.state
    if (title === '') {
      this.setState({isVisible: true, dialogText: message.POST_MISSING_TITLE, handleDialog: this.closeDialog})
    } else {
      postRef.push({
        "bid": bid,
        "date": dateValue,
        "condition": condition,
        "description": description,
        "title": title,
        "tags": tags,
        "user": user.uid,
        "active": true,
        "photos": photos.length
      }).then(snap => 
        { const key = snap.key;
          photos.forEach((photo, i) => {
            fetch(photo).then(response => {
              response.blob().then(blob => {
                const ref = firebase.storage().ref('postImage').child(`${key}-${i}`)
                ref.put(blob);
                console.log(i)
              })
            })
          })
        });
      this.setState({isVisible: true, dialogText: message.POST_SUCCESS, handleDialog: this.handleSentPostSuccess})
    }
  }

  setDate = (event, date) => {
    date = date || this.state.date;
    var s = this.formatDate(date)
    this.setState({
      showDatePicker: Platform.OS === 'ios' ? true : false,
      date: s,
      dateValue: date
    });
  }

  datePicker = () => {
    this.setState({showDatePicker: true})
  }

  toggleInputBox = () => {
    this.setState({showInputBox: !this.state.showInputBox})
  }

  updateTags = (input) => {
    this.setState({tags: [...this.state.tags, input]})
  }

  removeTag = (index) => {
    let temp = this.state.tags;
    temp = temp.filter((_, i) => i !== index)
    this.setState({tags: temp})
  }

  selectImage = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 300,
      cropping: true,
    }).then(image => {
      this.setState({photos: [...this.state.photos, image.path]})
    });
  }


  formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`
  }
  
  render() {
    const { showDatePicker, date, condition, dateValue, tags, showInputBox, ipnutText, photos} = this.state;
    const conditions = ['good', 'acceptable', 'like new'];
    return (
      <ScrollView>
        <View style={style.upperContainer}>
          <View style={style.section}>
            <Text style={style.title}>Item Title:</Text>
            <Input placeholder="title" onChangeText={value => this.setState({title: value})} />
            <Divider style={style.divider}/>
          </View>
          <View style={style.section}>
            <Text style={style.title}>Upload Photo:</Text>
            <View style={style.photos}>
              {
                photos.map(photo => <Avatar source={{uri: photo}} size="large" />)
              }
              <Avatar containerStyle={style.padding} title="+" size="large" onPress={this.selectImage}/>
            </View>
            <Divider style={style.divider}/>
          </View>
          <View style={style.tagContainer}>
            {
              tags.map((tag, index)=> <Badge 
                onPress={() => this.removeTag(index)}
                badgeStyle={style.badgeStyle}
                containerStyle={style.badge}
                value={tag}
                status="primary"
              />)
            }
            <Avatar
              containerStyle={style.padding}
              rounded title="+" size="small"
              onPress={this.toggleInputBox}
            />
            <Text style={{fontSize: 18, marginLeft: 5, paddingVertical: 5,}}>Add Tag</Text>
          </View>
          <Divider style={style.divider}/>
          <View style={style.section}>
            <Text style={style.title}>Description:</Text>
            <Input placeholder="30 words limit" onChangeText={value => this.setState({description: value})} ></Input>
          </View>
        </View>
        <View>
          <ListItem 
            title="Condition"
            rightElement={
            <Picker
              selectedValue={condition}
              style={{height: 50, width: 100}}
              onValueChange={(value) => this.setState({condition: value})}
            >
              {
                conditions.map((condition, index) => <Picker.Item value={condition} label={condition} key={index} />)
              }
            </Picker>}
          />
          <ListItem 
            title="Bid"
            switch={{
              value: this.state.bid,
              onValueChange: () => this.setState({bid: !this.state.bid})
            }}
          />
          <ListItem 
            title="Expiration Date"
            rightTitle={date}
            onPress={this.datePicker}
          />

        </View>
        <View>
        { showDatePicker && 
          <DateTimePicker 
            value={dateValue}
            mode={'date'}
            is24Hour={true}
            display="spinner"
            onChange={this.setDate}
            minimumDate={new Date()} 
          />
        }       
        </View>
        <GradientButton text='Post' onPress={this.handleNewPost}/>
        <InputBox
          cancel={this.toggleInputBox}
          confirm={(input) => {this.updateTags(input); this.toggleInputBox()}}
          isVisible={showInputBox}
          text='Add Tag'
        />
        <Dialog isVisible={this.state.isVisible} text={this.state.dialogText} onPress={this.state.handleDialog} />
      </ScrollView>
    )
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

  photos:{
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
    color: '#222831'
  },

  padding: {
    marginLeft: 5,
  },

  badge: {
    paddingVertical: 4,
    marginHorizontal: 2,
  },

  badgeStyle: {
    height: 25,
  }

})

export default Post;
