import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    Platform,
    ListView,
    TouchableHighlight,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

import request from "../common/request";
import ListItem from "../components/ListItem";
import ListDetail from "./list.detail";

const cacheData = {
    datas:[],
    nextPage:0,
    total:0
}

export default class List  extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource : new ListView.DataSource({
                rowHasChanged:(row1,row2) => row1!== row2
            }),
            isLoadingMore:false,
            isRefreshing:false
        }
    }
    fetchData(page){
        console.log("fetch start");
        if(page>0)
            this.setState({
                isLoadingMore:true
            })
        else
            this.setState({
                isRefreshing:true
            })
        request.get("list",{
            accessToken:"dddd"
        }).then((data) =>{
            if(page == 0){
                cacheData.datas = [];
                cacheData.nextPage = 0;
            }
                
            cacheData.datas = cacheData.datas.concat(data.data);
            cacheData.nextPage++;
            cacheData.total = data.total;
            console.log("datas length = "+cacheData.datas.length);
            console.log("total = "+cacheData.total);
            setTimeout(()=>{
                this.setState({
                    isLoadingMore:false,
                    isRefreshing:false,
                    dataSource:this.state.dataSource.cloneWithRows(
                        cacheData.datas
                    )
                })
            },400)
            
        }).catch((err)=>{
            this.setState({
                isLoadingMore:false
            })
            console.log(err);
        })
        
    }

    componentDidMount(){
        this.fetchData(0);
    }
    _loadPage=(rowData)=>{
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

    _renderRow = (rowData)=>{
        return (
            <ListItem rowData={rowData} 
                onSelect = {()=>this._loadPage(rowData)}
                key={rowData._id} />
        )
    }
    _hasMore(){
        console.log(cacheData.total)
        console.log(cacheData.datas.length !== cacheData.total);
        return cacheData.datas.length !== cacheData.total && cacheData.total>0;
    }
    _fetchMoreData=()=>{
        if(!this._hasMore() || this.state.isLoadingMore){
            return
        }
        console.log("fetch more data");
        
        this.fetchData(cacheData.nextPage);
    }
    _onRefresh=()=>{
        console.log('on refresh event :' + this.state.isRefreshing);
        
        if(this.state.isRefreshing)
            return;
        this.fetchData(0);
    }
    _renderFooter=()=>{
        if(!this._hasMore() && cacheData.total !== 0){
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多数据了...</Text>
                </View>
            )
        }
        if(!this.state.isLoadingMore)
            return (
                <View style={styles.loadingMore}/>
            )
        return (
            <ActivityIndicator />
        )
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTxt}>视频列表</Text>
                </View>
                <ListView dataSource={this.state.dataSource} 
                    renderRow={this._renderRow} 
                    style={styles.listview}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    onEndReached={this._fetchMoreData}
                    onEndReachedThreshold={20}
                    renderFooter={this._renderFooter}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                        />
                    }/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    header:{
        paddingTop:Platform.OS === "ios" ? 25 : 12,
        paddingBottom:12,
        backgroundColor:"#ee735c"
    },
    headerTxt:{
        color:"#fff",
        textAlign:"center",
        fontSize:16,
        fontWeight:"600"
    },
    listview:{
        paddingTop:30
    },
    loadingMore:{

        marginVertical:20
    },
    loadingText:{
        fontSize:18,
        color:'red',
        textAlign:'center'
    },
});

