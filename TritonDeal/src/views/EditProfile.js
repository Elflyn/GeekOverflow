import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import {Input, Icon, ListItem, Button, Overlay} from 'react-native-elements';
//import GradientButton from './GradientButton';
//import auth from '@react-native-firebase/auth';
//import { firebase } from '@react-native-firebase/auth';
//import { Actions } from 'react-native-router-flux';

export default class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isVisible: false, text: "empty"};
    }

    toggleBox = () => {
        this.setState({ isVisible: !this.state.isVisible });
    };

    //UPDATE new information to database

    render() {
        return (
            <View style={style.container}>
                <ListItem
                    title="Name"
                    bottomDivider
                    chevron
                    onPress={() => {
                        this.setState({ isVisible: true, text: "Name"});
                    }}
                />
                <ListItem
                    title="Email"
                    bottomDivider
                    chevron
                    onPress={() => {
                        this.setState({ isVisible: true, text:"Email"});
                    }}
                />
                <ListItem
                    title="Phone"
                    bottomDivider
                    chevron
                    onPress={() => {
                        this.setState({ isVisible: true, text:"Phone"});
                    }}
                />
                <ListItem
                    title="Address"
                    bottomDivider
                    chevron
                    onPress={() => {
                        this.setState({ isVisible: true, text:"Address"});
                    }}
                />
                <Overlay
                    isVisible={this.state.isVisible}
                    windowBackgroundColor="rgba(255, 255, 255, .8)"
                    overlayBackgroundColor="white"
                    width={350}
                    height="auto"
                >
                    <ListItem
                        title={this.state.text}
                        titleStyle={style.titleStyle}
                        leftElement={<Button title="cancel" type="clear" onPress={this.toggleBox}/>}
                        rightElement={<Button title="Save" type="solid" onPress={this.toggleBox}/>}
                    />
                    <Input
                        placeholder={this.state.text}
                    />
                </Overlay>
            </View>
        )
    };
};

const style = StyleSheet.create({

    listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC',
    },

    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    iconStyle: {
        color: 'white',
    },

    hyperlink: {
        color: '#94B4AF',
        textDecorationLine: 'underline',
        textAlign: 'right',
        fontSize: 18,
        paddingRight: 10,
    },

    container: {
        textAlign: 'center',
    },

    titleStyle:{
        textAlign: 'center',
        fontWeight: 'bold',
    }
});

