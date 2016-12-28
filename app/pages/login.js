import React,{Component} from "react";

import {
    StyleSheet,
    View,
    Text,
    TextInput
} from "react-native";
import Header from "../components/Header";

export default class Login extends Component{
    constructor(props){
        super(props)
    }
    render(){
        <View style={styles.container}>
            <Header title=""/>
            <View style={styles.signupBox}>
                <TextInput />
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    signupBox:{
        
    },
})