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
import { AppBar } from '@react-native-material/core';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';

export default function ChangeEmail() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            setCurrentEmail(user.email);
        }
    }, []);

    const reauthenticate = async (password) => {
        const user = auth().currentUser;
        const credential = auth.EmailAuthProvider.credential(user.email, password);

        try {
            await user.reauthenticateWithCredential(credential);
            console.log('Reauthentication successful');
            return true;
        } catch (error) {
            console.error('Reauthentication failed:', error);
            if (error.code === 'auth/wrong-password') {
                setErrorMessage('Incorrect password. Please try again.');
            } else {
                setErrorMessage('Failed to reauthenticate. Please try again.');
            }
            return false;
        }
    };


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

            await firestore().collection('emailChanges').add({
                userId: user.uid,
                currentEmail: currentEmail,
                newEmail: newEmail,
                timestamp: firestore.FieldValue.serverTimestamp(),
            });

            Alert.alert(
                'Request Submitted',
                'Your email change request has been submitted. Please verify the new email before proceeding with the change.',
                [{ text: 'OK', onPress: () => setModalVisible(false) }]
            );

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
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: hp('50%') }}>
                            <Text style={[style.m18, { color: Colors.txt, textAlign: 'center' }]}>Change your Email below:</Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={[style.btn, { marginTop: 20, backgroundColor: Colors.primary, marginHorizontal: 20, paddingVertical: 15 }]}
                            >
                                <Text style={[style.m16, { color: Colors.secondary, textAlign: 'center' }]}>Change Email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

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
                                onPress={() => setModalVisible(false)}
                                style={[styles.btn, { backgroundColor: Colors.bg, marginTop: 10 }]}
                            >
                                <Text style={[style.btntxt, { color: Colors.txt }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
