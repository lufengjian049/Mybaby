import {Dimensions, PixelRatio} from 'react-native';

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    onePR: 1 / PixelRatio.get()
}

export default {
    window
}
