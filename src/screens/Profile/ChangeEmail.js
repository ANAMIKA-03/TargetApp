import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView,
    TouchableOpacity, TextInput, Modal, StyleSheet, Platform, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import { AppBar } from '@react-native-material/core';

export default function ChangeEmail() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(true); 
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessCancel = () => {
        setModalVisible(false);
        navigation.goBack();
    };

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            setCurrentEmail(user.email);
        }
    }, []);

    // const reauthenticate = async (password) => {
    //     const user = auth().currentUser;
    //     const credential = auth.EmailAuthProvider.credential(user.email, password);

    //     try {
    //         await user.reauthenticateWithCredential(credential);
    //         console.log('Reauthentication successful');
    //         return true;
    //     } catch (error) {
    //         console.error('Reauthentication failed:', error);
    //         if (error.code === 'auth/wrong-password') {
    //             setErrorMessage('Incorrect password. Please try again.');
    //         } else {
    //             setErrorMessage('Failed to reauthenticate. Please try again.');
    //         }
    //         return false;
    //     }
    // };
    const handleChangeEmail = async () => {
        setErrorMessage('');
    
        if (!currentEmail || !newEmail || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
    
        const user = auth().currentUser;
    
        if (!user) {
            setErrorMessage('No user is currently signed in.');
            return;
        }
    
        try {
            const reauthenticated = await reauthenticate(password);
            if (!reauthenticated) {
                console.log('Reauthentication failed, cannot proceed to update email.');
                return;
            }
    
            // Create a new user with the new email and the same password
            const newUser = await auth().createUserWithEmailAndPassword(newEmail, password);
            console.log('New user created:', newUser);
    
            // Send a verification email to the new email address
            await newUser.user.sendEmailVerification();
            console.log('Verification email sent to the new email address.');
    
            // Update the email in Firestore for the old user document
            const userDoc = await firestore()
                .collection('registerUser')
                .where('email', '==', currentEmail)
                .limit(1)
                .get();
    
            if (!userDoc.empty) {
                const docId = userDoc.docs[0].id;
                await firestore()
                    .collection('registerUser')
                    .doc(docId)
                    .update({ email: newEmail });
                console.log('Email updated in Firestore');
            } else {
                console.error('No document found with the current email.');
            }
    
            // Notify the user about the change and request email verification
            Alert.alert(
                'Email Updated',
                'Your email has been updated. Please verify your new email address before proceeding.',
                [{
                    text: 'OK',
                    onPress: () => {
                        setModalVisible(false);
                        navigation.goBack(); // Navigate back
                    }
                }]
            );
    
            // Update state to reflect the change
            setCurrentEmail(newEmail);
            setModalVisible(false);
            setErrorMessage('');
            setNewEmail('');
            setPassword('');
    
        } catch (error) {
            console.error('Error submitting email change request:', error);
    
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setErrorMessage('The new email is already in use by another account.');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('The new email address is not valid.');
                    break;
                case 'auth/requires-recent-login':
                    setErrorMessage('Please reauthenticate and try again.');
                    break;
                case 'auth/network-request-failed':
                    setErrorMessage('Network error. Please check your connection and try again.');
                    break;
                default:
                    setErrorMessage('Failed to submit email change request. Please try again.');
            }
        }
    };
    
    const reauthenticate = async (password) => {
        const user = auth().currentUser;
        const credential = auth.EmailAuthProvider.credential(user.email, password);
        try {
            await user.reauthenticateWithCredential(credential);
            return true;
        } catch (error) {
            console.error('Reauthentication failed:', error);
            setErrorMessage('Reauthentication failed. Please try again.');
            return false;
        }
    };
    

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.primary, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title='Change Email'
                        titleStyle={[style.apptitle, { color: Colors.secondary, marginLeft: 25 }]}
                        centerTitle={true}
                        style={{ backgroundColor: 'transparent' }}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.goBack()} >
                            <Icon name='arrow-back' size={24} color={Colors.secondary} />
                        </TouchableOpacity>}
                    />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <Text style={[style.m16, { color: Colors.txt, marginBottom: 20 }]}>Change Email</Text>

                                {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}

                                <TextInput
                                    placeholder="Current Email"
                                    placeholderTextColor={Colors.disable}
                                    value={currentEmail}
                                    editable={false}
                                    style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                                />
                                <TextInput
                                    placeholder="New Email"
                                    placeholderTextColor={Colors.disable}
                                    value={newEmail}
                                    onChangeText={setNewEmail}
                                    style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                                />
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor={Colors.disable}
                                    secureTextEntry={true}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                                />
                                <TouchableOpacity
                                    onPress={handleChangeEmail}
                                    style={[styles.btn, { backgroundColor: Colors.primary, marginTop: 10 }]}
                                >
                                    <Text style={[style.btntxt, { color: Colors.secondary }]}>Change Email</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSuccessCancel}
                                    style={[styles.btn, { backgroundColor: Colors.bg, marginTop: 10 }]}
                                >
                                    <Text style={[style.btntxt, { color: Colors.txt }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: Colors.txt,
        fontSize: 14,
        marginBottom: 10,
    },
    btn: {
        width: '100%',
        padding: 14,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btntxt: {
        fontSize: 16,
        fontWeight: '600',
    },
});
