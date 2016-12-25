import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';
const {width,height} = Dimensions.get("window");

export default class ListItem extends Component{
    constructor(props) {
        super(props)
        this.state = {
            rowData:this.props.rowData,
            curup:false
        }
    }

    handleUp=()=>{
        this.setState({
            curup:!this.state.curup
        })
    }

    render(){
        var rowData = this.state.rowData;
        return (
            <TouchableHighlight onPress={this.props.onSelect}>
                <View style={styles.item}>
                    <Text style={styles.title}>{rowData.title}</Text>
                    <Image style={styles.thumb} source={{uri:rowData.thumb}}>
                        <Icon name="ios-play" size={28} style={styles.playbtn} />
                    </Image>
                    <View style={styles.item_footer}>
                        <View style={styles.handleBox}>
                            <Icon name={!this.state.curup ? "ios-heart-outline" : "ios-heart"} size={28} 
                                style={[styles.footericon,this.state.curup && styles.down]} onPress={this.handleUp}/>
                            <Text style={styles.handleText} onPress={this.handleUp}>点赞</Text>
                        </View>
                        <View style={styles.handleBox}>
                            <Icon name="ios-chatbubbles" size={28} style={styles.footericon} />
                            <Text style={styles.handleText}>评论</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    item:{
        marginBottom:10,
        backgroundColor:"#fff"
    },
    title:{
        fontSize:18,
        padding:10,
        color:"#333"
    },
    thumb:{
        width:width,
        height:width*0.56,
        resizeMode:'cover'
    },
    playbtn:{
        position:"absolute",
        bottom:10,
        right:10,
        width:46,
        height:46,
        paddingLeft:18,
        paddingTop:9,
        borderRadius:23,
        borderColor:"#000",
        borderWidth:1,
        backgroundColor:"transparent",
        color:"#ed7b66"
    },
    item_footer:{
        flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:"#eee"
    },
    handleBox:{
        flexDirection:"row",
        padding:10,
        justifyContent:"center",
        width:width/2 - 0.5,
        backgroundColor:"#fff"
    },
    footericon:{
        fontSize:22,
        color:"#333"
    },
    down:{
        fontSize:22,
        color:"#ed7b66"
    },
    handleText:{
        fontSize:18,
        color:"#333",
        paddingLeft:12
    }
})