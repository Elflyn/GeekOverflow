import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import LoginPage from './src/views/LoginPage';

const App = () => {
  return (
    <View>
      <LoginPage />
    </View>
  );
};

export default App;
