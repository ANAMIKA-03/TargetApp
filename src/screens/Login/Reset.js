import { View, Text, SafeAreaView, Dimensions, StatusBar, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppBar } from '@react-native-material/core';
import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function Reset() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert(
                    "Reset Password",
                    "A password reset link has been sent to your email address.",
                    [{ text: "OK", onPress: () => navigation.navigate('Login') }]
                );
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title='Reset Password'
                        titleStyle={[style.apptitle, { color: Colors.txt }]}
                        centerTitle={true}
                        style={{ backgroundColor: 'transparent' }}
                        elevation={0}
                        leading={
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Icon name='arrow-back' size={24} color={Colors.active} />
                            </TouchableOpacity>
                        }
                    />

                    <Text style={[style.r16, { color: Colors.disable, marginTop: 5 }]}>
                        Enter your email and we will send you a link to reset your password.
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                        <Text style={[style.r14, { color: Colors.txt, marginTop: 15 }]}>Email Address</Text>
                        <View style={[style.inputcontainer, { marginTop: 8, backgroundColor: Colors.bg }]}>
                            <Icon name='mail-outline' size={24} color={Colors.primary} />
                            <TextInput
                                placeholder='Your email address'
                                placeholderTextColor={Colors.disable}
                                selectionColor={Colors.primary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={[style.r14, { color: Colors.active, flex: 1, marginBottom: -4, marginLeft: 10 }]}
                            />
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleResetPassword}
                        style={[style.btn, { marginTop: 30, marginBottom: 20 }]}>
                        <Text style={[style.btntxt, {}]}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

