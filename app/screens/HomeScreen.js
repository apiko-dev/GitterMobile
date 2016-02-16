import React, {
  Component,
  PropTypes,
  ScrollView,
  ToolbarAndroid,
  Image,
  Text,
  View
} from 'react-native'
import _ from 'lodash'
import s from '../styles/HomeStyles'
import {THEMES} from '../constants'
import ParallaxScrollView from '../components/ParallaxScrollView'

const {colors} = THEMES.gitterDefault

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.onChangeHeaderVisibility = this.onChangeHeaderVisibility.bind(this)

    this.state = {
      visible: false
    }
  }

  componentDidMount() {
  }

  onChangeHeaderVisibility(value) {
    if (value === this.state.visible) return

    this.setState({visible: value})
  }

  renderOrgs() {
    return (
      <View style={{
        margin: 4,
        marginTop: 0,
        elevation: 2,
        backgroundColor: 'white',
        alignSelf: 'stretch'
      }}>
        {_.range(50).map(_ => <View style={{height: 50}}><Text>Your organization</Text></View>)}
      </View>
    )
  }


  render() {
    const elevation = this.state.visible ? {height: 100} : {}
    return (
      <View style={s.container}>

          <ParallaxScrollView
             backgroundColor={colors.green}
             contentBackgroundColor="pink"
             parallaxHeaderHeight={400}
             pivotOffset={56}

             renderStickyHeader={() => (
               <ToolbarAndroid
                 actions={[{title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}]}
                 navIcon={require('image!ic_menu_white_24dp')}
                 onIconClicked={this.props.onMenuTap}
                 title="Home"
                 titleColor="white"
                 style={[s.toolbar, elevation]} />
             )}

             renderBackground={() => (
               <Image
                 source={require('../images/gitter-background.jpg')}/>
             )}
             renderForeground={() => (
              <View style={{ height: 400, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                 <Text style={s.welcome}>
                   Welcome to Gitter mobile!
                 </Text>
               </View>
             )}>

          {this.renderOrgs()}
          <Text style={s.instructions}>
            Shake or press menu button for dev menu
          </Text>
        </ParallaxScrollView>
      </View>
    )
  }
}

HomeScreen.propTypes = {
  onMenuTap: PropTypes.func.isRequired,
  suggestedRooms: PropTypes.array,
  favorites: PropTypes.array
}
