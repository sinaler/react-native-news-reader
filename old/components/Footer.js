import React from 'react'
import { Text, TouchableHighlight, View } from 'react-native'

import Display from './Display'
import Button from './Button'
import colors from '../constants/Colors'

const styles = {
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
    height: 40,
    padding: 6,
  },
  loadingHolder: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    opacity: 0.75,
  },
  errorHolder: {
    height: 40,
    padding: 6,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
}

const Footer = (props) => (
  <React.Fragment>
    <Display when={Boolean(props.error)}>
      <View style={styles.errorHolder}>
        <Text style={{color: colors.white}}>{props.error}</Text>
      </View>
    </Display>

    <View style={styles.footer}>
      <Display when={props.view === 'settings' || props.view === 'search' || props.view === 'providers'}>
        <TouchableHighlight onPress={() => props.setView('home')}>
          <Button icon="home" />
        </TouchableHighlight>
      </Display>
      <Display when={props.view === 'home'}>
        <TouchableHighlight onPress={() => props.setView('settings')}>
          <Button icon="slidersH" />
        </TouchableHighlight>

      </Display>
      <Display when={props.view === 'provider' || props.view === 'webview'}>
        <TouchableHighlight onPress={props.handleBackPress}>
          <Button icon="undo" />
        </TouchableHighlight>
      </Display>

      <Display when={props.view === 'home' || props.view === 'provider' || props.view === 'webview'}>
        <TouchableHighlight onPress={() => props.setView('search')}>
          <Button icon="search" />
        </TouchableHighlight>

        <Display when={props.isLoading}>
          <Button iconAnimated="syncAlt" color={colors.green} />
        </Display>

        <Display when={!props.isLoading}>
          <TouchableHighlight onPress={() => props.fetchAll()}>
            <Button icon="syncAlt" />
          </TouchableHighlight>
        </Display>
      </Display>
    </View>
  </React.Fragment>
)

export default Footer
