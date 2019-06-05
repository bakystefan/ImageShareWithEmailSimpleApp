/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert, Image, PermissionsAndroid} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import Mailer from 'react-native-mail';
import RNGRP from 'react-native-get-real-path';

const imgDefault = require('./img/React_Native_Logo.png');

type Props = {};
export default class App extends Component<Props> {
  state = {
    text: '',
    renderImage: false,
    renderFirstScreen: true,
    lastScreen: false,
    filePath: ''
  }

  imageRef = React.createRef();

  renderFirstScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        onChangeText={(text) => {
          this.setState({
            text
          })
        }}
        placeholder="Enter Text"
        style={{ 
          width: 250,
          height: 50,
          borderColor: 'black',
          borderWidth: 1
        }}
      />
      <TouchableOpacity
        onPress={() => {
          if (this.state.text !== '') {
            this.setState({
              renderImage: true,
              renderFirstScreen: false
            })
          }
        }}
        style={{
          width: 150,
          height: 35,
          backgroundColor: 'blue',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 30
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  )

  renderImageFunc = (text) => (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View
        collapsable={false}
        ref={this.imageRef}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ImageBackground
          source={imgDefault}
          style={{
            width: 250,
            height: 200,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
          resizeMode="cover"
        >
          <Text
            style={{
              color: 'white'
            }}
          >{text}</Text> 
        </ImageBackground>
      </View>
      <TouchableOpacity
        onPress={() => {
          this.makeCaptureImage()
            this.setState({
              renderImage: false,
              renderFirstScreen: false,
              lastScreen: true
            })
        }}
        style={{
          width: 150,
          height: 35,
          backgroundColor: 'blue',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 30
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>SHARE</Text>
      </TouchableOpacity>
    </View>
  )

  makeCaptureImage = () => {
    captureRef(this.imageRef.current, { format: 'jpg', quality: 0.9 })
      .then(async (res) => {
        console.log('res', res)
        if (Platform.OS === 'android') {
          let realPath = await RNGRP.getRealPathFromURI(res);
          let filepath;
          if (realPath) {
            filepath = 'file://' + realPath;
          } else {
            filepath = res.uri;
          }
          this.setState({
            filePath: res
          })
          return this.sendMail(realPath);
        }
        this.sendMail(res);
        return this.setState({
          filePath: res
        })
      })
  }

  sendMail = (filePath) => {
    const { text } = this.state;
    Mailer.mail({
      subject: 'REACT NATIVE',
      recipients: ['stefanbakmaz@mail.com'],
      ccRecipients: ['stefanbakmaz@mail.com'],
      bccRecipients: ['stefanbakmaz@mail.com'],
      body: `<b>THIS IS TEXT: ${text}</b>`,
      isHTML: true,
      attachment: {
        path: filePath,  // The absolute path of the file from which to read data.
        type: 'jpg',   // Mime Type: jpg, png, doc, ppt, html, pdf
        name: 'SEND IMAGE FROM RN!',   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
      console.log('err', error);
        if(error) {
          Alert.alert('Error', 'Could not send mail. Login into email app on your phone!');
        }
    })
  }

  renderSuccessShareScreen = () => (
    <View>
      <Image
        source={{ uri: this.state.filePath }}
        style={{
          width: 250,
          height: 200,
        }}
        resizeMode="cover"
      />
      <Text>IS SHARED!</Text>
    </View>
  )

  render() {
    const { 
      renderImage,
      renderFirstScreen,
      text,
      lastScreen
    } = this.state;
    return (
      <View style={styles.container}>
        {
          renderFirstScreen ?
          this.renderFirstScreen()
          : null
        }
        {
          renderImage ?
            this.renderImageFunc(text)
            : null
        }
        {
          lastScreen ?
            this.renderSuccessShareScreen()
            : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
