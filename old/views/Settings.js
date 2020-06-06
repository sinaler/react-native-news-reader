import React from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'
import colors from '../constants/Colors'
import FontAwesome, {Icons} from 'react-native-fontawesome'
import prettysize from 'prettysize'
import app from '../../old/App'
import { convertDate } from '../helpers/Helpers'

const __DEV__ = 'dev'

const styles = {
  settings: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 17,
    color: colors.gray,
    marginTop: -2,
  },
  bold: {
    fontWeight: 'bold',
    color: colors.gray,
    fontSize: 18,
  },
  icon: {
    color: colors.green,
    fontSize: 20,
    marginRight: 12,
    marginLeft: 14,
  },
  warning: {
    color: colors.red,
    fontSize: 19,
    marginRight: 9,
    marginLeft: 13,
  },
  picker: {
    height: 40,
    width: 140,
    marginTop: -10,
    marginLeft: 3,
    color: colors.gray
  }
}

export default class Settings extends React.Component {
  state = {
    totalCount: '',
    resetCount: 10,
  }

  componentDidMount() {
    this.getTotalCount()
    this.props.getSettings()
  }

  getTotalCount = () => {
    this.props.db.transaction(tx => {
      tx.executeSql('select count(*) from data', [], (_, { rows }) =>
        this.setState({totalCount: rows._array[0]['count(*)']})
      )
    })
  }

  changeSettings = (key, value) => {
    this.props.db.transaction(tx => {
      tx.executeSql('update settings set value = ? where key = ?', [value ? 1 : 0, key])
      this.props.getSettings(key)
    })
  }

  resetData = () => {
    this.setState(prevState =>
      ({resetCount: prevState.resetCount - 1})
    ,() => {
      if (this.state.resetCount === 1) {
        this.props.initApp()
        this.getTotalCount()
      }
    })
  }

  render() {
    const { totalCount, resetCount } = this.state
    const { traffic, blackTheme, useScripts, useMultiple, autoUpdate, lastUpdate } = this.props.settings

    return (
      <React.Fragment>
        <View />
        <View style={{...styles.settings, backgroundColor: blackTheme ? colors.black : colors.white}}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => this.changeSettings('blackTheme', !blackTheme)}>
          <View style={styles.row}>
            <FontAwesome style={styles.icon}>{blackTheme ? Icons.checkSquare: Icons.square}</FontAwesome>
            <Text style={styles.text}>Gece modu</Text>
          </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => this.changeSettings('useScripts', !useScripts)}>
            <View style={styles.row}>
            <FontAwesome style={styles.icon}>{useScripts ? Icons.checkSquare: Icons.square}</FontAwesome>
            <Text style={styles.text}>Kaynaklardaki scriptleri gizle</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => this.changeSettings('useMultiple', !useMultiple)}>
            <View style={styles.row}>
            <FontAwesome style={styles.icon}>{useMultiple ? Icons.checkSquare: Icons.square}</FontAwesome>
            <Text style={styles.text}>Aynı anda birden fazla kaynağın{"\n"}seçilmesine izin ver</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <TouchableWithoutFeedback onPress={() => this.changeSettings('autoUpdate', !autoUpdate)}>
              <FontAwesome style={styles.icon}>{autoUpdate ? Icons.checkSquare: Icons.square}</FontAwesome>
            </TouchableWithoutFeedback>
            <View style={{flexDirection: 'row'}}>
              <TouchableWithoutFeedback onPress={() => this.changeSettings('autoUpdate', !autoUpdate)}>
                <Text style={styles.text}>Otomatik güncelleme</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => this.props.setView('providers')}>
            <View style={styles.row}>
              <FontAwesome style={styles.icon}>{Icons.rss}</FontAwesome>
              <Text style={{...styles.text, color: colors.green}}>Kaynaklar</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{...styles.container, marginTop: 50}}>
          <View style={styles.row}>
            <FontAwesome style={{...styles.icon, color: colors.gray, marginLeft: 15}}>{Icons.file}</FontAwesome>
            <Text style={styles.text}>Hafızadaki haber sayısı: {totalCount}</Text>
          </View>
        </View>
          <View style={styles.container}>
          <View style={styles.row}>
            <FontAwesome style={{...styles.icon, color: colors.gray, marginLeft: 12}}>{Icons.syncAlt}</FontAwesome>
            <Text style={styles.text}>Son güncelleme: {lastUpdate ? convertDate(lastUpdate, true) : '-'}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.row}>
            <FontAwesome style={{...styles.icon, color: colors.gray, marginLeft: 14}}>{Icons.database}</FontAwesome>
            <Text style={styles.text}>Data kullanımı: {prettysize(traffic)}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.row}>
            <FontAwesome style={{...styles.icon, color: colors.gray, marginLeft: 12, marginRight: 12}}>{Icons.listOl}</FontAwesome>
            <Text style={styles.text}>Version: {app.expo.version}</Text>
          </View>
        </View>
        {__DEV__ && <View style={styles.container}>
          <View style={styles.row}>
            <FontAwesome style={styles.warning}>{Icons.exclamationTriangle}</FontAwesome>
            <Text style={{...styles.text, color: colors.red}}>Dev Mod</Text>
          </View>
        </View>}
          {resetCount !== 0 && <View style={{...styles.container}}>
          <TouchableWithoutFeedback onPress={this.resetData}>
            <View style={styles.row}>
            <FontAwesome style={styles.warning}>{Icons.exclamationTriangle}</FontAwesome>
              <Text style={{...styles.text, color: colors.red}}>Hafızayı temizle! {resetCount < 10 && <Text>({resetCount})</Text>}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>}
      </View>
    </React.Fragment>)
  }
}
