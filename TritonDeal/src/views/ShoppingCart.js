import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import ItemDisplay from '../components/ItemDisplay';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';

export default class ShoppingCart extends React.Component {
  state = {
    post: [],
    inactive: [],
    finished: true,
    empty: false,
  };

  toggleActivityIndicator = () => {
    this.setState({finished: !this.state.finished});
  };

  onResolve = url => {
    return url;
  };

  onReject = async err => {
    return await firebase
      .storage()
      .ref('avatar')
      .child('default.jpg')
      .getDownloadURL();
  };

  getShoppingCart = async () => {
    this.toggleActivityIndicator();

    let arr = [];

    let inactive = [];

    await firebase
      .database()
      .ref('user_to_cart/' + firebase.auth().currentUser.uid)
      .once('value')
      .then(async data => {
        const d = JSON.parse(JSON.stringify(data));

        for (var key in d) {
          await firebase
            .database()
            .ref('post/' + d[key].post)
            .once('value')
            .then(async post => {
              const p = JSON.parse(JSON.stringify(post));

              const avatar = await firebase
                .storage()
                .ref('avatar')
                .child(p.user)
                .getDownloadURL()
                .then(this.onResolve, this.onReject);
              let i = 0;

              let photos = [];
              for (; i < p.photos; i++) {
                const photo = await firebase
                  .storage()
                  .ref('postImage')
                  .child(`${d[key].post}-${i}`)
                  .getDownloadURL();
                photos.push(photo);
              }
              if (p.active === true) {
                arr.push({
                  title: p.title,
                  source: photos,
                  tags: p.tags,
                  description: p.description,
                  price: p.price,
                  seller: avatar,
                  sellerUID: p.user,
                  username: p.username,
                  key: key,
                });
              } else {
                inactive.push({
                  title: p.title,
                  source: photos,
                  tags: p.tags,
                  description: p.description,
                  price: p.price,
                  seller: avatar,
                  sellerUID: p.user,
                  username: p.username,
                  key: key,
                });
              }
            });
        }
      });

    this.setState({
      post: arr,
      empty: arr.length === 0 && inactive.length === 0,
      inactive: inactive,
    });
    this.toggleActivityIndicator();
  };

  componentDidMount = () => {
    this.getShoppingCart();
  };

  render() {
    console.log(this.state);
    return (
      <ScrollView style={style.container}>
        {this.state.finished ? (
          this.state.empty ? (
            <Text style={style.text}>Your cart is empty</Text>
          ) : (
            <View>
              {this.state.post.length !== 0 && (
                <View>
                  <Text style={style.title}>Available: </Text>
                  {this.state.post.map((item, index) => (
                    <ItemDisplay
                      itemName={item.title}
                      imageSource={item.source}
                      tags={item.tags}
                      description={item.description}
                      price={item.price}
                      seller={item.seller}
                      postKey={item.key}
                      sellerUID={item.sellerUID}
                      username={item.username}
                      inCart={true}
                      active={true}
                      cb={this.getShoppingCart}
                    />
                  ))}
                </View>
              )}
              {this.state.inactive.length !== 0 && (
                <View>
                  <Text style={style.title}>InActive: </Text>
                  {this.state.inactive.map((item, index) => (
                    <ItemDisplay
                      itemName={item.title}
                      imageSource={item.source}
                      tags={item.tags}
                      description={item.description}
                      price={item.price}
                      seller={item.seller}
                      postKey={item.key}
                      sellerUID={item.sellerUID}
                      username={item.username}
                      inCart={true}
                      active={false}
                      cb={this.getShoppingCart}
                    />
                  ))}
                </View>
              )}
            </View>
          )
        ) : (
          <ActivityIndicator size="large" color="#eabb33" />
        )}
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 18,
    marginTop: 50,
  },

  container: {
    marginVertical: 10,
  },

  title: {
    marginTop: 10,
    fontSize: 20,
    marginLeft: 10,
  },
});
