import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import Providers from "../constants/Providers";

export default function HomeScreen() {

  return (
    <ScrollView>
      <View style={styles.container}>
      {Providers.map(provider => (
            <View key={provider.key} style={{width:200}}>
              <Image
                style={{
                  width: 200,
                  height: 200,
                }}
                resizeMode="contain"
                source={provider.logo}
              />
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
