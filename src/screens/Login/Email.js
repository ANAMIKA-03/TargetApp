import React, { useContext } from 'react';
import { View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppBar } from '@react-native-material/core';
import style from '../../theme/style'; 
import { Colors } from '../../theme/color'; 
const Email = () => {
  const navigation = useNavigation();
  const { formData, setFormData } = useContext(AuthContext);
  const { width } = Dimensions.get('screen'); 

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
          <AppBar
            title='What’s your email?'
            titleStyle={[style.apptitle, { color: Colors.txt }]}
            centerTitle={true}
            style={{ backgroundColor: 'transparent' }}
            elevation={0}
            leading={<TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back' size={24} color={Colors.active} />
            </TouchableOpacity>}
          />

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
            <Text style={[style.r14, { color: Colors.txt, marginTop: 15 }]}>Email Address</Text>
            <View style={[style.inputcontainer, { marginTop: 8, backgroundColor: Colors.bg }]}>
              <Icon name='mail-outline' size={24} color={Colors.primary}></Icon>
              <TextInput
                placeholder='Your email address'
                placeholderTextColor={Colors.disable}
                selectionColor={Colors.primary}
                value={formData.email}
                onChangeText={(value) => setFormData({ ...formData, email: value })}
                style={[style.r14, { color: Colors.active, flex: 1, marginBottom: -4, marginLeft: 10 }]}
              />
            </View>
          </ScrollView>

          <Text style={[style.m16, { color: Colors.primary, textAlign: 'right' }]}>1 of 3</Text>

          <View style={{ height: 8, borderRadius: 8, backgroundColor: '#6A5AE010', marginTop: 5 }}>
            <View style={{ height: 8, borderRadius: 8, backgroundColor: Colors.primary, width: width / 3.5 }}></View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Pass')}
            style={[style.btn, { marginTop: 30, marginBottom: 20 }]}>
            <Text style={[style.btntxt, {}]}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Email;

