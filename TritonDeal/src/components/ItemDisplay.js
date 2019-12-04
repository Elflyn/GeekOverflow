import React, {Component} from 'react';
import {Icon, Avatar} from 'react-native-elements';
import {StyleSheet, View, Image, Text, Alert, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux'

const TITLE_DISPLAY_OFFSET =20;
const TAG_DISPLAY_OFFSET =4;
export default class ItemDisplay extends Component{

  state={
    //flag if show the item detail
    itemDetail:false
  }

  render(){
    return(
      <TouchableOpacity style={style.container} onPress={() => Actions.detail({...this.props})} activeOpacity={1}>
        <Image source={{uri:this.props.imageSource[0]}}
            style={style.image}/>
        <View style={style.textView}>
          <Text style={style.itemTitle}>{this.props.itemName.slice(0,TITLE_DISPLAY_OFFSET)}</Text>
          <View style={style.tagsView}>
            {
              this.props.tags.slice(0,TAG_DISPLAY_OFFSET).map((tag,i)=>{
                return(
                  <View style={style.tag} key={i}>
                  <Text style={style.tagText}>{tag}</Text>
                  </View>
                );
              })
            }
          </View>
          <Text style={style.price}>${this.props.price}</Text>
          <View style={style.bottomStyle}>
            <Avatar rounded title={this.props.seller} size={35}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

const style = StyleSheet.create({
  container:{
    flexDirection: 'row',
    backgroundColor:"white",
    borderRadius:10,
    margin:5,
    padding:2,
    justifyContent:"center"
  },
  textView:{
    flex:2,
    flexDirection:'column',
    height:130,
    width: 260,
    marginTop:5
  },
  image: {
    flex:1,
    height: "auto",
    width: "auto",
    borderRadius:10,
    margin:5,
  },
  itemTitle:{
    fontSize:20,
    color:"black",
  },
  tagsView:{
    //flex:1,
    padding:1,
    flexDirection:"row",
    flexWrap:"wrap",
    //justifyContent:"space-between"
  },
  tag:{
    padding:3,
    marginRight:10,
    borderRadius:5,
    backgroundColor:"#B6B1A9",
  },
  tagText:{
    color:"black",
  },
  price:{
    flex:1,
    fontSize:24,

  },
  bottomStyle:{
    flexDirection:"row",
    justifyContent:"space-between"
  },
  rightView:{
    flex:1,
    flexDirection:"row-reverse",
    justifyContent:"space-between",
  },
  button:{
    marginLeft:40,
    marginBottom:4,
    height:37,
    width:50,
    borderRadius:5,
  },
});
