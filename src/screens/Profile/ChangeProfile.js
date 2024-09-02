import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView,
    TouchableOpacity, TextInput, Modal, StyleSheet, Image, Platform, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { AppBar } from '@react-native-material/core';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { PermissionsAndroid } from 'react-native';

export default function ChangeProfile() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(true);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('IN'); // Default country set to India
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [genderOpen, setGenderOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ]);
    const [countryItems, setCountryItems] = useState([
        { label: 'United States', value: 'US' },
        { label: 'India', value: 'IN' },  // India added to the list
        { label: 'Canada', value: 'CA' },
        { label: 'Australia', value: 'AU' },
        // Add more countries as needed
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const user = auth().currentUser;
            if (user) {
                setCurrentUsername(user.displayName);
                if (user.photoURL) {
                    setProfilePhoto({ uri: user.photoURL });
                }

                // Query the Firestore collection by the user's email
                const userQuery = await firestore()
                    .collection('registerUser')
                    .where('email', '==', user.email)
                    .limit(1)
                    .get();

                if (!userQuery.empty) {
                    const userDoc = userQuery.docs[0];  // Get the first document returned
                    const userData = userDoc.data();
                    setNewUsername(userData.username || '');
                    setDob(userData.dob || '');
                    setGender(userData.gender || null);
                    setSelectedCountry(userData.country || 'IN');  // Default to India if not found
                    setSelectedState(userData.state || '');
                    setSelectedCity(userData.city || '');
                } else {
                    console.error('User document not found.');
                }
            }
        };

        fetchData();
    }, []);

    // Request Permissions for Android
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);

                const allPermissionsGranted = Object.values(granted).every(
                    (status) => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allPermissionsGranted) {
                    Alert.alert("Permission denied", "You need to grant all permissions to use this feature.");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const validateFields = () => {
        if (!newUsername || !dob || !gender || !selectedCountry || !selectedState || !selectedCity) {
            setErrorMessage('Please fill in all required fields.');
            return false;
        }
        return true;
    };

    const handleChangeProfile = async () => {
        if (!validateFields()) return;
    
        const user = auth().currentUser;
    
        try {
            // Find the document by email (or any other field you choose)
            const userDoc = await firestore()
                .collection('registerUser')
                .where('email', '==', user.email)
                .limit(1)
                .get();
    
            if (!userDoc.empty) {
                const docId = userDoc.docs[0].id;  // Get the document ID
    
                await user.updateProfile({
                    displayName: newUsername || currentUsername,
                    photoURL: profilePhoto ? profilePhoto.uri : user.photoURL,
                });
    
                await firestore().collection('registerUser').doc(docId).set({
                    username: newUsername,
                    profilePhoto: profilePhoto ? profilePhoto.uri : '',
                    dob: dob,
                    gender: gender,
                    country: selectedCountry,
                    state: selectedState,
                    city: selectedCity,
                }, { merge: true });  // Merge: true keeps the existing fields
    
                console.log('Profile updated successfully');
                setErrorMessage('');
                setNewUsername('');
                setSuccessModalVisible(true);  // Show success modal
            } else {
                console.error('No user document found.');
                setErrorMessage('User document not found.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    const handleSuccessModalClose = () => {
        setSuccessModalVisible(false);
        setModalVisible(false);
        navigation.goBack();
    };

    const handleSuccessCancel = () => {
        setModalVisible(false);
        navigation.goBack();
    };

    const handleChoosePhoto = () => {
        requestPermissions().then(() => {
            ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    const source = { uri: response.assets[0].uri };
                    setProfilePhoto(source);
                    setImageLoadError(false); // Reset error flag when new image is chosen
                }
            });
        });
    };

    const handleDateChange = (text) => {
        let cleaned = text.replace(/[^0-9]/g, '');

        if (cleaned.length > 2 && cleaned.length <= 4) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        } else if (cleaned.length > 4) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
        }

        setDob(cleaned);
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

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <Text style={[style.m16, { color: Colors.txt, marginBottom: 20 }]}>Change Profile</Text>

                                <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
                                    {profilePhoto && !imageLoadError ? (
                                        <Image
                                            source={profilePhoto}
                                            style={styles.profilePhoto}
                                            onError={() => setImageLoadError(true)}
                                        />
                                    ) : (
                                        <Icon name="person-circle-outline" size={100} color={Colors.disable} />
                                    )}
                                </TouchableOpacity>

                                {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}

                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        placeholder="New Username"
                                        placeholderTextColor={Colors.disable}
                                        value={newUsername}
                                        onChangeText={setNewUsername}
                                        style={[styles.input, !newUsername && errorMessage ? styles.inputError : null]}
                                    />
                                    {!newUsername && errorMessage ? <Text style={styles.asterisk}>*</Text> : <View style={styles.placeholder} />}
                                </View>

                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        placeholder="Date of Birth (DD/MM/YYYY)"
                                        placeholderTextColor={Colors.disable}
                                        value={dob}
                                        onChangeText={handleDateChange}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        style={[styles.input, !dob && errorMessage ? styles.inputError : null]}
                                    />
                                    {!dob && errorMessage ? <Text style={styles.asterisk}>*</Text> : <View style={styles.placeholder} />}
                                </View>

                                <View style={styles.inputWrapper}>
                                    <View style={{ zIndex: 500, flex: 1 }}>
                                        <DropDownPicker
                                            open={genderOpen}
                                            value={gender}
                                            items={genderItems}
                                            setOpen={setGenderOpen}
                                            setValue={setGender}
                                            setItems={setGenderItems}
                                            placeholder="Select Gender"
                                            containerStyle={{ width: '100%' }}
                                            style={[styles.dropDown, !gender && errorMessage ? styles.inputError : null]}
                                            dropDownStyle={{ backgroundColor: Colors.bg }}
                                            labelStyle={{ color: Colors.txt }}
                                        />
                                    </View>
                                    {!gender && errorMessage ? <Text style={styles.asterisk}>*</Text> : <View style={styles.placeholder} />}
                                </View>

                                <View style={styles.inputWrapper}>
                                    <View style={{ zIndex: 400, flex: 1 }}>
                                        <DropDownPicker
                                            open={countryOpen}
                                            value={selectedCountry}
                                            items={countryItems}
                                            setOpen={setCountryOpen}
                                            setValue={setSelectedCountry}
                                            setItems={setCountryItems}
                                            placeholder="Select Country"
                                            containerStyle={{ width: '100%' }}
                                            style={[styles.dropDown, !selectedCountry && errorMessage ? styles.inputError : null]}
                                            dropDownStyle={{ backgroundColor: Colors.bg }}
                                            labelStyle={{ color: Colors.txt }}
                                        />
                                    </View>
                                    {!selectedCountry && errorMessage ? <Text style={styles.asterisk}>*</Text> : <View style={styles.placeholder} />}
                                </View>

                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        placeholder="State"
                                        placeholderTextColor={Colors.disable}
                                        value={selectedState}
                                        onChangeText={setSelectedState}
                                        style={[styles.input, !selectedState && errorMessage ? styles.inputError : null]}
                                    />
                                    {!selectedState && errorMessage ? <Text style={styles.asterisk}>*</Text> : <View style={styles.placeholder} />}
                                </View>

                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        placeholder="City"
                                        placeholderTextColor={Colors.disable}
                                        value={selectedCity}
                                        onChangeText={setSelectedCity}
                                        style={[styles.input, !selectedCity && errorMessage ? styles.inputError : null]}
                                    />
                                    {!selectedCity && errorMessage ? <Text style={styles.asterisk}>*</Text> : <View style={styles.placeholder} />}
                                </View>

                                <TouchableOpacity
                                    onPress={handleChangeProfile}
                                    style={[styles.btn, { backgroundColor: Colors.primary, marginTop: 10 }]}
                                >
                                    <Text style={[style.btntxt, { color: Colors.secondary }]}>Save Changes</Text>
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

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={successModalVisible}
                        onRequestClose={handleSuccessModalClose}
                    >
                        <View style={styles.successModalBackground}>
                            <View style={styles.successModalContainer}>
                                <Text style={[style.m16, { color: Colors.txt, marginBottom: 20 }]}>Profile Updated Successfully!</Text>
                                <TouchableOpacity onPress={handleSuccessModalClose} style={[styles.btn, { backgroundColor: Colors.primary }]}>
                                    <Text style={[style.btntxt, { color: Colors.secondary }]}>OK</Text>
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
        width: '93%',
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
    },
    successModalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successModalContainer: {
        width: '70%',
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    asterisk: {
        color: 'red',
        marginLeft: 5,
        fontSize: 18,
    },
    placeholder: {
        width: 10, // This width should match the width of the asterisk
    },
    input: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: Colors.txt,
        fontSize: 14,
        backgroundColor: Colors.bg,
        borderColor: Colors.disable,
        borderWidth: 1,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    dropDown: {
        backgroundColor: Colors.bg,
        borderRadius: 10,
        borderColor: Colors.disable,
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
    photoContainer: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: Colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePhoto: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
});
