import React, {Component} from 'react';
import {Button, Overlay} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import {Actions} from 'react-native-router-flux';
import ChatList from './ChatList';

export default class ItemDetail extends Component {
  state = {
    chatID: null,
    finished: true,
  };

  componentWillMount = async () => {
    const chatListRef = firebase.database().ref('chat_by_id');
    var cid;
    await chatListRef
      .orderByChild('postID')
      .equalTo(this.props.postKey)
      .once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          if (
            firebase.auth().currentUser &&
            firebase.auth().currentUser.uid == childSnapshot.val().user1
          ) {
            cid = childSnapshot.key;
          }
        });
      })
      .catch(error => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
    this.setState({chatID: cid});
  };

  toggleActivityIndicator = () => {
    this.setState({finished: !this.state.finished});
  };

  render() {
    const {
      itemName,
      imageSource,
      tags,
      description,
      price,
      inCart,
      sellerUID,
      username,
      postKey,
      active,
      cb,
    } = this.props;
    return (
      <View>
        <Overlay isVisible={!this.state.finished} width="auto" height="auto">
          <ActivityIndicator size="large" color="#eabb33" />
        </Overlay>
        <View>
          <View style={style.detailTitleRow}>
            <Text style={style.detailTitle}>{itemName}</Text>
            <View style={style.detailTopIcon} />
          </View>
          <ScrollView horizontal={true} style={style.imageScroll}>
            {imageSource.map(image => (
              <Image source={{uri: image}} style={style.multiImage} />
            ))}
          </ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 30, marginTop: 5}}>${price}</Text>
          </View>
          <ScrollView style={{height: 160, marginTop: 10}}>
            <View style={style.detailTagsView}>
              {tags.map((tag, i) => {
                return (
                  <View style={style.detailTag} key={i}>
                    <Text style={style.detailTagText}>{tag}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={{fontSize: 18, padding: 5}}>{description}</Text>
          </ScrollView>
          <ActionButtons
            username={username}
            sellerUID={sellerUID}
            cid={this.state.chatID}
            imageSource={imageSource[0]}
            itemName={itemName}
            price={price}
            postKey={postKey}
            inCart={inCart}
            active={active}
            cb={cb}
            toogle={this.toggleActivityIndicator}
          />
        </View>
      </View>
    );
  }
}

const ActionButtons = ({
  username,
  cid,
  sellerUID,
  price,
  itemName,
  imageSource,
  postKey,
  inCart,
  active,
  cb,
  toogle,
}) => {
  if (
    firebase.auth().currentUser &&
    sellerUID != firebase.auth().currentUser.uid
  ) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {active && (
          <Button
            title="Contact Seller"
            buttonStyle={{margin: 10}}
            onPress={() => {
              var chatID;
              if (!cid) {
                const cl = new ChatList();
                chatID = cl.createChat(
                  firebase.auth().currentUser.uid,
                  sellerUID,
                  imageSource,
                  itemName,
                  price,
                  postKey,
                );
              } else {
                chatID = cid;
              }
              Actions._chatList();
              const chatInfo = {
                title: username,
                chatID: chatID,
                imgURI: imageSource,
                itemName: itemName,
                price: price,
                sellerUID: sellerUID,
                postID: postKey,
                active: true,
              };
              Actions.chat(chatInfo);
            }}
          />
        )}
        {inCart ? (
          <Button
            onPress={() => {
              toogle();
              firebase
                .database()
                .ref('user_to_cart/' + firebase.auth().currentUser.uid)
                .child(postKey)
                .remove();
              cb().then(() => {
                toogle();
                Actions.pop();
              });
            }}
            title="Remove from the Cart"
            buttonStyle={{margin: 10}}
          />
        ) : (
          <Button
            onPress={() => {
              const userCartRef = firebase
                .database()
                .ref('user_to_cart/' + firebase.auth().currentUser.uid);
              userCartRef
                .orderByChild('post')
                .equalTo(postKey)
                .once('value', snapshot => {
                  if (snapshot.exists()) {
                    Alert.alert(
                      '',
                      'This item is already in your cart! Check out your shopping Cart!',
                      [{text: 'OK', onDismiss: () => {}}],
                    );
                  } else {
                    userCartRef.push({post: postKey});
                    Alert.alert(
                      '',
                      'You have successfully added this item to you chart!',
                      [{text: 'OK', onDismiss: () => {}}],
                    );
                  }
                });
            }}
            title="Add to Cart"
            buttonStyle={{margin: 10}}
          />
        )}
      </View>
    );
  } else if (firebase.auth().currentUser && active) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          title="Cancel this listing"
          buttonStyle={{margin: 10}}
          onPress={() => {
            Alert.alert(
              null,
              'This item cannot be viewed by other users once you cancel this listing.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async () => {
                    const postRef = firebase.database().ref('post');
                    postRef.child(postKey).update({active: false});
                    cb().then(() => {
                      Actions.pop();
                    });
                  },
                },
              ],
            );
          }}
        />
      </View>
    );
  } else {
    return <Text style={style.text}>Please login to view more</Text>;
  }
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 1,
    elevation: 1,
    margin: 5,
    padding: 2,
    justifyContent: 'center',
  },
  textView: {
    flex: 2,
    flexDirection: 'column',
    height: 130,
    width: 260,
    marginTop: 5,
  },
  image: {
    flex: 1,
    height: 'auto',
    width: 'auto',
    borderRadius: 10,
    margin: 5,
  },
  itemTitle: {
    fontSize: 20,
    color: 'black',
  },
  tagsView: {
    //flex:1,
    padding: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent:"space-between"
  },
  tag: {
    padding: 3,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#B6B1A9',
  },
  tagText: {
    color: 'black',
  },
  price: {
    flex: 1,
    fontSize: 24,
  },
  bottomStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightView: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  button: {
    marginLeft: 40,
    marginBottom: 4,
    height: 37,
    width: 50,
    borderRadius: 5,
  },
  detailTitleRow: {
    flexDirection: 'row',
  },
  detailTitle: {
    flex: 1,
    fontSize: 30,
    margin: 5,
  },
  detailTopIcon: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  imageScroll: {
    borderBottomWidth: 1,
    borderColor: '#747678',
    padding: 2,
    height: 280,
  },
  multiImage: {
    width: 370,
    height: 270,
    margin: 10,
    alignSelf: 'center',
  },
  detailTagsView: {
    //flex:1,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent:"space-between"
  },
  detailTag: {
    padding: 1,
    marginTop: 5,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#B6B1A9',
  },
  detailTagText: {
    color: 'black',
    fontSize: 22,
  },
  text: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 18,
    marginTop: 50,
  },
});
