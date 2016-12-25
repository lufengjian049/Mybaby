import React,{Component} from 'React';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class TabBar extends Component{
    static propTypes = {
        goToPage:React.PropTypes.func,
        activeTab:React.PropTypes.number,
        tabs:React.PropTypes.array,

        tabNames:React.PropTypes.array,
        tabIconNames:React.PropTypes.array
    }

    renderTabOption(tab,index){
        let color = this.props.activeTab == index ? "#ee735c" : "#ADADAD";
        return (
            <TouchableOpacity onPress={()=>this.props.goToPage(index)} style={styles.tab} key={tab}>
                <View style={styles.tabItem}>
                    <Icon name={this.props.tabIconNames[index]}
                        size={30} color={color}/>
                    <Text style={{color:color}}>
                        {this.props.tabNames[index]}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    setAnimationValue({value}) {
        console.log('动画值：'+value);
    }

    render(){
        return (
            <View style={styles.tabs}>
                {
                    this.props.tabs.map((tab,i) => this.renderTabOption(tab,i))
                }
            </View>
        )       
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 50,
    },

    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },

});