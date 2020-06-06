import React from 'react'
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  BackHandler,
  WebView,
  NetInfo,
} from 'react-native'
import FontAwesome, { Icons, IconTypes } from 'react-native-fontawesome'
import { parseString } from 'react-native-xml2js'
import DOMParser from 'dom-parser'
import styles from '../constants/Styles'
import colors from '../constants/Colors'
import images from '../constants/Images'
import layout from '../constants/Layout'
import providersData from '../constants/Providers'
import { convertDate, convertText, convertTimestamp, isCloseToBottom } from '../helpers/Helpers'


import Header from '../components/Header'
import Footer from '../components/Footer'
import Display from '../components/Display'
import Button from '../components/Button'
import Settings from './Settings'
import Search from './Search'
import Providers from './Providers'

import { SQLite } from 'expo'
const __DEV__ = 'dev'
const db = SQLite.openDatabase(__DEV__ ? 'db-dev.db' : 'db.db')

export default class Home extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    view: 'home',
    isProviderLoaded: false,
    isWebviewLoaded: false,
    isLoading: false,
    error: false,
    index: null,
    search: null,
    settings: {
      blackTheme: 1,
      useScripts: 0,
    },
    data: [],
    selectedProviders: [],
    showAll: false,
    page: 1,
    providers: [],
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)

    //Speech.speak('Alternatif Habere Hoş Geldiniz', {language: 'tr-TR'})
    //this.fetchAll()

    this.initApp()
  }

  initApp = (deleteTables = false) => {
    if (deleteTables) {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM data',[],
          (tx,results) => {},
          (tx,error) => {}
        )
      })
    }

    db.transaction(tx => {
      tx.executeSql('create table if not exists data (id integer primary key not null, title text, text text, time int, url text, provider text, unique(url), image)')
      tx.executeSql('create table if not exists settings (key text primary key not null, value int, unique(key))')
      tx.executeSql('create table if not exists providers (key text primary key not null, isActive bool, lastUpdate int, unique(key))')

      tx.executeSql('insert into settings (key, value) values (?, ?)', ['traffic', 0])
      tx.executeSql('insert into settings (key, value) values (?, ?)', ['lastUpdate', 0])
      tx.executeSql('insert into settings (key, value) values (?, ?)', ['blackTheme', 1])
      tx.executeSql('insert into settings (key, value) values (?, ?)', ['autoUpdate', 0])
      tx.executeSql('insert into settings (key, value) values (?, ?)', ['useMultiple', 0])
      tx.executeSql('insert into settings (key, value) values (?, ?)', ['useScripts', 0])

      providersData.forEach(provider => {
        tx.executeSql('insert into providers (key, isActive) values (?, ?)', [provider.key, 1])
      })

      this.getSettings()
      this.getProviders()
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

  getSettings = (key) => {
    const settings = key ? [key] : ['traffic', 'blackTheme', 'useScripts', 'useMultiple', 'autoUpdate', 'lastUpdate']

    settings.forEach(key => {
      db.transaction(tx => {
        tx.executeSql('select value from settings where key = ?', [key], (_, { rows }) =>
          this.setState(prevState => ({
            settings: {
              ...prevState.settings,
              [key]: (rows._array[0] && rows._array[0].value) || 0,
            }
          }))
        )
      })
    })
  }

  getProviders = () => {
    db.transaction(tx => {
      tx.executeSql('select * from providers', [], (_, { rows }) => {
        this.setState({
          providers: rows._array
        })
      }
      )
    })
  }


  handleBackPress = () => {
    const view = this.state.view
    if (view === 'webview') {
      this.setState({
        view: 'provider',
        isLoading: false,
        error: false,
      }, () => {
        setTimeout(() => {
          if (this.state.view === 'provider') {
            this.scrollView.scrollTo({y: Number.parseInt(this.state.offset), animated: true})
          }
        }, 200)
      })
    } else if (view === 'provider' || view === 'settings' || view === 'search' || view === 'home') {
      this.setState({
        view: 'home',
        selectedProviders: [],
        isLoading: false,
        error: false,
        search: null,
        showAll: false,
        page: 1,
      })
    } else {
      return false
    }

    return true
  }

  loadWebview = (index) => {
    this.setState({
      view: 'webview',
      index,
    })
  }

  loadWebViewNext = () => {
    const { index, providers, selectedProviders} = this.state
    if (index !== providers[selectedProviders[0]].length - 1) {
      this.setState({
        isWebviewLoaded: true,
        index: index + 1,
      })
    }
  }

  toggleProvider = (provider, isLongPress) => {
    const { selectedProviders, settings } = this.state
    const { useMultiple } = settings
    const index = selectedProviders.indexOf(provider.key)

    const timestamp = Math.round((new Date()).getTime() / 1000)

    //console.log(convertTimestamp(this.getProviderLastUpdate(provider.key)))
    //console.log(convertTimestamp(this.state.settings.lastUpdate))

    if (isLongPress || timestamp - this.getProviderLastUpdate(provider.key) > 300) {
      this.fetchData(provider, false, 0)
    }

    if (index === -1) {
      selectedProviders.push(provider.key)
      this.renderData(selectedProviders).then(() => {
        this.setState({
          view: 'provider'
        }, () => this.scroll())
      })
    } else {
      selectedProviders.splice(index, 1)
    }

    this.setState({
      selectedProviders: useMultiple ? selectedProviders : [provider.key],
      search: null,
      showAll: false,
    })

    if (!selectedProviders.length && useMultiple) {
      this.setState({
        view: 'home',
      })
    }
  }

  fetchAll = (skipLastUpdate = false) => {
    const timestamp = Math.round((new Date()).getTime() / 1000)
    if (skipLastUpdate || timestamp - this.state.settings.lastUpdate > 300) {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.fetchData(false, true, 0)
        } else {
          this.renderMessage('error', 'Internet bağlantısı kurulamadı!')
        }
      })
    }
  }

  fetchData = (provider, isMultiple = false, index = false) => {
    if (isMultiple) {
      provider = providersData[index]
    }

    this.setState({
      isLoading: true,
      error: false,
    })

    if (this.isProviderActive(providersData[index].key)) {
      fetch(provider.url, {
        mode:'no-cors',
      })
        .then(response => response.text())
        .then((response) => {
          parseString(response, (err, result) => {
            let items = result.rss.channel[0].item

            const timestamp = Math.round((new Date()).getTime() / 1000)
            items = items.splice(0, 40)
            items.forEach(item => {
              const newItem = {
                title: convertText(item.title[0]),
                text: convertText(item.description[0]),
                time: new Date(item.pubDate[0]).getTime() / 1000,
                url: item.link[0],
                provider: provider.key,
              }

              if (provider.key === 'yurt') {
                newItem.time = newItem.time - (60 * 60)
              }

              db.transaction(tx => {
                tx.executeSql(
                  'insert into data (title, text, time, url, provider) values (?, ?, ?, ?, ?)',
                  [newItem.title, newItem.text, newItem.time, newItem.url, newItem.provider])
              })
/*
              fetch("https://cors-anywhere.herokuapp.com/https://www.google.com/search?source=lnms&sa=X&gbv=1&tbm=isch&q=Oscar",
              { headers: {Origin: 'http://localhost' }})
              .then( res => res.text() )
              .then( res => {
                let parser = new DOMParser()
                parser = parser.parseFromString(res, "text/html")

                let images = parser.getElementById("ires").childNodes[0]
                images = images.childNodes[0].childNodes
                console.log(images[0].childNodes[0])
              }).catch((error) => {console.log(error)})*/
            })

            db.transaction(tx => {
              tx.executeSql('update settings set value = value + ? where key = "traffic"', [response.length])
              tx.executeSql('update settings set value = ? where key = "lastUpdate"', [timestamp])
              tx.executeSql('update providers set lastUpdate = ? where key = ?', [timestamp, provider.key])

              this.getProviders()
              this.getSettings()
            })

            if (!isMultiple) {
              this.scroll()
            }

            this.setState({
              isLoading: false,
            })

            if (isMultiple && index !== providersData.length - 1) {
              this.fetchData(false, true, index + 1)
            }
          })
        })
        .catch(() => {
          this.renderMessage('error', 'Kaynak yüklenirken bir hata oluştu(' + provider.key + ')!')

          db.transaction(tx => {
            tx.executeSql('update providers set isActive = 0 where key = ?', [provider.key])
          })

          if (isMultiple && index !== providersData.length - 1) {
            this.fetchData(false, true, index + 1)
          }
        })
    } else {
      if (isMultiple && index !== providersData.length - 1) {
        this.fetchData(false, true, index + 1)
      }
    }
  }

  scroll = () => {
    setTimeout(() => {
      if (this.state.view === 'provider') {
        this.scrollView.scrollTo({y: 385, animated: true})
      }
    }, 250)
  }

  renderData = (providers, limit = 25) => {
    let sqlQuery
    if (providers) {
      sqlQuery = 'select * from data where provider in ("' + providers.join('","') + '") order by time desc limit ?'
    } else {
      sqlQuery = 'select * from data order by time desc limit ?'
    }

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(sqlQuery, [limit],
          (_, { rows }) => {
            const data = rows._array
            resolve(data)
            this.setState(prevState => ({
              page: prevState.page + 1,
              data,
              count: data.length,
            }))
          }, error => { reject(error)}
        )
      })
    })
  }

  renderMessage = (type, message) => {
    this.setState({
      isLoading: false,
      error: message,
    })
    setTimeout(() => {
      this.setState({
        error: false,
      })
    }, 3000)
  }

  setView = (view) => {
    this.setState({view})
  }

  refScrollView = (scrollView) => {
    this.scrollView = scrollView
  }

  handleSearch = ({ search }) => {
    const sqlQuery = 'select * from data where title like ? order by time desc limit ?'

    db.transaction(tx => {
      tx.executeSql(sqlQuery, ['%' + search.toLowerCase() + '%', 25],
        (_, { rows }) => {
          const data = rows._array
          if (!data.length) {
            this.renderMessage('error', 'Arama sonucu bulanamadı')
            this.setState({
              search,
              view: 'home',
            })
          } else {
            this.setState({
              search,
              view: 'provider',
              data,
              count: data.length,
            })
          }
        }
      )
    })
  }

  handleScroll = ({nativeEvent}) => {
    const { selectedProviders, page } = this.state
    if (isCloseToBottom(nativeEvent)) {
      this.renderData(selectedProviders.length ? selectedProviders : null, page * 25)
    }
    const offset = nativeEvent.contentOffset.y.toString().split('.')

    this.setState({ offset: offset[0] })
  }

  setShowAll = () => {
    this.renderData().then(() => {
      this.setState({
        view: 'provider',
        showAll: true,
      }, () => this.scroll())
    })
  }

  isProviderActive = (key) => {
    const result = this.state.providers.filter(provider => provider.key === key)
    return (result && result[0] && result[0].isActive) || null
  }

  getProviderLastUpdate = (key) => {
    const result = this.state.providers.filter(provider => provider.key === key)
    return (result && result[0] && result[0].lastUpdate) || null
  }

  getProviderName = (key) => {
    const result = providersData.filter(provider => provider.key === key)
    return (result && result[0] && result[0].name) || null
  }

  render() {
    const { index, isLoading, error, view, selectedProviders, search, data, page, settings, count, providers, showAll } = this.state
    const { blackTheme, useScripts, lastUpdate } = settings

    const backgroundColor = blackTheme ? colors.black : colors.white
    const logo = blackTheme ? 'logoBlackLight' : 'logoWhiteLight'

    const resultPerPage = 25
    const results = data.slice(0, page * resultPerPage)

    return (
      <View style={{ ...styles.container, backgroundColor }}>
        <Display when={view === 'webview'}>
          <Header
            blackTheme={blackTheme}
            logo={images[logo]}
            results={results}
            index={index}
            loadWebview={this.loadWebview}
            handleBackPress={this.handleBackPress}
          />
          <WebView
            source={{uri: results[index] && results[index].url}}
            style={{height: layout.height - 100, width: layout.width}}
            javaScriptEnabled={Boolean(!useScripts)}
            onLoadStart={() => this.setState({ isLoading: true })}
            onLoadEnd={() => this.setState({ isLoading: false })}
            // onLoadEnd={this.loadWebViewNext}
          />
        </Display>

        <Display when={view === 'home' || view === 'provider'}>
          <ScrollView
            stickyHeaderIndices={[0]}
            ref={this.refScrollView}
            onScroll={this.handleScroll}
            scrollEventThrottle={400}
          >
            <View style={{...styles.homeImage, backgroundColor}}>
              <TouchableOpacity onPress={this.handleBackPress}>
                <Image
                  source={images[logo]}
                  style={styles.logo}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.providerHolder}>
              <View style={{...styles.providerContainer, backgroundColor: blackTheme ? colors.black : '#f7f7f7'}}>
                {providersData.map(provider => (
                  this.isProviderActive(provider.key) && <TouchableWithoutFeedback
                    key={provider.key}
                    onPress={() => this.toggleProvider(provider)}
                    onLongPress={() => this.toggleProvider(provider, true)}
                  >
                    <View style={{ ...styles.providerImageContainer, backgroundColor: provider.backgroundColor}}>
                      <Image
                        source={provider.logo}
                        style={styles.providerImage}
                      />
                      <Display when={(selectedProviders.indexOf(provider.key)) > -1}>
                        <FontAwesome style={styles.providerImageCheck}>{Icons.check}</FontAwesome>
                      </Display>
                    </View>
                  </TouchableWithoutFeedback>
                ))}

                <Display when={providers.length}>
                  <View style={styles.lastMinute}>
                    <TouchableHighlight onPress={() => this.setShowAll(false)} onLongPress={() => this.setShowAll(true)}>
                      <Button icon="exclamationTriangle" text="Son Dakika" width={120} color={colors.gray} />
                    </TouchableHighlight>
                  </View>
                </Display>

                <Display when={view === 'provider'}>
                  <View style={styles.info}>
                    <View style={styles.infoLeft}>
                      <Display when={lastUpdate && !search}>
                        <Text style={{color: blackTheme ? '#E0E0E0' : '#777'}}>Güncelleme: {convertTimestamp(showAll ? lastUpdate : this.getProviderLastUpdate(selectedProviders[0]))}</Text>
                      </Display>
                      <Display when={search}>
                        <Text style={{color: blackTheme ? '#E0E0E0' : '#777'}}>Arama: "{search}"</Text>
                      </Display>
                    </View>
                    <View style={styles.infoRight}>
                      <Display when={data.length}>
                        <Text style={{color: blackTheme ? '#E0E0E0' : '#777'}}>{count} başlık</Text>
                      </Display>
                    </View>
                  </View>
                </Display>
              </View>
            </View>

            <Display when={view === 'provider'}>
              <View style={{flex: 1, flexDirection: 'column'}}>
              {results.map((item, index) => (
                <View key={item.time + item.title} style={styles.topicContainer}>
                  <TouchableHighlight onPress={() => this.loadWebview(index)}>
                    <Text style={{...styles.topicTitle, color: blackTheme ? colors.white : colors.black}}>{item.title}</Text>
                  </TouchableHighlight>
                  <Text style={{...styles.topicText, color: blackTheme ? '#999' : '#666'}}>{item.text}</Text>
                  <Text style={{...styles.topicDate, color: blackTheme ? '#999' : '#666'}}>{this.getProviderName(item.provider) + ' - ' + convertDate(item.time)}</Text>
                </View>
              ))}
              </View>

              {results && 1 === 2 && <View style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 15, marginBottom: 5}}>
                <TouchableHighlight onPress={this.nextPage}>
                  <Button icon="chevronCircleDown" text="Daha fazla yükle" color={colors.gray} width={160} />
                </TouchableHighlight>
              </View>}
            </Display>
          </ScrollView>
        </Display>

        <Display when={view === 'settings'}>
          <Settings
            db={db}
            getSettings={this.getSettings}
            settings={settings}
            initApp={() => this.initApp(true)}
            setView={this.setView}
          />
        </Display>

        <Display when={view === 'search'}>
          <Search
            handleSearch={this.handleSearch}
            blackTheme={settings.blackTheme}
          />
        </Display>

        <Display when={view === 'providers'}>
          <Providers
            db={db}
            getProviders={this.getProviders}
            blackTheme={settings.blackTheme}
            providersData={providersData}
            providers={providers}
          />
        </Display>

        <Footer
          view={view}
          setView={this.setView}
          handleBackPress={this.handleBackPress}
          fetchAll={() => this.fetchAll(true)}
          isLoading={isLoading}
          error={error}
        />
      </View>
    )
  }
}


