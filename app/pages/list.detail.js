import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    Platform,
    ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import Dimensions from 'Dimensions';
const {width,height} = Dimensions.get("window");

export default class Detail extends Component{
    constructor(props) {
        super(props)
        this.state = {
            videoLoading:true
        }
    }
    _onLoad=()=>{
        console.log("load")
    }
    _onProgress=()=>{
        console.log("progress");
        if(this.state.videoLoading){
            this.setState({
                videoLoading:false
            })
        }
    }
    _onEnd =()=>{
        
    }

    render(){
        let rowData = this.props.rowData;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome} onPress={this._backLastPage}>
                    视频详情页
                </Text>
                <View style={styles.videoBox}>
                    <Video
                        source={{uri: "http://www.reactnative.vip/data/movie.mp4"}}
                        style={styles.video}
                        rate={1}
                        paused={false}
                        volume={1}
                        muted={true}
                        resizeMode={"contain"}
                        repeat={false}

                        onLoad={this._onLoad}
                        onProgress={this._onProgress}
                        onEnd={this._onEnd}
                    />
                    {this.state.videoLoading ? 
                        <ActivityIndicator color={"red"} size="large" style={styles.loading}/> : null}
                </View>
            </View>
        )
    }

    _backLastPage = ()=>{
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        marginTop:Platform.OS === 'ios' ? 20 : 0,
    },
    videoBox:{
        width:width,
        height:360,

    },
    video:{
        width:width,
        height:350,
    },
    loading:{
        position:'absolute',
        left:0,
        width:width,
        top:160,
        backgroundColor:'transparent',
        alignSelf:'center',
    }
});