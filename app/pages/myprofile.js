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
import ImagePicker from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

export default class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logined: false,
            user: null,
        };

        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        this._pickPhoto = this._pickPhoto.bind(this);
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
                    <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto}>
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
                        <TouchableOpacity style={styles.avatarBox} onPress={this._pickPhoto}>
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
    _pickPhoto(){
        let pickPhotoOptions = {
            title: '选择头像',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'从相册...',
            quality:0.8,
            allowsEditing:true,
            noData:false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.showImagePicker(pickPhotoOptions,(response)=>{
            if(response.didCancel){
                console.log("did cancel");
            }else if(response.error){
                console.log('error ',response.error);
            }else{
                // You can display the image using either data...
                // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                const source = {uri: response.uri, isStatic: true};
                }
                let userdata = this.state.user;
                userdata.avatar = source.uri;
                this.setState({
                    user: userdata
                });
            }
        })
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