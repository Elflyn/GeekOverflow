import React from 'react';
import { ScrollView, Text} from 'react-native';
import { Button } from 'react-native-elements'
import ItemDisplay from '../components/ItemDisplay'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';

export default class ShoppingCart extends React.Component {

  state = {
    post: []
  }
  
  getShoppingCart = async () => {
    let arr = []
    await firebase.database().ref('user_to_cart/' + firebase.auth().currentUser.uid).once('value').then(async data => {
      const d = JSON.parse(JSON.stringify(data))
      for (var key in d) {
        await firebase.database().ref('post/' + d[key].post).once('value').then(async post => {
          const p = JSON.parse(JSON.stringify(post))
          const avatar = await firebase.storage().ref('avatar').child(p.user).getDownloadURL();
          let i = 0
          let photos = [];
          for(; i < p.photos; i++) {
            const photo = await firebase.storage().ref('postImage').child(`${d[key].post}-${i}`).getDownloadURL();
            photos.push(photo);
          }
          arr.push({title: p.title, source: photos, tags: p.tags, description: p.description, price: p.price, seller: avatar, sellerUID: p.user, username: p.username, key: key})
        })
      }
    })
    this.setState({post: arr})
  }

  componentDidMount = () => {
    this.getShoppingCart()
  }
  
  render() {
    return (
      <ScrollView>

        { this.state.post.length === 0 ? 
          <Text style={{textAlign: 'center'}}>Your cart is empty.</Text> :
          this.state.post.map((item, index) => 
            <ItemDisplay 
              itemName={item.title}
              imageSource={item.source}
              tags={item.tags}
              description={item.description}
              price={item.price}
              seller={item.seller}
              sellerUID={item.sellerUID}
              username={item.username}
            />)
        }
      </ScrollView>
    )
  }
}