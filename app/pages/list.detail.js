import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Modal,
    Platform,
} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

import request from "../common/request";
import RefreshListview from "../components/RefreshListview";
import Header from "../components/Header";
import Video from "../components/Video";
const {width,height} = Dimensions.get("window");

export default class Detail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            animationType:"fade", //none slide fade
            modalShow:false,
            transparent:false, // 是否透明

            content:"",
            isSendComment:false,

            listnewdata:null, //评论实时添加的数据
        }
        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);

        this._focus = this._focus.bind(this);

        this._setModalVisible = this._setModalVisible.bind(this);
        this._submit = this._submit.bind(this);
        this._closeModal = this._closeModal.bind(this);
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
    _renderHeader(){
        let rowData = this.props.rowData;
        return (
            <View style={styles.listHeader}>
                <View style={styles.infoBox}>
                    <Image style={styles.avatar} source={{uri:rowData.author.avatar}} />
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>author:{rowData.author.nickname}</Text>
                        <Text style={styles.title}>title:{rowData.title}</Text>
                    </View>
                </View>
                <View style={styles.commentBox}>
                    <View style={[styles.comment,Platform.os != 'ios' ? styles.commentAndroid : {}]}>
                        <TextInput placeholder="comment here~~~" style={styles.inputContent} multiline={true} 
                        onFocus={this._focus} underlineColorAndroid="transparent" keyboardType="default" onChangeText={(text) => {
                            this.setState({
                                content:text
                            })
                        }}/>
                    </View>
                    {Platform.os == "ios" ? null :
                        <View style={styles.commentBtn}>
                            <Text style={styles.commentSubmit} onPress={this._submit}>comment</Text>
                        </View>
                        }
                </View>
                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>精彩评论</Text>  
                </View>
            </View>
        )
    }
    _focus(){
        if(Platform.os == "ios")
            this._setModalVisible(true);
    }
    _closeModal(){
        this._setModalVisible(false);
    }
    _submit(){
        if(this.state.content){
            if(!this.state.isSendComment){
                this.setState({
                    isSendComment:true
                },()=>{
                    request.post("comment",{
                        vedioid:"3232",
                        content:this.state.content,
                        userid:""
                    }).then((data)=>{
                        var redata = {
                            id:data._id,
                            content:this.state.content,
                            replyBy:{
                                nickname:'dfy',
                                avatar:'http://dummyimage.com/640x640/967776)'
                            }
                        };
                        this.setState({
                            isSendComment:false,
                            content:'',
                            modalShow:false,
                            listnewdata:redata
                        })
                    }).catch((err)=>{
                        console.log(err);
                    })
                })
            }
        }else{
            alert("please enter comment;");
        }
    }
    componentDidMount(){
        // this._fetchData();
    }
    _setModalVisible(visible){
        this.setState({
            modalShow:visible
        })
    }
    render(){
        let rowData = this.props.rowData;
        // ref="videoPlayer"
        return (
            <View style={styles.container}>
                <Header title="视频详情页" navigator={this.props.navigator} />

                <Video src="http://www.reactnative.vip/data/movie.mp4" />

                <RefreshListview addData={this.state.listnewdata}  fetchPromise={()=>{
                     return request.get("comments",{
                                id:"333333"
                            })
                 }} renderRow={this._renderRow} pullrefresh={true}
                    renderHeader={this._renderHeader} />
                
                <Modal animationType={this.state.animationType} transparent={this.state.transparent} 
                        visible={this.state.modalShow} onRequestClose={
                            ()=>{
                                this._setModalVisible(false);
                            }
                        }>
                        <View style={styles.modalContainer}>
                            <Icon name="ios-close-outline" size={45} onPress={this._closeModal} style={styles.closeIcon} />
                            <View style={styles.commentBox}>
                                <View style={styles.comment}>
                                    <TextInput placeholder="comment here ~~~" multiline={true} style={styles.inputContent} defaultValue={this.state.content} onChangeText={(text)=>{
                                        this.setState({
                                            content:text
                                        })
                                    }} />
                                </View>
                            </View>
                            <Button onPress={this._submit} style={styles.submitButton}>Comment</Button>
                        </View>
                </Modal>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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

    listHeader:{
        marginTop:10,
        width:width
    },
    commentBox:{
        padding:8,
        width:width,
        flexDirection:"row",
    },
    comment:{},
    commentAndroid:{
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:4,
        height:50,
        flex:1,
    },
    inputContent:{
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:4,
        fontSize:14,
        height:50,
        color:"#333",
        paddingLeft:4,
    },
    commentBtn:{
        width:40,
        height:50,
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:4,
        justifyContent:"center",
        alignItems:"center",
    },
    commentSubmit:{
        fontSize:18,
    },
    commentArea:{
        width:width,
        paddingLeft:10,
        paddingBottom:8,
        borderBottomWidth:1,
        borderColor:"#eee"
    },
    commentTitle:{
        color:"red"
    },

    modalContainer:{
        flex:1,
        paddingTop:45,
        backgroundColor:"#fff",
        alignItems:"center"
    },
    closeIcon:{
        fontSize:30,
        paddingTop:20,
        color:'red'
    },
    submitButton:{
        width:width-20,
        padding:16,
        marginTop:10,
        borderWidth:1,
        borderColor:"red",
        borderRadius:4,
        color:"red",
        fontSize:18
    }
    
});