import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableOpacity,
    ScrollView, TextInput, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar } from '@react-native-material/core';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Login() {
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '222650696835-ddkvj3gnomduhjhkg399kealp4j1on8v.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
    }, []);

    const handleEmailChange = (text) => setEmail(text);
    const handlePasswordChange = (text) => setPassword(text);
    const signInWithEmailPassword = async () => {
        try {
            if (!email || !password) {
                setError('Please enter both email and password.');
                return;
            }
    
            const res = await auth().signInWithEmailAndPassword(email, password);
            const user = res.user;
    
            if (user.emailVerified) {
                console.log("Email Sign-In successful");
                navigation.navigate('MyTabs');
            } else {
                await user.sendEmailVerification();
                setError("Email not verified. A verification email has been sent to your inbox. Please verify your email before signing in.");
            }
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('No user found with this email. Please sign up first.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format. Please check and try again.');
                    break;
                default:
                    setError('Failed to sign in. Please check your credentials and try again.');
                    break;
            }
            console.error('Error:', error);
        }
    };
    

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const res = await auth().signInWithCredential(googleCredential);
            console.log("Google Sign-In successful:", res);
            navigation.navigate('MyTabs');
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the login process');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign in is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Google Play Services is not available');
            } else {
                console.log('Some other error: ', error.message);
            }
        }
    };

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title='Login'
                        titleStyle={[style.apptitle, { color: Colors.txt }]}
                        centerTitle={true}
                        style={{ backgroundColor: 'transparent' }}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Option')} >
                            <Icon name='arrow-back' size={24} color={Colors.active} />
                        </TouchableOpacity>}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                        {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text> : null}
                        <Text style={[style.r14, { color: Colors.txt, marginTop: 10 }]}>Email Address</Text>
                        <View style={[style.inputcontainer, { marginTop: 8, backgroundColor: Colors.bg }]}>
                            <Icon name='mail-outline' size={24} color={Colors.primary}></Icon>
                            <TextInput
                                placeholder='Your email address'
                                placeholderTextColor={Colors.disable}
                                value={email}
                                onChangeText={handleEmailChange}
                                selectionColor={Colors.primary}
                                style={[style.r14, { color: Colors.active, flex: 1, marginBottom: -4, marginLeft: 10 }]}
                            />
                        </View>

                        <Text style={[style.r14, { color: Colors.txt, marginTop: 20 }]}>Password</Text>
                        <View style={[style.inputcontainer, { marginTop: 8, backgroundColor: Colors.bg }]}>
                            <Icons name='lock-outline' size={24} color={Colors.primary}></Icons>
                            <TextInput
                                placeholder='Your password'
                                placeholderTextColor={Colors.disable}
                                selectionColor={Colors.primary}
                                secureTextEntry={!isPasswordVisible}
                                value={password}
                                onChangeText={handlePasswordChange}
                                style={[style.r14, { color: Colors.active, flex: 1, marginBottom: -4, marginLeft: 10 }]}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} >
                                <Icon name={!isPasswordVisible ? 'eye-off' : 'eye'} color={'#CCCCCC'} size={20} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={signInWithEmailPassword}
                            style={[style.btn, { marginTop: 30 }]}>
                            <Text style={[style.btntxt, {}]}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                            <Text style={[style.m16, { color: Colors.primary, textAlign: 'center', marginTop: 30 }]}>Forgot password?</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25 }}>
                            <View style={[style.divider, { backgroundColor: Colors.btn, flex: 1 }]}></View>
                            <Text style={[style.r16, { color: Colors.disable, marginHorizontal: 20 }]}>OR</Text>
                            <View style={[style.divider, { backgroundColor: Colors.btn, flex: 1 }]}></View>
                        </View>

                        <TouchableOpacity
                            onPress={signInWithGoogle}
                            style={[style.btn, { marginTop: 15, backgroundColor: Colors.bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            <Image source={require('../../../assets/image/a2.png')} resizeMode='stretch' style={{ height: 22, width: 22 }}></Image>
                            <Text style={[style.m16, { color: Colors.txt, marginLeft: 20 }]}>Login with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[style.btn, { marginTop: 15, backgroundColor: '#0056B2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            <Image source={require('../../../assets/image/a3.png')} resizeMode='stretch' style={{ height: 22, width: 22 }}></Image>
                            <Text style={[style.m16, { color: Colors.secondary, marginLeft: 20 }]}>Login with Facebook</Text>
                        </TouchableOpacity>

                        <Text style={[style.r14, { color: Colors.disable, textAlign: 'center', lineHeight: 24, marginTop: 20 }]}>By continuing, you agree to the <Text style={[style.m14, { color: Colors.txt1 }]}>Terms of Services</Text> &<Text style={[style.m14, { color: Colors.txt1 }]}> Privacy Policy.</Text></Text>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
