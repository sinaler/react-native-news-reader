import React, { Component } from 'react'
import { WebView } from 'react-native'

export default class BackgroundTaskRunner extends Component {
  counter = 0;

  handleMessage = () => {
    this.counter++
    console.log(this.counter)
    this.props.fetchAll()
  }

  render() {
    return (
      <WebView
        source={{html: '<html><body></body></html>'}}
        javaScriptEnabled={true}
        style={{ position: 'absolute', zIndex: -9999, left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#000'}}
        injectedJavaScript={'setInterval(() => window.postMessage(), 10 * 60 * 1000)'}
        onMessage={this.handleMessage}
      />
    )
  }
}

