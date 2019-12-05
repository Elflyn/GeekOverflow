import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ToastAndroid, Alert, ActivityIndicator } from 'react-native';


export default class ShoppingCart extends React.Component {
  render() {
    return (
      <View>
        {
          this.state.data.map((item, index) => 
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
      </View>
    )
  }
}