import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import Providers from "../constants/Providers";
import providersData from "../old/constants/Providers"
import {convertText} from "../old/helpers/Helpers"

export default function HomeScreen() {

  const fetchData = (provider, isMultiple = false, index = false) => {
    if (isMultiple) {
      provider = providersData[index]
    }

      fetch(provider.url)
      .then(response => response.text())
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e)
      });
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      {Providers.map(provider => (
            <View key={provider.key} style={{width:200}}>
              <TouchableOpacity onPress={() => fetchData(provider)}>

              <Image
                style={{
                  width: 200,
                  height: 200,
                }}
                resizeMode="contain"
                source={provider.logo}
              />
              </TouchableOpacity>
            </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});
