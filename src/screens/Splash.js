import { View, Text, FlatList, SafeAreaView, Dimensions, StatusBar, KeyboardAvoidingView, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React, { useState, useContext, } from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../theme/style'
import { Colors } from '../theme/color'
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar } from '@react-native-material/core';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Splash() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg,  }]}>
            <StatusBar translucent={true} backgroundColor='transparent' barStyle={'light-content'} />
            <ImageBackground source={require('../../assets/image/bg.png')} resizeMode='stretch' style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                <Image style={{ height: 200, width: 200 }}
                source={require('../../assets/image/TARGET100.png')} 
                resizeMode='stretch'   
                 />
            </ImageBackground>
        </SafeAreaView>
    )
}