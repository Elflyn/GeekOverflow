import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const OrBreak = () => (
  <View style={{flexDirection: 'row'}}>
    <View style={style.line} />
    <Text style={style.middleText}>OR</Text>
    <View style={style.line} />
  </View>
)

const style = StyleSheet.create({
  line: {
    backgroundColor: '#0A6278',
    height: 1,
    flex: 1,
    paddingHorizontal: 1,
    alignSelf: 'center',
    marginVertical: 15,
  },

  middleText: {
    paddingHorizontal: 8,
    alignSelf: 'center',
    fontSize: 15,
    color: '#004862',
    marginVertical: 20,

  },
})

export default OrBreak;