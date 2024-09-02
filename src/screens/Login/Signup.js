import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, Dimensions, StatusBar, KeyboardAvoidingView,
    TouchableOpacity, Image, ScrollView, TextInput, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar } from '@react-native-material/core';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const width = Dimensions.get('screen').width;

export default function Signup() {
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
    const signUpWithEmailPassword = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async userCredential => {
                console.log('User account created & signed in!');
                const { user } = userCredential;

                firestore()
                    .collection('registerUser').
                 add({
                        password: password,
                        email: user.email,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                        
                        navigation.navigate('MyTabs');
                    })

                    
                    .catch(firestoreError => {
                        console.error('Error writing document: ', firestoreError);
                        setError('Error storing user data');
                    });
                await user.sendEmailVerification();

            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setError('That email address is already in use!');
                } else if (error.code === 'auth/invalid-email') {
                    setError('That email address is invalid!');
                } else {
                    setError(error.message);
                }
            });
    };
    

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);
            console.log('Google Sign-In successful');
            navigation.navigate('MyTabs');
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setError('User cancelled the login process');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setError('Sign in is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setError('Google Play Services is not available');
            } else {
                setError('Some other error: ' + error.message);
            }
        }
    };

    async function onFacebookButtonPress() {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            console.log('data=>', data);
            throw 'Something went wrong obtaining access token';
        }

        const facebookCredential = auth.FacebookAuthProvider.credential(
            data.accessToken,
        );

        return auth().signInWithCredential(facebookCredential);
    }

    async function _signInWithFaceBook() {
        let cred = await onFacebookButtonPress();
        console.log('cred=>', cred);
    }

    return (
        <SafeAreaView style={styles.area}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={styles.main}>
                    <AppBar
                        title='Sign Up'
                        titleStyle={styles.apptitle}
                        centerTitle={true}
                        style={styles.appBar}
                        elevation={0}
                        leading={
                        <TouchableOpacity onPress={() => navigation.navigate('Option')} style={{paddingLeft:15}}>
                            <Icon name='arrow-back' size={24} color={Colors.active} />
                        </TouchableOpacity>}
                    />

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Icon name='mail-outline' size={24} color={Colors.primary} />
                            <TextInput
                                placeholder='Your email address'
                                placeholderTextColor={Colors.disable}
                                value={email}
                                onChangeText={handleEmailChange}
                                selectionColor={Colors.primary}
                                style={styles.input}
                            />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Icons name='lock-outline' size={24} color={Colors.primary} />
                            <TextInput
                                placeholder='Your password'
                                placeholderTextColor={Colors.disable}
                                selectionColor={Colors.primary}
                                secureTextEntry={!isPasswordVisible}
                                value={password}
                                onChangeText={handlePasswordChange}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} >
                                <Icon name={!isPasswordVisible ? 'eye-off' : 'eye'} color={'#CCCCCC'} size={20} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={signUpWithEmailPassword}
                            style={styles.btn}>
                            <Text style={styles.btnText}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider}></View>
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.divider}></View>
                        </View>

                        <TouchableOpacity
                            onPress={signInWithGoogle}
                            style={[styles.btn, styles.googleBtn]}>
                            <Image source={require('../../../assets/image/a2.png')} resizeMode='stretch' style={styles.socialIcon} />
                            <Text style={styles.socialText}>Sign Up with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={_signInWithFaceBook}
                            style={[styles.btn, styles.facebookBtn]}>
                            <Image source={require('../../../assets/image/a3.png')} resizeMode='stretch' style={styles.socialIcon} />
                            <Text style={styles.socialText}>Sign Up with Facebook</Text>
                        </TouchableOpacity>

                        <View style={styles.accountContainer}>
                            <Text style={styles.accountText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.termsText}>By continuing, you agree to the <Text style={styles.termsLink}>Terms of Services</Text> & <Text style={styles.termsLink}>Privacy Policy.</Text></Text>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: Colors.bord,
    },
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
        backgroundColor: Colors.bord,
        marginTop: Platform.OS === 'ios' ? 10 : 30,
    },
    appBar: {
        backgroundColor: 'transparent',
    },
    apptitle: {
        color: Colors.txt,
    },
    scrollView: {
        marginTop: 10,

    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    label: {
        color: Colors.txt,
        marginTop: 10,
        textAlign: 'left', // Center labels
        marginLeft:20
    },
    inputContainer: {
        marginTop: 8,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginHorizontal: 20,
    },
    input: {
        color: Colors.active,
        flex: 1,
        marginBottom: -4,
        marginLeft: 10,
    },
    btn: {
        backgroundColor: Colors.primary,
        marginTop: 30,
        marginHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        paddingVertical: 15,
    },
    btnText: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: Colors.primary,
        textAlign: 'center',
        marginTop: 30,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginHorizontal: 20,
    },
    divider: {
        backgroundColor: Colors.btn,
        flex: 1,
        height: 1,
    },
    dividerText: {
        color: Colors.disable,
        marginHorizontal: 20,
    },
    googleBtn: {
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    facebookBtn: {
        backgroundColor: '#0056B2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        height: 22,
        width: 22,
    },
    socialText: {
        color: Colors.txt,
        marginLeft: 20,
    },
    accountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        justifyContent: 'center',
        marginTop: 30,
    },
    accountText: {
        color: Colors.disable,
        textAlign: 'center',
    },
    loginLink: {
        color: Colors.primary,
        textAlign: 'center',
    },
    termsText: {
        color: Colors.disable,
        textAlign: 'center',
        lineHeight: 24,
    },
    termsLink: {
        color: Colors.txt1,
    },
});
