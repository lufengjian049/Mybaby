import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicator,
} from 'react-native';

const cacheData = {
    datas:[],
    nextPage:0,
    total:0
}

export default class RefreshListview extends Component{
    // static propType -- renderRow  fetchPromise pullrefresh renderFooter renderHeader
    constructor(props){
        super(props)
        this.state = {
            dataSource : new ListView.DataSource({
                rowHasChanged:(row1,row2) => row1!== row2
            }),
            isLoadingMore:false,
            isRefreshing:false
        }

        this._renderRow = this._renderRow.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._fetchMoreData = this._fetchMoreData.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }

    _fetchData(page){
        console.log("fetch start");
        let {fetchPromise} = this.props;
        if(page>0)
            this.setState({
                isLoadingMore:true
            })
        else
            this.setState({
                isRefreshing:true
            })
        fetchPromise().then((data) =>{
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
    _renderRow(rowdata){
        this.props.renderRow(rowdata);
    }
    _hasMore(){
        return cacheData.datas.length !== cacheData.total && cacheData.total>0;
    }
    _renderFooter(){
        let {renderFooter} = this.props;
        if(!this._hasMore() && cacheData.total !== 0){
            if(renderFooter){
                renderFooter();
            }else{
                return (
                    <View style={styles.loadingMore}>
                        <Text style={styles.loadingText}>no more data...</Text>
                    </View>
                )
            }
        }
        if(!this.state.isLoadingMore)
            return (
                <View style={styles.loadingMore}/>
            )
        return (
            <ActivityIndicator />
        )
    }
    _renderHeader(){
        let {renderHeader} = this.props;
        if(renderHeader)
            renderHeader();
        else
            return null;
    }
    _fetchMoreData(){
        if(!this._hasMore() || this.state.isLoadingMore){
            return
        }
        console.log("fetch more data");
        
        this._fetchData(cacheData.nextPage);
    }
    _onRefresh(){
        console.log('on refresh event :' + this.state.isRefreshing);
        
        if(this.state.isRefreshing)
            return;
        this._fetchData(0);
    }

    componentDidMount(){
        this._fetchData(0);
    }

    render(){
        return (
            <ListView dataSource={this.state.dataSource} 
                    renderRow={this._renderRow} 
                    style={styles.listview}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    onEndReached={this._fetchMoreData}
                    onEndReachedThreshold={20}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    showsVerticalScrollIndicator={false}
                    refreshControl={ pullrefresh ?
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                        />
                        : null
                    }
            />
        )
    }
}

const styles = StyleSheet.create({
    listview:{
        paddingTop:10,
    },
    loadingMore:{
        marginVertical:20
    },
    loadingText:{
        fontSize:18,
        color:'red',
        textAlign:'center'
    },
})