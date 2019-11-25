import {Overlay, Button, ListItem, Icon, Input} from 'react-native-elements';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GradientButton from "./GradientButton";


export default class InputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isVisible: this.props.isVisible, text: this.props.text};
    }

    setVisible(visible) {
        this.setState({isVisible: visible});
    }

    render() {
        return (
            <View>
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
                        leftElement={<Button title="cancel" type="clear" />}
                        rightElement={<Button title="Save" type="solid" />}
                    />
                    <Input
                        placeholder={this.state.text}
                    />
                </Overlay>
            </View>
        );
    }
};

const style = StyleSheet.create({
    centerText: {
        textAlign: 'center',
        fontSize: 20,
        paddingRight: 30,
        paddingLeft: 30,
    },
    titleStyle:{
        textAlign: 'center',
        fontWeight: 'bold',
    }
});