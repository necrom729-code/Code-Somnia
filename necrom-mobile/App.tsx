import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import FileManagerScreen from './screens/FileManagerScreen';
import BackupManagerScreen from './screens/BackupManagerScreen';
import VPNPanelScreen from './screens/VPNPanelScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

// Import providers
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './lib/auth';
import { NotificationsProvider } from './lib/notifications';
import { SecurityProvider } from './lib/security';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <NotificationsProvider>
          <SecurityProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  {/* Auth Stack */}
                  <Stack.Screen name="SignIn" component={SignInScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                  
                  {/* Main App */}
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                  <Stack.Screen name="FileManager" component={FileManagerScreen} />
                  <Stack.Screen name="BackupManager" component={BackupManagerScreen} />
                  <Stack.Screen name="VPNPanel" component={VPNPanelScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaProvider>
          </SecurityProvider>
        </NotificationsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
