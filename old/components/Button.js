import React from 'react'
import {Text, View} from 'react-native'
import FontAwesome, {Icons} from 'react-native-fontawesome'
import colors from '../constants/Colors'
import FontAwesomeSpin from './FontAwesomeSpin'

const styles = {
  button: {
    borderRadius: 8,
    width: 48,
    height: 38,
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
    marginRight: 8,
    marginLeft: 8,
    color: colors.gray,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 6,
    marginRight: 6,
    marginTop: -2,
  },
}

const Button = (props) => {
  const color = props.color || styles.button.color

  return (
    <View style={{...styles.button, width: props.width || styles.button.width}}>
      {props.icon && <View>
        <FontAwesome style={{...styles.buttonIcon, color}}>{Icons[props.icon]}</FontAwesome>
      </View>}
      {props.iconAnimated && <View>
        <FontAwesomeSpin style={{...styles.buttonIcon, color}}>{Icons[props.iconAnimated]}</FontAwesomeSpin>
      </View>}
      {props.text && <Text style={{...styles.buttonText, color}}>{props.text}</Text>}
      {props.iconNext && <View>
        <FontAwesome style={{...styles.buttonIcon, color}}>{Icons[props.iconNext]}</FontAwesome>
      </View>}
    </View>
)}

export default Button
