import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    Image,
    Text,
    View
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';
import Header from "../components/Header";

const {width, height} = Dimensions.get('window');

export default class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logined: false,
            user: null,
        };

        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
    }

    render() {

        let user = this.state.user;

        if (!user) {
            return <View />
        }
        return (
            <View style={styles.container}>

                <Header title="My profile"/>

                {!user.avatar ?
                    <TouchableOpacity style={styles.avatarContainer}>
                        <Image style={styles.avatarContainer}
                               source={{uri: user.avatar}}>
                            <View style={styles.avatarBox}>
                                <Image
                                    style={styles.avatar}
                                    source={{uri: user.avatar}}>
                                </Image>
                            </View>
                            <Text style={styles.avatarText}>点击这里更换头像</Text>
                        </Image>

                    </TouchableOpacity>
                    :

                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>添加用户头像</Text>

                        <TouchableOpacity style={styles.avatarBox}>

                            <Icon
                                name='md-add'
                                size={45}
                                style={styles.plusIcon}/>

                        </TouchableOpacity>

                    </View>
                }
            </View>
        );
    }
    componentDidMount() {
        this._asyncGetAppStatus();
    }
    _asyncGetAppStatus() {
        AsyncStorage.getItem('user')
            .then(
                (data)=> {
                    let user;
                    let newState = {};
                    if (data) {
                        user = JSON.parse(data);
                    }

                    if (user && user.accessToken) {
                        newState.logined = true;
                        newState.user = user;
                    } else {
                        newState.logined = false;
                    }

                    this.setState(newState);
                }
            )
            .catch((err)=> {
                alert(err);
            });
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