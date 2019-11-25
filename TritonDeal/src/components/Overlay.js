import { Overlay } from 'react-native-elements';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GradientButton from "../components/GradientButton";


export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isVisible: this.props.isVisible, text: this.props.text};
    }

    setVisible(isVisible) {
        this.setState({isVisible: isVisible});
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
                    <Text style={style.centerText}>{this.state.text}</Text>
                    <GradientButton
                        text={"OK"}
                        onpress={() => {
                            this.setVisible(false);
                        }}
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
});