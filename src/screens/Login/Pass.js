// screens/Pass.js
import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar } from '@react-native-material/core';
import style from '../../theme/style'; 
import { Colors } from '../../theme/color'; 
import { Dimensions } from 'react-native';

const Pass = () => {
  const navigation = useNavigation();
  const { formData, setFormData } = useContext(AuthContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { width } = Dimensions.get('screen'); 

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
          <AppBar
            title='What’s your password?'
            titleStyle={[style.apptitle, { color: Colors.txt, marginLeft: 25 }]}
            centerTitle={true}
            style={{ backgroundColor: 'transparent' }}
            elevation={0}
            leading={<TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back' size={24} color={Colors.active} />
            </TouchableOpacity>}
          />

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
            <Text style={[style.r14, { color: Colors.txt, marginTop: 20 }]}>Password</Text>
            <View style={[style.inputcontainer, { marginTop: 8, backgroundColor: Colors.bg }]}>
              <Icons name='lock-outline' size={24} color={Colors.primary}></Icons>
              <TextInput
                placeholder='Your password'
                placeholderTextColor={Colors.disable}
                selectionColor={Colors.primary}
                secureTextEntry={!isPasswordVisible}
                value={formData.password}
                onChangeText={(value) => setFormData({ ...formData, password: value })}
                style={[style.r14, { color: Colors.active, flex: 1, marginBottom: -4, marginLeft: 10 }]}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon name={!isPasswordVisible ? 'eye-off' : 'eye'} color={'#CCCCCC'} size={20} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={[style.r14, { color: Colors.disable }]}>Must be at least 8 characters.</Text>
              <Icon name='checkmark-sharp' size={20} color={Colors.primary}></Icon>
            </View>
          </ScrollView>

          <Text style={[style.m16, { color: Colors.primary, textAlign: 'right' }]}>2 of 3</Text>

          <View style={{ height: 8, borderRadius: 8, backgroundColor: '#6A5AE010', marginTop: 5 }}>
            <View style={{ height: 8, borderRadius: 8, backgroundColor: Colors.primary, width: width / 1.7 }}></View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('User')}
            style={[style.btn, { marginTop: 30, marginBottom: 20 }]}>
            <Text style={[style.btntxt, {}]}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Pass;
