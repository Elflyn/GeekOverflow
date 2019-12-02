import React, {Component} from 'react';
import {Icon, Avatar} from 'react-native-elements';
import {StyleSheet, View, Image, Text, Alert, TouchableOpacity} from 'react-native';
import TopNavBar from '../components/TopNavBar'
import message from '../message'
import {Actions} from 'react-native-router-flux'

const TITLE_DISPLAY_OFFSET =20;
const TAG_DISPLAY_OFFSET =4;
export default class ItemDisplay extends Component{
  constructor(){
    super();
    this.state={
      //flag if the bid overlay shows
      placeBid:false,
      //if newBidNum<currentBid, place button is not available
      newBidNum:0,
      //flag if show the item detail
      itemDetail:false
    }
    this.bidOnClick=this.bidOnClick.bind(this)
  }

  bidOnClick(currentBid)
  {
      Alert.alert('Current Bid: $'+currentBid,message.BID_PROMPT,
      [
        {text:'Join', onPress:()=>{
          this.setState({placeBid:true})
        }},
        {text:'Cancel'}
      ]);
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
            <View style={style.rightView}>
              <Text style={style.countdown}>{this.props.timeleft} left</Text>
              <Icon name="timer" iconStyle={style.timer}/>
            </View>
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
  timer:{
    marginLeft:15,
    marginTop:7,
    marginRight:0
  },
  countdown:{
    flex:1,
    margin:10
  },
  overlay:{
    width:250,
    height:250
  },
  currentBid:{
    fontSize:20,
    margin:10
  },
  enterPrompt:{
    fontSize:17,
    margin:10
  },
  overlayButton:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
    marginTop:20
  },
  placeButton:{
    width:70
  },
  cancelButton:{
    width:70
  },
  detailTitleRow:{
    flexDirection:"row",
  },
  detailTitle:{
    flex:1,
    fontSize:30,
    margin:5
  },
  detailTopIcon:{
    flex:0.2,
    flexDirection:"row",
    justifyContent:"flex-end",
    marginTop:12,
  },
  imageScroll:{
    borderBottomWidth:1,
    borderColor:"#747678",
    padding:2,
  },
  multiImage:{
    width:370,
    height:270,
    margin:10,
    alignSelf:"center"
  },
  detailTagsView:{
    //flex:1,
    paddingLeft:5,
    paddingRight:5,
    flexDirection:"row",
    flexWrap:"wrap",
    //justifyContent:"space-between"
  },
  detailTag:{
    padding:1,
    marginTop:5,
    marginRight:10,
    borderRadius:5,
    backgroundColor:"#B6B1A9",
  },
  detailTagText:{
    color:"black",
    fontSize:22
  },

});
