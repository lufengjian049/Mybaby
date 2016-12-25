import React,{Component} from 'React';

import {StyleSheet,Text,View} from 'react-native';

export default class Moviedit extends Component{
    constructor(props) {
        super(props)
        
    }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Movedit Page
                </Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

});