import React from 'react'
import { StyleSheet, View, AppRegistry } from 'react-native'
import { AppLoading, Asset, Font, Permissions, TaskManager } from 'expo'
import images from './constants/Images'
import providers from './constants/Providers'
import Home from './views/Home'

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <View style={styles.container}>
          <Home />
        </View>
      )
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        images.logoBlack,
        images.logoWhite,
        ...providers.map(a => a.logo)
      ]),
      Font.loadAsync({
        'fa_solid_900': require('../assets/fonts/fa-solid-900.ttf'),
        FontAwesome5FreeSolid: require('../assets/fonts/fa-solid-900.ttf'),
      }),
    ])
  }

  _handleLoadingError = error => {
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
