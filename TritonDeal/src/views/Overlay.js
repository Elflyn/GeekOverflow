import { Overlay } from 'react-native-elements';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GradientButton from "../components/GradientButton";


const Dialog = ({isVisible, text}) => {
    return(
        <View>
            <Overlay style={style.box}
                isVisible={isVisible}
                windowBackgroundColor="rgba(255, 255, 255, .8)"
                overlayBackgroundColor="white"
                width={350}
                height="auto"
            >
                <Text style={style.centerText}>{text}</Text>
                <GradientButton
                    text={"OK"}
                />
            </Overlay>
        </View>
    );
};

const style = StyleSheet.create({
    centerText: {
        textAlign: 'center',
        fontSize: 20,
        paddingRight: 30,
        paddingLeft: 30,
    },
    box: {
        height: 40,
        width: 30,
    }
});

export default Dialog;