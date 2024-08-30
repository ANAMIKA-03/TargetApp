import { View, Text, FlatList, SafeAreaView, Dimensions, StatusBar, KeyboardAvoidingView, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../../theme/style'
import { Colors } from '../../theme/color'
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper'
import { AppBar } from '@react-native-material/core';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import firebase from '@react-native-firebase/app';

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Login() {
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '222650696835-ddkvj3gnomduhjhkg399kealp4j1on8v.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
    }, [])


    // useEffect(() => {
    //     GoogleSignin.configure({
    //         webClientId: '222650696835-ddkvj3gnomduhjhkg399kealp4j1on8v.apps.googleusercontent.com',
    //         offlineAccess: true,
    //         forceCodeForRefreshToken: true,
    //     });

    //     if (!firebase.apps.length) {
    //         const firebaseConfig = {
    //             apiKey: "AIzaSyCdn7nPeShsEkCvyeoCs85RPU9Ildlvh2Q",
    //             authDomain: "queezy-792ff.firebaseapp.com",
    //             projectId: "queezy-792ff",
    //             storageBucket: "queezy-792ff.appspot.com",
    //             messagingSenderId: "222650696835",
    //             appId: "1:222650696835:web:485fbe5a616fc4f61547b6",
    //             measurementId: "G-E74NB13RXH"
    //         };

    //         firebase.initializeApp(firebaseConfig);
    //     } else {
    //         firebase.app();  
    //     }
    // }, []);


    useEffect(() => {


        const app = firebase.app(); // Try to get the default app
        console.log('Firebase is initialized:', app.name); // This will print the app name

    }, [])



    // Usage
    // if (checkFirebaseInitialized()) {
    //     console.log('Firebase is ready to use.');
    // } else {
    //     console.log('Firebase initialization is required.');
    // }

    //   useEffect(() => {
    //     GoogleSignin.configure({
    //         webClientId: '222650696835-ddkvj3gnomduhjhkg399kealp4j1on8v.apps.googleusercontent.com',
    //         offlineAccess: true,
    //       forceCodeForRefreshToken: true,
    //     });

    //     if (!firebase.apps.length) {
    //       const firebaseConfig = {
    //         apiKey: "AIzaSyCdn7nPeShsEkCvyeoCs85RPU9Ildlvh2Q",
    //         authDomain: "queezy-792ff.firebaseapp.com",
    //         projectId: "queezy-792ff",
    //         storageBucket: "queezy-792ff.appspot.com",
    //         messagingSenderId: "222650696835",
    //         appId: "1:222650696835:web:485fbe5a616fc4f61547b6",
    //         measurementId: "G-E74NB13RXH"
    //       };

    //       firebase.initializeApp(firebaseConfig);
    //     } else {
    //       firebase.app(); 
    //     }
    //   }, []);

    const handleEmailChange = (text) => setEmail(text);
    const handlePasswordChange = (text) => setPassword(text);

    const creatpasswordlogin = () => {
        auth()
            .createUserWithEmailAndPassword

            (
                email,
                password,
            )
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const res = await auth().signInWithCredential(googleCredential);
            console.log("resss", res)
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

    async function onFacebookButtonPress() {
        const result = await LoginManager.logInWithPermissions([
            'public_profile',
            'email',
        ]);

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


    // try {
    //     const provider = new FacebookAuthProvider();
    //     const result = await signInWithPopup(auth, provider);
    //     if (result?.user?.accessToken) {
    //       createUserHandler(result?.user?.accessToken, sponsorId, (res) => {
    //         cb();
    //         if (res) {
    //           const obj = {
    //             prices: res?.prices,
    //             wallet: {
    //               address: res?.address,
    //             },
    //             login: true,
    //             userinfo: {
    //               name: res?.name,
    //               email: res?.email,
    //               uid: res?.uid,
    //               photoURL: res?.photoURL,
    //               sign_type: res?.sign_type,
    //             },
    //           };
    //           dispatch(setWalletData(obj));
    //           dispatch(
    //             setShowCustomToast({
    //               message: "Signed In!",
    //               type: "success",
    //               visible: true,
    //             })
    //           );
    //           dispatch(setIsLogging(false));
    //         }
    //       });
    //     }
    //   } catch (error) {
    //     console.error(error, "error");
    //     dispatch(
    //       setShowCustomToast({
    //         message: "Error Signing In!",
    //         type: "danger",
    //         visible: true,
    //       })
    //     );
    //     dispatch(setIsLogging(false));

    //     if (error.code === "auth/account-exists-with-different-credential") {
    //       alert("You are already signUp with another credential");
    //     } else {
    //       console.error("Error signing in with Facebook:", error);
    //     }
    //   }

    // const signInWithFacebook = async () => {
    //     try {
    //         const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    //         if (result.isCancelled) {
    //             throw 'User cancelled the login process';
    //         }

    //         const data = await AccessToken.getCurrentAccessToken();
    //         if (!data) {
    //             throw 'Something went wrong obtaining the access token';
    //         }

    //         const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    //         const res = await auth().signInWithCredential(facebookCredential);
    //         console.log("Facebook Sign-In successful:", res);
    //         navigation.navigate('MyTabs');
    //     } catch (error) {
    //         console.error('Facebook Sign-In Error:', error);
    //     }
    // };


    async function onFacebookButtonPress() {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccessToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(facebookCredential);
    }


    const signInWithEmailPassword = async () => {
        try {
            if (!email || !password) {
                setError('Email and password are required.');
                return;
            }

            const res = await auth().signInWithEmailAndPassword(email, password);
            console.log("Email Sign-In successful:", res);
            navigation.navigate('MyTabs');
        } catch (error) {
            setError(error.message);
            console.error('Email Sign-In Error:', error);
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
                            // onPress={() => navigation.navigate('MyTabs')}
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
                            // onPress={_signInWithFaceBook}
                            style={[style.btn, { marginTop: 15, backgroundColor: '#0056B2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            <Image source={require('../../../assets/image/a3.png')} resizeMode='stretch' style={{ height: 22, width: 22 }}></Image>
                            <Text style={[style.m16, { color: Colors.secondary, marginLeft: 20 }]}>Login with Facebook</Text>
                        </TouchableOpacity>

                        <Text style={[style.r14, { color: Colors.disable, textAlign: 'center', lineHeight: 24, marginTop: 20 }]}>By continuing, you agree to the <Text style={[style.m14, { color: Colors.txt1 }]}>Terms of Services</Text> &<Text style={[style.m14, { color: Colors.txt1 }]}> Privacy Policy.</Text></Text>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}




