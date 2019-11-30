import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Avatar} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class ChatList extends React.Component {

  list = [{
    name: 'Hello',
    message: 'super long message ffffffffffffffffffffffffffffffffffff',
    description: 'fadfddfs',
  },
  {
    name: 'World',
    message: 'fadfasd',
    description: 'super long description gggggggggggggggggggggggggggggggggg',
  }]
  render() {
    return (
      <ScrollView>
      {
        this.list.map((item, i) => (
          <ListItem
            key={i}
             /* avatar : source: { uri: l.avatar_url }*/ 
            leftAvatar={{ size: 'large', icon: {name: 'user', type: 'font-awesome'} }}
            title={item.name}
            titleStyle={style.title}
            subtitle={<Subtitle message={item.message} description={item.description}/>}
            rightElement={<TimeDisplay time="11:30"/>}
            onPress={() => Actions.chat({title: item.name})}
          />))
      }

      </ScrollView>
    )
  }
}

const TimeDisplay = ({time}) => {
  return (
    <Text style={{color: 'grey'}}>{time}</Text>
  )
}

const Subtitle = ({message, description}) => (
  <View>
    <Text style={style.message} numberOfLines={2}>{message}</Text>
    <Text style={style.description} numberOfLines={1}>{description}</Text>
  </View>
)

const style = StyleSheet.create({
  message: {
    fontSize: 16,
  },

  description: {
    fontSize: 12,
    marginTop: 5,
  },

  title: {
    fontSize: 21,
  }
})
