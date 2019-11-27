import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

const GradientButton = ({text, onPress}) => {
  return (
    <LinearGradient
      colors={[
        '#00709C',
        '#0081A1',
        '#008AA7',
        '#008BA8',
        '#0299AE',
        '#00A7B8',
      ]}
      start={{x: 0.0, y: 1.0}}
      end={{x: 1.0, y: 1.0}}
      style={style.gradient}>
      <TouchableOpacity style={style.buttonContainer} onPress={onPress}>
        <Text style={style.buttonText}>{text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const style = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  buttonText: {
    textAlign: 'center',
    color: 'white',
    paddingTop: 5,
    fontSize: 20,
    fontFamily: 'Roboto-Thin',
  },
  gradient: {
    marginTop: 20,
    height: 40,
    width: 300,
    justifyContent: 'center',
    borderRadius: 35,
    alignSelf: 'center',
  },
})

export default GradientButton;
