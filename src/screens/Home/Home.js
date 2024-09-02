import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { Colors } from '../../theme/color';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function Home() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    const user = auth().currentUser;
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, []);

  const greeting = useMemo(() => {
    return `GOOD MORNING, ${displayName.toUpperCase()}`;
  }, [displayName]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <View style={styles.greetingRow}>
            <Icon name="sunny-outline" size={20} color={Colors.lpink} />
            <Text style={styles.greetingText}>{greeting}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={require('../../../assets/image/s1.png')} resizeMode="stretch" style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Image source={require('../../../assets/image/s2.png')} resizeMode="stretch" style={styles.bannerImage} />

        <ImageBackground source={require('../../../assets/image/s3.png')} resizeMode="stretch" style={styles.featuredBackground}>
          <View style={styles.featuredContainer}>
            <View style={styles.featuredHeader}>
              <Image source={require('../../../assets/image/s4.png')} resizeMode="stretch" style={styles.featuredIcon} />
              <Text style={styles.featuredText}>FEATURED</Text>
              <View style={styles.featuredSpacer}></View>
            </View>
            <Text style={styles.featuredDescription}>Take part in challenges with friends or other players</Text>
            <TouchableOpacity style={styles.findFriendsButton}>
              <Image source={require('../../../assets/image/s6.png')} resizeMode="stretch" style={styles.findFriendsIcon} />
              <Text style={styles.findFriendsText}>Find Friends</Text>
            </TouchableOpacity>
            <View style={styles.featuredImageContainer}>
              <Image source={require('../../../assets/image/s5.png')} resizeMode="stretch" style={styles.featuredImage} />
            </View>
          </View>
        </ImageBackground>

        <View style={styles.quizContainer}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizTitle}>Live Quizzes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('QDetail')} style={styles.quizItem}>
            <Image source={require('../../../assets/image/s7.png')} resizeMode="stretch" style={styles.quizIcon} />
            <View style={styles.quizContent}>
              <Text style={styles.quizName}>Statistics Math Quiz</Text>
              <Text style={styles.quizDetails}>Math • 12 Quizzes</Text>
            </View>
            <Icon name="chevron-forward" size={24} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('QDetail')} style={styles.quizItem}>
            <Image source={require('../../../assets/image/s8.png')} resizeMode="stretch" style={styles.quizIcon} />
            <View style={styles.quizContent}>
              <Text style={styles.quizName}>Integers Quiz</Text>
              <Text style={styles.quizDetails}>Math • 10 Quizzes</Text>
            </View>
            <Icon name="chevron-forward" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 30,
    marginHorizontal: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    color: Colors.lpink,
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  displayName: {
    color: Colors.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    height: 56,
    width: 56,
  },
  scrollView: {
    marginTop: 10,
  },
  bannerImage: {
    height: height / 10,
    width: width * 0.95, 
    marginHorizontal:10, 
    marginVertical: 10,
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuredBackground: {
    height: height / 4.8,
    marginHorizontal: 10,
    marginVertical: 5,
  //   borderRadius:20
  },
  featuredContainer: {
    padding: 15,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredIcon: {
    height: 48,
    width: 48,
  },
  featuredText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuredSpacer: {
    width: 48,
  },
  featuredDescription: {
    color: Colors.secondary,
    textAlign: 'center',
    marginHorizontal: 25,
    fontSize: 18,
    fontWeight: 'bold',
  },
  findFriendsButton: {
    marginRight: 10,
    height: 44,
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  findFriendsIcon: {
    height: 20,
    width: 20,
  },
  findFriendsText: {
    color: Colors.primary,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuredImageContainer: {
    alignItems: 'flex-end',
    marginTop: -70,
  },
  featuredImage: {
    height: 56,
    width: 64,
  },
  quizContainer: {
    padding: 20,
    backgroundColor: Colors.secondary,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 18,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizTitle: {
    color: Colors.txt,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 14,
  },
  quizItem: {
    padding: 12,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  quizIcon: {
    height: 64,
    width: 64,
  },
  quizContent: {
    flex: 1,
    marginLeft: 10,
  },
  quizName: {
    color: Colors.txt,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizDetails: {
    color: Colors.disable,
    marginTop: 7,
    fontSize: 12,
  },
});
