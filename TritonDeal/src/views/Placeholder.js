import React from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native'

export default class Placeholder extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <Text>Placeholder</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
});