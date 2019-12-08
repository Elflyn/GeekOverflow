import React, { Component } from 'react';
import { SearchBar, Icon } from 'react-native-elements'
import { View,TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, ScrollView, Dimensions } from 'react-native';
import ItemDisplay from '../components/ItemDisplay'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import { Actions } from 'react-native-router-flux'

export default class HomePage extends Component {
  state = {
    search: '',
    searching: false,
    refreshing: false,
    data: [],
    searchRes:[],
    finished: false,
  };
    
  updateSearch = (value) => {
    this.setState({ search:value, searching: value !== ''});
  }

  toggleSearching = () => {
    this.setState({searching: !this.state.searching});
  }

  onResolve = (url) => {
    return url;
  }

  onReject = err => {
    return firebase.storage().ref('avatar').child('default.jpeg').getDownloadURL();
  }

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };
  

  getPost = async () => {
    this.setState({data: []});
    this.toggleActivityIndicator()
    let arr = []
    await firebase.database().ref('post').orderByKey().once('value').then(async data => {
      const d = JSON.parse(JSON.stringify(data))
      for (var key in d) {
        const post = d[key]
        if (post.active === false) {
          continue
        }
        const avatar = await firebase.storage().ref('avatar').child(post.user).getDownloadURL().then(this.onResolve, this.onReject);
        let i = 0;
        let p = [];
        for (; i < post.photos; i++) {
          const photo = await firebase.storage().ref('postImage').child(`${key}-${i}`).getDownloadURL();
          p.push(photo);
        }
        let postItem = { title: post.title, 
          source: p, 
          tags: post.tags, 
          description: post.description, 
          price: post.price, 
          seller: avatar, 
          sellerUID: post.user, 
          username: post.username, 
          key: key, 
          active: post.active 
        };
        this.setState({ data: [...this.state.data, postItem] });
      }
    })
    //this.setState({ data: arr })
    this.toggleActivityIndicator()
  }

  updateSearchRes = (value) => {
    let temp = []
    for (const d of this.state.data){
      const contain = d.title.toLowerCase().includes(value.toLowerCase());
      var tagMatch = false;
      for (const tag of d.tags) {
        tagMatch = tag.toLowerCase().includes(value.toLowerCase()) || tagMatch;
      }
      if (contain || tagMatch) {
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
    this.setState({ refreshing: true });
    this.getPost(); 
    this.setState({ refreshing: false });
  }

  render(){
    const { searchRes, data, search, finished } = this.state
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
              onPress={() => {
                  if (firebase.auth().currentUser) {
                    Actions.cart()
                  } else {
                    Actions.login();
                  }
                }}>
              <Icon type="entypo" name="shopping-cart" color="#006A96" containerStyle={style.backIcon} size={30} />
            </TouchableOpacity>
        </View>
        <View style={{marginBottom: 40}}>
           {finished && <ActivityIndicator size='large' color='#eabb33' />}
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
                inCart={false}
                active={item.active}
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
