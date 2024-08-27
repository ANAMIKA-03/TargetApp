/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import { FacebookSdk } from 'react-native-fbsdk-next';

// FacebookSdk.initialize(); // Ensure SDK initialization
AppRegistry.registerComponent(appName, () => App);
