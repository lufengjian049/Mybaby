import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Navigator} from 'react-native';

import List from "./pages/list";
import Moviedit from "./pages/moviedit";
import Myprofile from "./pages/myprofile";
import Picture from "./pages/picture";
import Login from "./pages/login";

import TabBar from "./components/TabBar";
import ScrollableTabView from "react-native-scrollable-tab-view";

export default class App extends Component{
    constructor(props) {
        super(props)
        this.state = {
            tabNames: ['视频', '录制', '图片', '我的'],
            tabIconNames: ['ios-videocam', 'ios-recording', 'ios-reverse-camera', 'ios-contact'],
            logined:false,
            user:null,
            isCkecking:true,
        }
        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        this._afterLogin = this._afterLogin.bind(this);
    }
    _asyncGetAppStatus(){
        AsyncStorage.getItem("user")
            .then((data)=>{
                console.log("-----"+data);
                var user = null,newState={isCkecking:false};
                if(data){
                    user = JSON.parse(data);
                }
                if(user && user.accessToken){
                    newState.logined = true;
                    newState.user = user;
                }else{
                    newState.logined = false;
                }
                this.setState(newState);
            })
        // .catch(()=>{
        //     console.log("ddd")
        // })
    }
    _afterLogin(user){
        var user2 = JSON.stringify(user);
        AsyncStorage.setItem("user",user2)
            .then(()=>{
                this.setState({
                    logined:true,
                    user:user
                })
            })
    }

    componentDidMount(){
        this._asyncGetAppStatus();
    }

    render(){
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        console.log("Checking:"+this.state.isCkecking);
        if(this.state.isCkecking){
            return (
                <View>
                    <Text>Checking...</Text>
                </View>
            )
        }

        if(this.state.logined)
            return (
                <ScrollableTabView
                    renderTabBar={() => <TabBar tabNames={tabNames} tabIconNames={tabIconNames}/>}
                    tabBarPosition='bottom'
                    onChangeTab={
                        (obj) => {
                            console.log('被选中的tab下标：' + obj.i);
                        }
                    }
                    onScroll={
                        (position) => {
                            console.log('滑动时的位置：' + position);
                        }
                    }
                    locked={false}
                    initialPage={3}
                    prerenderingSiblingsNumber={1}
                >   
                    <Navigator
                        tabLabel="list"
                        initialRoute={{ name: 'list', component: List }}
                        configureScene={
                                (route) => {
                                    //这个是页面之间跳转时候的动画，具体有哪些？可以看这个目录下，有源代码的: node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorSceneConfigs.js
                                // return Navigator.SceneConfigs.PushFromRight;
                                    return ({
                                        ...Navigator.SceneConfigs.PushFromRight,
                                        gestures: null
                                    });
                                }
                        }
                        renderScene={(route, navigator) =>{
                                let Component = route.component;
                                return <Component {...route.params} navigator={navigator} />
                            }
                        } 
                    />
                    <Moviedit tabLabel="edit" />
                    <Picture tabLabel="pic" />
                    <Myprofile tabLabel="account"/>
                </ScrollableTabView>
            )
        else
            return (
                <Login afterLogin={this._afterLogin}>
                </Login>
            )
    }
}

const styles = StyleSheet.create({
    
});