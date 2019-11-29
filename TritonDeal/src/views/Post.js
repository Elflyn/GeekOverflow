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

class Post extends Component {

  state = {
    title: '',
    bid: false,
    date: '10-10-2020',
    condition: 'good',
    showDatePicker: false,
    dateValue: new Date(),
    tags: ['hello', 'world', 'abc'],
    showInputBox: false,
    ipnutText: '',
    description: '',
    photos: [],
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
      height: 512,
      cropping: true,
    }).then(image => {
      console.log(image)
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
        <GradientButton text='Post'/>
        <InputBox
          cancel={this.toggleInputBox}
          confirm={(input) => {this.updateTags(input); this.toggleInputBox()}}
          isVisible={showInputBox}
          text='Add Tag'
        />
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
