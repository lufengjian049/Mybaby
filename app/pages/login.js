import React,{Component} from "react";

import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from "react-native";
import Header from "../components/Header";
import request from "../common/request";
import Dimensions from 'Dimensions';

const {width, height} = Dimensions.get('window');

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            second:60,
            phoneNumber:'',
            verifyCode:'',
            codeSended:false,
        }
        this._getCode = this._getCode.bind(this);
        this._login = this._login.bind(this);
    }
    _login(){
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;
        if (!phoneNumber || !verifyCode) {
            alert('手机号码或者验证码不能为空');
            return ;
        }
        request.post("signin",{
            phonenum:phoneNumber,
            code:verifyCode
        }).then((data)=>{
            this.props.afterLogin(data.data);
        })
    }
    _getCode(){
        let phontNum = this.state.phoneNumber;
        if(!phontNum){
            alert("please enter phone number");
            return;
        }
        request.post("verifycode",{
            phonenum:phontNum
        }).then(()=>{
            this.setState({
                codeSended:true,
                second:6,
                verifyCode:""
            })
            this._interval = setInterval(()=>{
                var curSec = this.state.second;
                if(curSec <= 0){
                    clearInterval(this._interval);
                }
                this.setState({
                    second:curSec-1
                })
            },1000);
        })
    }   
    componentWillUnmount(){
        this._interval && clearInterval(this._interval);
    }
    render(){
        return (<View style={styles.container}>
                    <Header title="快速登录"/>
                    <View style={styles.signupBox}>
                        <TextInput placeholder='输入手机号'
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'phone-pad'}
                                underlineColorAndroid="transparent"
                                style={styles.inputField}
                                onChangeText={(text)=> {
                                    this.setState({
                                        phoneNumber: text
                                    });
                                }} />
                        {
                            this.state.codeSended ?
                                <View style={styles.verifyBox}>
                                    <TextInput placeholder='输入验证码'
                                                autoCapitalize={'none'}
                                                autoCorrect={false}
                                                keyboardType={'phone-pad'}
                                                underlineColorAndroid="transparent"
                                                style={[styles.inputField,{flex:1}]}
                                                defaultValue={this.state.verifyCode}
                                                onChangeText={(text)=> {
                                                    this.setState({
                                                        verifyCode: text
                                                    });
                                                }} />
                                    <View style={styles.countDownBox}>
                                        {this.state.second <= 0 ? <Text style={styles.countDownText} onPress={this._getCode}>replace</Text> :
                                        <Text style={styles.countDownText}>{this.state.second}s</Text> }
                                    </View>
                                </View> : null
                        }
                        <View style={styles.btn}>
                            {
                            this.state.codeSended ?
                                <Text style={styles.btnText} onPress={this._login}>Sign In</Text> :
                                <Text style={styles.btnText} onPress={this._getCode}>Get Code</Text>
                            }
                        </View>
                    </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    signupBox:{
        paddingTop:30,
        paddingLeft:10,
        paddingRight:10,
    },
    inputField:{
        // flex:1,
        height:40,
        borderWidth:1,
        borderColor:"#ccc",
        borderRadius:4,
        padding:2,
        marginTop:6,
    },
    verifyBox:{
        flexDirection:"row",
        justifyContent:"space-between",
        height:46,
    },
    countDownBox:{
        marginTop:6,
        width:100,
        borderWidth:1,
        borderRadius:4,
        backgroundColor:'#ee735d',
        borderColor:'#ee735d',
        marginLeft:5,
        justifyContent:"center",
        alignItems:"center"
    },
    countDownText:{
        fontSize:18,
        color:"#fff",
        fontWeight:'600',
    },
    btn:{
        padding:8,
        borderWidth:1,
        borderColor:"#ee735d",
        borderRadius:4,
        marginTop:6,
        height:40,
        backgroundColor:"#ee735d",
        justifyContent:"center",
        alignItems:"center",
    },
    btnText:{
        fontSize:18,
        color:"#fff",
        fontWeight:"600"
    }
})