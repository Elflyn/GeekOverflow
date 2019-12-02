import React, {Component} from 'react';
import {Input, Icon, Button,Header,Avatar} from 'react-native-elements';
import {StyleSheet,View,Image,Text,Picker} from 'react-native';
export default class TopNavBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      location: 'UCSD'
    }
  }
  render(){
    return(
      <View style={style.container}>
        <View style={style.leftView}>
          <Icon name="room" size={20} iconStyle={style.pinStyle} />
          {/* <Picker
            mode = "dropdown"
            selectedValue={this.state.location}
            style={style.Picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({location: itemValue})
            }>
            <Picker.Item label="UCSD" value="UCSD"/>
            <Picker.Item label="CV" value="CV" />
          </Picker> */}
        </View>
        <View style={style.rightVIew}>
          <Icon type="font-awesome" name="calendar-check-o" color = "#006A96" iconStyle={style.calendar}/>
          <Icon type="entypo" name="shopping-cart" color = "#006A96" />
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create(
  {
    container:{
      flexDirection:"row",
      justifyContent:"space-evenly"
    },
    leftView:{
      flex:1,
      flexDirection:"row",
    },
    rightVIew:{
      flex:1,
      flexDirection:"row-reverse",
      marginRight:20
    },
    Picker:{
      height:30,
      width:150,
      padding:0,
      alignItems:"center"
    },
    pinStyle:{
      marginTop:4,
    },
    calendar:{
      marginLeft:20,
      marginRight:10
    }
  }
)
