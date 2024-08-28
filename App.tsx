import { View, Text } from 'react-native'
import React from 'react'
import StackNavigator from './src/navigator/StackNavigator'
import 'react-native-gesture-handler';
import { AuthProvider } from './src/screens/Login/AuthContext';

export default function App() {
  return (
    <AuthProvider>
    <StackNavigator/>
    </AuthProvider>
  )
}



