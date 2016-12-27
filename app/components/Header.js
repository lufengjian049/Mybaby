import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';

const {width,height} = Dimensions.get("window");

export default class Header extends Component{
    constructor(props) {
        super(props)
        this._backLastPage = this._backLastPage.bind(this);
    }

    _backLastPage(){
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }

    render(){
        const {title,navigator} = this.props;
        return (
            <View style={styles.header}>
                {
                    navigator ? <TouchableOpacity style={styles.backBox} onPress={this._backLastPage}>
                                    <Icon name='ios-arrow-back' style={styles.backIcon}/>
                                    <Text style={styles.backText}>Back</Text>
                                </TouchableOpacity>
                            : null
                }
                <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    header: {
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        width:width,
        paddingTop:Platform.OS === "ios" ? 25 : 12,
        paddingBottom:12,
        backgroundColor:"#ee735c"
    },
    backBox:{
        position:"absolute",
        left:8,
        top:Platform.OS === "ios" ? 22 : 12,
        flexDirection:"row",
        width:60,
        alignItems:"center",
    },
    backIcon:{
        color:"#fff",
        fontSize:22,
        marginRight:5
    },
    backText:{
        fontSize:16,
        color:"#fff",
    },
    headerTitle:{
        width:width-120,
        textAlign:"center",
        fontSize:18,
        color:"#fff",
        fontWeight:"600",
    },
})