import React, {Component} from 'react';
import {SearchBar} from 'react-native-elements'
import {View,Text,FlatList,StyleSheet,SafeAreaView} from 'react-native';
import ItemDisplay from '../components/ItemDisplay'
import TopNavBar from '../components/TopNavBar'
import BottomNavBar from '../components/BottomNavBar'

const DATA = [{name:"Car", source :"http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg",
              tags:["car","used","bla"], description:"This is a 2017 used Infinity Q60, the condition is very new",price:10000,seller:"LL",timeleft:"4d 2h"},
              {name:"Car", source :"http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg",
              tags:["car","used","bla"], description:"This is a 2017 used Infinity Q60, the condition is very new",price:10000,seller:"LL",timeleft:"4d 2h"},
              {name:"Car", source :"http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg",
               tags:["car","used","bla"], description:"This is a 2017 used Infinity Q60, the condition is very new",price:10000,seller:"LL",timeleft:"4d 2h"},
               {name:"Car", source :"http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg",
                             tags:["car","used","bla"], description:"This is a 2017 used Infinity Q60, the condition is very new",price:10000,seller:"LL",timeleft:"4d 2h"},
                             {name:"Car", source :"http://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg",
                                           tags:["car","used","bla"], description:"This is a 2017 used Infinity Q60, the condition is very new",price:10000,seller:"LL",timeleft:"4d 2h"}
            ]
export default class HomePage extends Component <{}>{
  constructor(props) {
    super(props);
    this.state = {
    search: ''
    }
  }

  updateSearch = search => {
    this.setState({ search });
  };


  render() {
    const  search  = this.state;
    return (
      <View style={style.container}>
        <TopNavBar />
        <SearchBar
          platform="android"
          placeholder="Search"
          onChangeText={this.updateSearch}
          value={search}
          containerStyle = {style.searchBar} />
          <FlatList
            data={DATA}
            renderItem={({item})=>  <ItemDisplay itemName={item.name} imageSource={item.source} tags={item.tags} description={item.description} price={item.price} seller={item.seller} timeleft={item.timeleft}/>
            }
            />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container:{
    margin:10
  },
  searchBar:{
    borderTopEndRadius:80,
    borderTopLeftRadius:80,
    borderBottomEndRadius:80,
    borderBottomLeftRadius:80,
    backgroundColor:"#ddd",
    height:50,
    margin:5
  },

});
