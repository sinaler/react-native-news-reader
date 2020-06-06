import React from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'
import colors from '../constants/Colors'
import FontAwesome, {Icons} from 'react-native-fontawesome'

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
    marginLeft: 12,
    marginRight: 10,
    marginBottom: 6,
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
    marginLeft: 12,
  },
}

export default class Providers extends React.Component {
  state = {
    providers: [],
  }

  componentDidMount() {
    this.props.getProviders()
  }

  changeProvider = (key, value) => {
    this.props.db.transaction(tx => {
      if (this.isProviderActive(key) === 0 || this.isProviderActive(key) === 1) {
        tx.executeSql('update providers set isActive = ? where key = ?', [value ? 1 : 0, key])
      } else {
        tx.executeSql('insert into providers (key, isActive) values (?, ?)', [key, value ? 1 : 0])
      }
      this.props.getProviders()
    })
  }

  isProviderActive = (key) => {
    const result = this.props.providers.filter(provider => provider.key === key)
    return result && result[0] && result[0].isActive
  }

  render() {
    const { blackTheme, providersData } = this.props

    return (
      <React.Fragment>
        <View />
        <View style={{...styles.settings, backgroundColor: blackTheme ? colors.black : colors.white}}>
          <View style={{...styles.container, marginTop: 10, marginLeft: 25}}>
            <Text style={styles.bold}>Kaynaklar</Text>
          </View>
          {providersData.map(provider => (
            <View style={styles.container} key={provider.key}>
              <TouchableWithoutFeedback onPress={() => this.changeProvider(provider.key, !this.isProviderActive(provider.key))}>
              <View style={styles.row}>
                <FontAwesome style={styles.icon}>{this.isProviderActive(provider.key) ? Icons.checkSquare: Icons.square}</FontAwesome>
                <Text style={styles.text}>{provider.name}</Text>
              </View>
              </TouchableWithoutFeedback>
            </View>))}
      </View>
    </React.Fragment>)
  }
}
