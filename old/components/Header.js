import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome, {Icons} from 'react-native-fontawesome'
import window from '../constants/Layout'
import Display from './Display'

const styles = {
  header: {
    width: window.width,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
  },
  logo: {
    width: 200,
    height: 40,
    resizeMode: 'contain',
  },
  arrowIconsContainer: {
    width: 44,
    padding: 8,
  },
  arrowIcons: {
    fontSize: 52,
    color: '#DDD',
  },
  arrowTextContainer: {
    padding: 10,
    paddingTop: 4,
    paddingBottom: 4,
    width: window.width / 2,
  },
  arrowText: {
    fontSize: 11,
    color: '#DDD',
  },
}

const Header = (props) => (
  <View>
    <View style={styles.header}>
      <View style={styles.arrowIconsContainer}>
        <Display when={props.index !== 0}>
          <TouchableOpacity onPress={() => props.loadWebview(props.index - 1)}>
            <FontAwesome style={{...styles.arrowIcons, color: props.blackTheme ? '#DDD' : '#333'}}>{Icons.angleLeft}</FontAwesome>
          </TouchableOpacity>
        </Display>
      </View>

      <TouchableOpacity onPress={props.handleBackPress}>
        <Image
          source={props.logo}
          style={styles.logo}
        />
      </TouchableOpacity>

      <View style={{...styles.arrowIconsContainer, marginRight: 0}}>
        <Display when={props.index !== (props.results.length - 1)}>
          <TouchableOpacity onPress={() => props.loadWebview(props.index + 1)}>
            <FontAwesome style={{...styles.arrowIcons, color: props.blackTheme ? '#DDD' : '#333'}}>{Icons.angleRight}</FontAwesome>
          </TouchableOpacity>
        </Display>
      </View>
    </View>

    <View style={{flexDirection: 'row'}}>
      <View style={styles.arrowTextContainer}>
        <Display when={props.index !== 0}>
          <TouchableOpacity onPress={() => props.loadWebview(props.index - 1)}>
            <Text style={{...styles.arrowText, color: props.blackTheme ? '#DDD' : '#333'}}>{props.results && props.results[props.index - 1] && props.results[props.index - 1].title}</Text>
          </TouchableOpacity>
        </Display>
      </View>
      <View style={styles.arrowTextContainer}>
        <Display when={props.index !== (props.results.length - 1)}>
          <TouchableOpacity onPress={() => props.loadWebview(props.index + 1)}>
            <Text style={{...styles.arrowText, color: props.blackTheme ? '#DDD' : '#333', textAlign: 'right'}}>{props.results[props.index + 1] && props.results[props.index + 1].title}</Text>
          </TouchableOpacity>
        </Display>
      </View>
    </View>
  </View>
)

export default Header
