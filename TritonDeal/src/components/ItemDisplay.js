import React, {Component} from 'react';
import {Input, Icon, Button,Header,Avatar,Overlay} from 'react-native-elements';
import {StyleSheet,View,Image,Text,Alert,ScrollView,TouchableOpacity} from 'react-native';
import TopNavBar from '../components/TopNavBar'
import message from '../message'
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
        <View>
        <TouchableOpacity style={style.container} onPress={()=>this.setState({itemDetail:true})} activeOpacity={1}>
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
        <Overlay isVisible={this.state.placeBid} onBackdropPress={() => this.setState({ placeBid: false })}
                 overlayStyle={style.overlay}>
          <View>
            <Text style={style.currentBid}>Current bid: {this.props.currentBid}</Text>
            <Text style={style.enterPrompt}>Enter a higher bid:</Text>
            <Input leftIcon={{name:"attach-money"}}
                   keyboardType="numeric"
                   onChangeText={(num)=>this.setState({newBidNum:num})}/>
            <View style={style.overlayButton}>
              <Button title="Place" buttonStyle={style.placeButton} disabled={this.state.newBidNum<=this.props.currentBid}
                      onPress={()=>{Alert.alert("Great! You own the highest bid so far! Keep an eye on your bid!");
                                    this.setState({placeBid:false});
                                    this.setState({itemDetail:false})}}/>
              <Button title="Cancel" buttonStyle={style.cancelButton}
                      onPress={()=>this.setState({placeBid:false})}/>
            </View>
          </View>
        </Overlay>
        <Overlay isVisible={this.state.itemDetail} fullScreen={true}>
          <View>
            <TopNavBar />
            <View style={style.detailTitleRow}>
              <Text style={style.detailTitle}>{this.props.itemName}</Text>
              <View style={style.detailTopIcon}>
              <Button title="Add to chart" buttonStyle={{width:150}} type="clear"/>
                <Icon name="close" onPress={() => this.setState({ itemDetail: false })} size={28}/>
              </View>
            </View>
            <ScrollView horizontal={true} style={style.imageScroll}>
              {this.props.imageSource.map((image)=><Image source={{uri:image}} style={style.multiImage}/>)}
            </ScrollView>
            <View style={{flexDirection:"row"}}>
              <Text style={{fontSize:30,marginTop:5}}>${this.props.price}</Text>
              <View style={{flexDirection:"row-reverse",flex:1}}>
                <Text style={{marginTop:13,paddingLeft:0}}>{this.props.timeleft} left</Text>
                <Icon name="timer" iconStyle={{marginTop:11,marginLeft:2}}/>
                </View>
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
            <View style={{flexDirection:"row", justifyContent: 'center'}}>
              <Button title="Contact Seller" buttonStyle={{margin:10}}/>
              <Button type="solid" title="Bid" buttonStyle={{margin:10,width:100}}
              onPress={()=>this.bidOnClick(this.props.currentBid)} />
            </View>
          </View>
        </Overlay>
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
