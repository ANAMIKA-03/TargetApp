// screens/User.js
import React, { useContext } from 'react';
import { View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppBar } from '@react-native-material/core';
import firebase from '@react-native-firebase/app';
import style from '../../theme/style'; 
import { Colors } from '../../theme/color'; 
import { Dimensions } from 'react-native';

const User = () => {
  const navigation = useNavigation();
  const { formData, setFormData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const { width } = Dimensions.get('screen'); 

  const registerUser = () => {
    if (!formData.displayName || !formData.email || !formData.password) {
      Alert.alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: formData.displayName,
        });
        console.log('User registered successfully!');
        setFormData({ email: '', password: '', displayName: '' });
        setIsLoading(false);
        navigation.navigate('Login');
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert(error.message);
      });
  };

  if (isLoading) {
    return (
      <View style={style.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
          <AppBar
            title='Create a username'
            titleStyle={[style.apptitle, { color: Colors.txt }]}
            centerTitle={true}
            style={{ backgroundColor: 'transparent' }}
            elevation={0}
            leading={<TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back' size={24} color={Colors.active} />
            </TouchableOpacity>}
          />

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
            <Text style={[style.r14, { color: Colors.txt, marginTop: 15 }]}>Username</Text>
            <View style={[style.inputcontainer, { marginTop: 8, backgroundColor: Colors.bg }]}>
              <Icon name='person-outline' size={24} color={Colors.primary}></Icon>
              <TextInput
                placeholder='Your username'
                placeholderTextColor={Colors.disable}
                selectionColor={Colors.primary}
                value={formData.displayName}
                onChangeText={(value) => setFormData({ ...formData, displayName: value })}
                style={[style.r14, { color: Colors.active, flex: 1, marginBottom: -4, marginLeft: 10 }]}
              />
            </View>
          </ScrollView>

          <Text style={[style.m16, { color: Colors.primary, textAlign: 'right' }]}>3 of 3</Text>

          <View style={{ height: 8, borderRadius: 8, backgroundColor: '#6A5AE010', marginTop: 5 }}>
            <View style={{ height: 8, borderRadius: 8, backgroundColor: Colors.primary, width: '100%' }}></View>
          </View>

          <TouchableOpacity
            onPress={registerUser}
            style={[style.btn, { marginTop: 30, marginBottom: 20 }]}>
            <Text style={[style.btntxt, {}]}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default User;
