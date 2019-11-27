import React, {Component} from 'react';
import {Input, Icon, Button,Header,Avatar} from 'react-native-elements';
import {StyleSheet,View,Image,Text} from 'react-native';
const TITLE_DISPLAY_OFFSET =20;
const TAG_DISPLAY_OFFSET =4;
export default class ItemDisplay extends Component{
  constructor(){
    super();
  }
  render(){
    return(
      <View style={style.container}>
        <Image source = {{uri:this.props.imageSource}}
            style  = {style.image}/>
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
              <Button type="solid" title="BID" buttonStyle={style.button} />
            </View>
          </View>
        </View>
      </View>
    );
  }
};

const style = StyleSheet.create({
  container:{
    flexDirection: 'row',
    borderWidth:1,
    borderColor:"white",
    borderRadius:1,
    elevation:1,
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
    borderRadius:5
  },
  timer:{
    marginLeft:15,
    marginTop:7,
    marginRight:0
  },
  countdown:{
    flex:1,
    margin:10
  }
});
