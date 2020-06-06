import React from 'react'
import {
  View,
  TextInput
} from 'react-native'
import colors from '../constants/Colors'

const styles = {
  searchHolder: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  search: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    borderColor: '#777',
    borderWidth: 1,
    color: '#AAA',
    fontSize: 18,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4
  }
}

export default class Search extends React.Component {
  state = {
    search: null,
  }

  render() {
    const { search } = this.state

    return (
      <React.Fragment>
        <View />
        <View style={{...styles.searchHolder, backgroundColor: this.props.blackTheme ? colors.black : colors.white}}>
          <TextInput
            style={styles.search}
            onChangeText={(search) => this.setState({search})}
            onSubmitEditing={() => this.props.handleSearch({search})}
            value={search}
            placeholder="Arama..."
            autoFocus
          />
        </View>
    </React.Fragment>
    )
  }
}
