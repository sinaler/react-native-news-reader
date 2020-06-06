import { StyleSheet, View } from 'react-native'
import layout from './Layout'
import colors from './Colors'
let styles
export default styles = StyleSheet.create({
  container: {
    width: layout.width,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  homeImage: {
    height: 100,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 40,
    marginTop: 42,
    resizeMode: 'contain',
  },
  providerHolder: {
    alignItems: 'center',
  },
  providerContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 8,
    paddingBottom: 4,
    paddingTop: 4,
    borderRadius: 8,
  },
  providerImageContainer: {
    width: 76,
    height: 70,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
    marginBottom: 3,
  },
  providerImage: {
    width: 66,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  providerImageCheck: {
    backgroundColor: colors.green,
    color: colors.white,
    fontSize: 16,
    position: 'absolute',
    right: -3,
    top: -3,
    borderRadius: 12,
    padding: 3,
    width: 22,
    height: 22,
  },
  lastMinute: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 18,
  },
  info: {
    flexDirection: 'row',
    marginLeft: 3,
    marginRight: 3,
    marginTop: 4,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    display: 'flex',
  },
  infoLeft: {
    width: '50%'
  },
  infoRight: {
    width: '50%',
    alignItems: 'flex-end',
    marginLeft: 'auto'
  },
  topicContainer: {
    marginTop: 25,
    paddingLeft: 15,
    paddingRight: 15,
  },
  topicTitle: {
    fontSize: 22,
    lineHeight: 25,
    color: colors.white,
    marginBottom: 15,
  },
  topicText: {
    fontSize: 16,
    lineHeight: 19,
    color: '#c4c4c4',
    marginBottom: 10,
  },
  topicDate: {
    fontSize: 12,
    lineHeight: 14,
    color: '#c4c4c4',
  },
})
