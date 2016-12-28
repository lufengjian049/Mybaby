import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import request from "../common/request";
import ListItem from "../components/ListItem";
import ListDetail from "./list.detail";
import RefreshListview from "../components/RefreshListview";
import Header from "../components/Header";

export default class List  extends Component{
    constructor(props) {
        super(props);
        this._loadPage = this._loadPage.bind(this);
        this._renderRow = this._renderRow.bind(this);
    }
    
    _loadPage(rowData){
        let {navigator} = this.props;
        if(navigator){
            navigator.push({
                name:"listdetail",
                component:ListDetail,
                params:{
                    rowData:rowData
                }
            })
        }
    }

    _renderRow(rowData){
        return (
            <ListItem rowData={rowData} 
                onSelect = {()=>this._loadPage(rowData)}
                key={rowData._id} />
        )
    }

    render(){
        return (
            <View style={styles.container}>
                <Header title="视频列表"/>
                
                 <RefreshListview fetchPromise={()=>{
                     return request.get("list",{
                                accessToken:"dddd"
                            })
                 }} renderRow={this._renderRow} pullrefresh={true} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

