import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView,
    TouchableOpacity, TextInput, Modal, StyleSheet, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { AppBar } from '@react-native-material/core';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ChangePassword() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle reauthentication
    const reauthenticate = async (currentPassword) => {
        const user = auth().currentUser;
        const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await user.reauthenticateWithCredential(credential);
            console.log('Reauthentication successful');
            return true;
        } catch (error) {
            console.error('Reauthentication failed', error);
            if (error.code === 'auth/wrong-password') {
                setErrorMessage('Current password is incorrect.');
            } else {
                setErrorMessage('Failed to reauthenticate. Please try again.');
            }
            return false;
        }
    };

    // Function to handle password change
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('New password should be at least 6 characters long.');
            return;
        }

        const reauthenticated = await reauthenticate(currentPassword);
        if (reauthenticated) {
            const user = auth().currentUser;
            user.updatePassword(newPassword)
                .then(() => {
                    console.log('Password updated successfully');
                    setModalVisible(false);
                    setErrorMessage('');
                    setCurrentPassword('');
                    setNewPassword('');
                    alert('Password changed successfully');
                })
                .catch(error => {
                    console.error('Error updating password', error);
                    setErrorMessage('Failed to update password. Please try again.');
                });
        }
    };

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.primary, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title='Change Password'
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
                            <Text style={[style.m18, { color: Colors.txt, textAlign: 'center' }]}>Change your password below:</Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={[style.btn, { marginTop: 20, backgroundColor: Colors.primary, marginHorizontal: 20, paddingVertical: 15 }]}
                            >
                                <Text style={[style.m16, { color: Colors.secondary, textAlign: 'center' }]}>Change Password</Text>
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
                            <Text style={[style.m16, { color: Colors.txt, marginBottom: 20 }]}>Change Password</Text>

                            {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}

                            <TextInput
                                placeholder="Current Password"
                                placeholderTextColor={Colors.disable}
                                secureTextEntry={true}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                            />
                            <TextInput
                                placeholder="New Password"
                                placeholderTextColor={Colors.disable}
                                secureTextEntry={true}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                            />
                            <TouchableOpacity
                                onPress={handleChangePassword}
                                style={[styles.btn, { backgroundColor: Colors.primary, marginTop: 10 }]}
                            >
                                <Text style={[style.btntxt, { color: Colors.secondary }]}>Change Password</Text>
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
