import React, {Component} from 'react';
import {Icon, Button} from 'react-native-elements';
import {StyleSheet, View, Image, Text, ScrollView} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import { Actions } from 'react-native-router-flux';
import ChatList from './ChatList';

export default class ItemDetail extends Component {

  componentWillMount = async () => {
    const chatListRef = firebase.database().ref('user_to_chat/' + firebase.auth().currentUser.uid);
    await chatListRef.orderByKey().equalTo(this.props.sellerUID).once('value').then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        this.chatID = '123';
      })
    }).catch(error => {
      console.log(error.message);
    })
  }

  render() {
    return (
      <View>
        <View>
          <View style={style.detailTitleRow}>
            <Text style={style.detailTitle}>{this.props.itemName}</Text>
            <View style={style.detailTopIcon}>
          </View>
          </View>
          <ScrollView horizontal={true} style={style.imageScroll}>
            {this.props.imageSource.map(image =><Image source={{uri:image}} style={style.multiImage}/>)}
          </ScrollView>
          <View style={{flexDirection:"row"}}>
            <Text style={{fontSize:30,marginTop:5}}>${this.props.price}</Text>
          </View>
          <ScrollView style={{height:160,marginTop:10}}>
            <View style={style.detailTagsView}>
              {
                this.props.tags.map((tag,i)=>{
                  return(
                    <View style={style.detailTag} key={i}>
                    <Text style={style.detailTagText}>{tag}</Text>
                    </View>
                  );
                })
              }
            </View>
            <Text style={{fontSize:18,padding:5}}>{this.props.description}</Text>
          </ScrollView>
          <ActionButtons passProps={this.props} cid={this.chatID}/>
        </View>
      </View>
    )
  }
}

const ActionButtons = (passProps) => {
  return (passProps.passProps.sellerUID != firebase.auth().currentUser.uid) ?
    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
      <Button title="Contact Seller" buttonStyle={{ margin: 10 }} onPress={() => {
        var chatID;
        if (!passProps.cid) {
          const cl = new ChatList();
          chatID = cl.createChat(firebase.auth().currentUser.uid, passProps.passProps.sellerUID, passProps.passProps.imageSource[0], passProps.passProps.itemName, passProps.passProps.price);
        } else {
          chatID = passProps.cid;
        }
        Actions._chatList();
        Actions.chat({ title: passProps.passProps.username, chatID: chatID, imgURI: passProps.passProps.imageSource[0], itemName: passProps.passProps.itemName, price: passProps.passProps.price })
      }} />
      <Button title="Add to Cart" buttonStyle={{ margin: 10 }} />
    </View>
    : <View style={{ flexDirection: "row", justifyContent: 'center' }}>
      <Button title="Cancel this listing" buttonStyle={{ margin: 10 }} />
    </View>
}

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
    borderRadius:5,
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
    height: 280,
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
