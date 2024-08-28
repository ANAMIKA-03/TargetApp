import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView,
    TouchableOpacity, TextInput, Modal, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { AppBar } from '@react-native-material/core';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ChangeProfile() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'United States', value: 'US' },
        { label: 'India', value: 'IN' },
        { label: 'Canada', value: 'CA' },
        { label: 'Australia', value: 'AU' },
        // Add more countries as needed
    ]);

    useEffect(() => {
        const user = auth().currentUser;
        if (user && user.displayName) {
            setCurrentUsername(user.displayName);
        }
    }, []);

    const handleChangeProfile = async () => {
        const user = auth().currentUser;

        try {
            // Update the display name (username)
            await user.updateProfile({
                displayName: newUsername || currentUsername,
            });

            // Here you would also save the selected country, potentially to your backend
            console.log(`Country selected: ${selectedCountry}`);

            console.log('Profile updated successfully');
            setModalVisible(false);
            setErrorMessage('');
            setNewUsername('');
            alert('Profile updated successfully.');

        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.primary, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title='Change Profile'
                        titleStyle={[style.apptitle, { color: Colors.secondary, marginLeft: 25 }]}
                        centerTitle={true}
                        style={{ backgroundColor: 'transparent' }}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.goBack()} >
                            <Icon name='arrow-back' size={24} color={Colors.secondary} />
                        </TouchableOpacity>}
                    />
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: hp('50%')  }}>
                            <Text style={[style.m18, { color: Colors.txt, textAlign: 'center' }]}>Change your Profile below:</Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={[style.btn, { marginTop: 20, backgroundColor: Colors.primary, marginHorizontal: 20, paddingVertical: 15 }]}
                            >
                                <Text style={[style.m16, { color: Colors.secondary, textAlign: 'center' }]}>Change Profile</Text>
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
                            <Text style={[style.m16, { color: Colors.txt, marginBottom: 20 }]}>Change Profile</Text>

                            {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}

                            <TextInput
                                placeholder="Current Username"
                                placeholderTextColor={Colors.disable}
                                value={currentUsername}
                                editable={false}
                                style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                            />
                            <TextInput
                                placeholder="New Username"
                                placeholderTextColor={Colors.disable}
                                value={newUsername}
                                onChangeText={setNewUsername}
                                style={[styles.input, { backgroundColor: Colors.bg, marginBottom: 15 }]}
                            />

                            <DropDownPicker
                                open={open}
                                value={selectedCountry}
                                items={items}
                                setOpen={setOpen}
                                setValue={setSelectedCountry}
                                setItems={setItems}
                                placeholder="Select Country"
                                containerStyle={{ width: '100%', marginBottom: 15 }}
                                style={{ backgroundColor: Colors.bg }}
                                dropDownStyle={{ backgroundColor: Colors.bg }}
                                labelStyle={{ color: Colors.txt }}
                            />

                            <TouchableOpacity
                                onPress={handleChangeProfile}
                                style={[styles.btn, { backgroundColor: Colors.primary, marginTop: 10 }]}
                            >
                                <Text style={[style.btntxt, { color: Colors.secondary }]}>Save Changes</Text>
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
