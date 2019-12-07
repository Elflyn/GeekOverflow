import React, {Component} from 'react';
import {SearchBar,Overlay,Icon,ListItem, ThemeProvider} from 'react-native-elements'
import {View,TouchableOpacity,FlatList,StyleSheet, RefreshControl, ScrollView, Dimensions} from 'react-native';
import ItemDisplay from '../components/ItemDisplay'
import TopNavBar from '../components/TopNavBar'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import {Actions} from 'react-native-router-flux'

//TODO:if need to control item title in 30 characters
const SEARCH_RESULT=[{name:"Car", source :["http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg","https://upload.wikimedia.org/wikipedia/commons/3/3c/Infiniti_Q60_2.0t_P4250831.jpg"],
              tags:["car","used"], description:"This is a 2017 used Infinity Q60, the condition is very new.Aside from a redesign, the 2017 Q60 received many major upgrades like a lower and wider body, introduction of second generation Direct Adaptive Steering, Drive Mode Selector with custom settings profile, hydraulic electronic rack and pinion power steering system standard (2.0t), introduction of Dynamic Digital Suspension, retuned seven speed automatic transmission, Active Grille Shutter in V6 engine models, and for the first time, all new turbocharged engines. The Q60 Convertible was discontinued for the second generation.",price:10000,seller:"LL",timeleft:"4d 2h",currentBid:7000},
              {name:"Car", source :["http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg"],
              tags:["car","used","bla"], description:"This is a 2017 used Infinity Q60, the condition is very new",price:10000,seller:"LL",timeleft:"4d 2h",currentBid:7000}]

export default class HomePage extends Component {
  state = {
    search: '',
    searching: false,
    refreshing: false,
    data: [],
    searchRes:[]
    };
    
  updateSearch = (value) => {
    this.setState({ search:value, searching: value !== ''});
  }

  toggleSearching = () => {
    this.setState({searching: !this.state.searching});
  }
  
  
  getPost = async () => {
    let arr = []
    await firebase.database().ref('post').once('value').then(async data => {
      const d = JSON.parse(JSON.stringify(data))
      for (var key in d) {
        const post = d[key]
        const avatar = await firebase.storage().ref('avatar').child(post.user).getDownloadURL();
        let i = 0;
        let p = [];
        for(; i < post.photos; i++) {
          const photo = await firebase.storage().ref('postImage').child(`${key}-${i}`).getDownloadURL();
          p.push(photo);
        }
        arr.push({title: post.title, source: p, tags: post.tags, description: post.description, price: post.price, seller: avatar, sellerUID: post.user, username: post.username, key: key})
      }
    })
    this.setState({data: arr})
  }

  updateSearchRes = (value) => {
    let temp = []
    for (const d of this.state.data){
      const bool = d.title.toLowerCase().startsWith(value)
      if (bool) {
        temp.push(d);
      }
    }
    this.setState({searchRes: temp})
  }
  
  componentDidMount = () => {
    this.getPost()
  }

  wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.wait(2000).then(() => {this.getPost(); this.setState({refreshing: false})});
  }

  render(){
    const { searchRes, data, search } = this.state
    let arr = this.state.searching ? searchRes : data
    return (
      <View style={style.container}>
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <SearchBar
            platform="android"
            containerStyle={style.searchBar}
            inputStyle={{ paddingTop: 2, paddingBottom: 8, paddingLeft: 0 }}
            leftIconContainerStyle={{ paddingTop: 2, paddingBottom: 6 }}
            value={search}
            onChangeText={(value) => {
              this.updateSearch(value);
              this.updateSearchRes(value)
            }}
            onClear={this.toggleSearching}
            onCancel={() => this.updateSearch('')}
          />
            <TouchableOpacity
              onPress={() => Actions.cart()}>
              <Icon type="entypo" name="shopping-cart" color="#006A96" containerStyle={style.backIcon} size={30} />
            </TouchableOpacity>
        </View>
        <View style={{marginBottom: 60}}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          >
            {
              arr.map((item, index) => 
              <ItemDisplay 
                itemName={item.title}
                imageSource={item.source}
                tags={item.tags}
                description={item.description}
                price={item.price}
                seller={item.seller}
                sellerUID={item.sellerUID}
                username={item.username}
                postKey={item.key}
                />)
            }
          </ScrollView>      
        </View>             
      </View>
    );
  }
}



const style = StyleSheet.create({
  container:{
    margin: 10,
      marginBottom: 80,
  },
  searchBar:{
    borderTopEndRadius:80,
    borderTopLeftRadius:80,
    borderBottomEndRadius:80,
    borderBottomLeftRadius:80,
    backgroundColor:"#ddd",
    height:50,
    margin:5,
    width: Dimensions.get('window').width - 70
  },
  searchBarRes:{
    borderTopEndRadius:80,
    borderTopLeftRadius:80,
    borderBottomEndRadius:80,
    borderBottomLeftRadius:80,
    backgroundColor:"#ddd",
    height:50,
    width:350,
    margin:5
  },
  backIcon:{
    paddingLeft: 8
  }

});
