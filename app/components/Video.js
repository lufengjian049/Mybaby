import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import Dimensions from 'Dimensions';

const {width,height} = Dimensions.get("window");

export default class Video extends Component{
    //props src
    constructor(props) {
        super(props);
        this.state = {
            rate: 1,
            volume: 1,
            muted: true,
            resizeMode: 'contain',
            paused: false,
            duration: 0.0,
            currentTime: 0.0,
            videoLoaded:false,
            playing:false,
            videoOk:true,
        }
        this._onLoadStart = this._onLoadStart.bind(this);
        this._onLoad = this._onLoad.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onError = this._onError.bind(this);

        this._rePlay = this._rePlay.bind(this);

        this._pause = this._pause.bind(this);
        this._resume = this._resume.bind(this);
    }
    _resume(){
        if(this.state.paused){
            this.setState({
                paused:false
            });
        }
    }

    _pause(){
        if(!this.state.paused){
            this.setState({
                paused:true
            });
        }
    }

    _rePlay(){
        this.player.seek(0);
        this.setState({
            paused:false, //android
            // playing:true
        })
    }

    _onLoadStart(){
        console.log('_onLoadStart');
    }

    _onLoad(data){
        console.log('_onLoad----视频总长度:'+data.duration);
        this.setState({duration: data.duration});
    }

    _onProgress(data){
        if(!this.state.videoLoaded){
            this.setState({
                videoLoaded:true,
            });
        }
        if(!this.state.playing){
            this.setState({
                playing:true,
            });
        }
        if(!this.state.paused){
            this.setState({currentTime: data.currentTime});
        }
        // console.log('_onProgress----数据对象：'+JSON.stringify(data));
            
        console.log('_onProgress----当前时间：'+data.currentTime +" duration " + this.state.duration);
    }

    _onEnd(){
        this.setState({
                currentTime:this.state.duration,
                playing:false,
                paused:true
            }
        );
    }
    _onError(error){
        console.log('错误：'+JSON.stringify(error));
        this.setState({
            videoOk:false,
        });
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }
    render(){
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        // console.log(flexCompleted);
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        return (
            <View style={styles.videoBox}>
                <Video
                    source={{uri: this.props.src}}
                    style={styles.video}
                    rate={this.state.rate}
                    paused={this.state.paused}
                    volume={this.state.volume}
                    muted={this.state.muted}
                    resizeMode={this.state.resizeMode}
                    repeat={false}
                    ref={(ref) => {
                        this.player = ref
                    }} 
                    onLoadStart={this._onLoadStart}
                    onLoad={this._onLoad}
                    onProgress={this._onProgress}
                    onEnd={this._onEnd}
                    onError={this._onError}
                />

                {!this.state.videoOk ?
                    <Text style={styles.failText}>很抱歉,视频出错啦！</Text>
                    :null}

                {!this.state.videoLoaded ?
                    <ActivityIndicator color="red" size="large"
                    style={styles.loading} />
                    :null}

                {this.state.videoLoaded && !this.state.playing ?
                    <Icon
                        name='ios-play'
                        size={45}
                        onPress={this._rePlay}
                        style={styles.play} />
                    :null}

                {this.state.videoLoaded && this.state.playing ?
                    <TouchableOpacity
                    onPress={this._pause}
                    style={styles.pauseArea}
                    >
                        {this.state.paused ?
                            <Icon
                                name='ios-play'
                                size={45}
                                onPress={this._resume}
                                style={styles.play} />
                            :null}
                    </TouchableOpacity>
                    :null}

                <View style={styles.progress}>
                    <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
                    <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    videoBox:{
        backgroundColor:"#000",
        width:width,
        height:240,
    },
    video:{
        width:width,
        height:230,
    },
    loading:{
        position:'absolute',
        left:0,
        width:width,
        top:90,
        backgroundColor:'transparent',
        alignSelf:'center',
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 10,
        backgroundColor: 'red',
    },
    innerProgressRemaining: {
        height: 10,
        backgroundColor: '#cccccc',
    },
    play:{
        position:'absolute',
        top:90,
        left:width/2 - 30,
        width:60,
        height:60,
        paddingTop:10,
        paddingLeft:22,
        backgroundColor:'transparent',
        borderColor:'#000',
        borderWidth:1,
        borderRadius:30,
        color:'#ed7b66'
    },
    pauseArea:{
        position:'absolute',
        top:0,
        left:0,
        width:width,
        height:230,
    },
    failText:{
        position:'absolute',
        left:0,
        width:width,
        top:120,
        backgroundColor:'transparent',
        textAlign:'center',
        color:'red',
        fontSize:20,
    },
})