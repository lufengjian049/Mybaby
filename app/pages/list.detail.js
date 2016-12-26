import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
    ListView
} from 'react-native';
import Video from 'react-native-video';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';

import request from "../common/request";
const {width,height} = Dimensions.get("window");

export default class Detail extends Component{
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

            dataSource:new ListView.DataSource({
                rowHasChanged:(row1,row2) => row1 !== row2
            }),
        }
        this._onLoadStart = this._onLoadStart.bind(this);
        this._onLoad = this._onLoad.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onError = this._onError.bind(this);

        this._rePlay = this._rePlay.bind(this);

        this._pause = this._pause.bind(this);
        this._resume = this._resume.bind(this);

        this._renderRow = this._renderRow.bind(this);
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

    _fetchData(){
        request.get("comments",{
            id:"333333"
        }).then(
            (data) =>{
                let comments = data && data.data;
                if(comments && comments.length)
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(comments)
                    })
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    _renderRow(data){
        return (
            <View style={styles.replyBox} key={data._id}>
                <Image style={styles.replyAvatar} source={{uri:data.replyBy.avatar}}  />
                <View style={styles.reply}>
                    <Text style={styles.replyNickname}>{data.replyBy.nickname}</Text>
                    <Text style={styles.replyContent}>{data.content}</Text>
                </View>
            </View>
        )
    }
    componentDidMount(){
        this._fetchData();
    }
    render(){
        let rowData = this.props.rowData;

        const flexCompleted = this.getCurrentTimePercentage() * 100;
        console.log(flexCompleted);
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        // ref="videoPlayer"
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBox} onPress={this._backLastPage}>
                        <Icon name='ios-arrow-back' style={styles.backIcon}/>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>视频详情页</Text>
                </View>
                
                <View style={styles.videoBox}>
                    <Video
                        source={{uri: "http://www.reactnative.vip/data/movie.mp4"}}
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

                <ScrollView  enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}>
                    <View style={styles.infoBox}>
                        <Image style={styles.avatar} source={{uri:rowData.author.avatar}} />
                        <View style={styles.descBox}>
                            <Text style={styles.nickname}>{rowData.author.nickname}</Text>
                            <Text style={styles.title}>{rowData.title}</Text>
                        </View>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
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
    header: {
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        width:width,
        height:64,
        paddingLeft:10,
        paddingRight:10,
        borderBottomWidth:1,
        borderColor:"rgba(255,0,0,0.2)",
        backgroundColor:"#fff",
        marginTop:Platform.OS === 'ios' ? 20 : 0,
    },
    backBox:{
        position:"absolute",
        left:12,
        top:20,
        flexDirection:"row",
        width:60,
        alignItems:"center"
    },
    backIcon:{
        color:"#999",
        fontSize:22,
        marginRight:5
    },
    backText:{
        color:"#999",
        fontSize:16
    },
    headerTitle:{
        width:width-120,
        textAlign:"center",
        fontSize:18,
        color:"red",
    },
    videoBox:{
        backgroundColor:"#000",
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
        top:160,
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
        height:350,
    },
    failText:{
        position:'absolute',
        left:0,
        width:width,
        top:200,
        backgroundColor:'transparent',
        textAlign:'center',
        color:'red',
        fontSize:20,
    },

    scrollView:{},
    infoBox:{
        flexDirection:"row",
        width:width,
        justifyContent:"center",
        marginTop:10,
    },
    avatar:{
        width:60,
        height:60,
        borderRadius:30,
        marginRight:10,
        marginLeft:10
    },
    descBox:{
        flex:1
    },
    nickname:{
        fontSize:18,
    },
    title:{
        marginTop:8,
        fontSize:16,
        color:"#666"
    },

    replyBox:{
        flexDirection:'row',
        width:width,
        justifyContent:'flex-start',
        marginTop:10,
    },
    replyAvatar:{
        width:40,
        height:40,
        borderRadius:20,
        marginRight:10,
        marginLeft:10,
    },
    reply:{
        flex:1,
    },
    replyNickname:{
        color:'red'
    },
    replyContent:{
        marginTop:4,
        color:'blue'
    },
    
});