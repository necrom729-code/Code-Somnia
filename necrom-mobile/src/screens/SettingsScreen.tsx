import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useI18n } from '../lib/i18n';
import { useAuth } from '../lib/auth';

export default function SettingsScreen() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>
      
      <View style={styles.settingsList}>
        {/* Appearance */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t('settings.theme')}</Text>
            <View style={styles.themeSelector}>
              <TouchableOpacity style={[styles.themeOption, styles.selectedTheme]}>
                <Text style={styles.themeText}>DEFAULT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.themeOption}>
                <Text style={styles.themeText}>DARK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.themeOption}>
                <Text style={styles.themeText}>AMOLED</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Language */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t('settings.currentLanguage')}</Text>
            <Text style={styles.languageValue}>English 🇺🇸</Text>
          </View>
        </View>
        
        {/* Account */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t('settings.signedInAs')}</Text>
            <Text style={styles.accountValue}>{user?.email || 'Not signed in'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={signOut}
          >
            <Text style={styles.signOutText}>{t('settings.signOut')}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Notifications */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t('settings.notificationsEnabled')}</Text>
            <Switch 
              value={true} 
              onValueChange={() => {}}
              thumbColor={isIOS ? '#f5dd4b' : '#f2f2f2'}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>
        </View>
        
        {/* Privacy */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings.privacy')}</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t('settings.analytics')}</Text>
            <Switch 
              value={false} 
              onValueChange={() => {}}
              thumbColor={isIOS ? '#f5dd4b' : '#f2f2f2'}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  settingsList: {
    padding: 20,
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a0c8e0',
    marginBottom: 15,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  settingsLabel: {
    fontSize: 16,
    color: '#a0c8e0',
  },
  languageValue: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '500',
  },
  themeSelector: {
    flexDirection: 'row',
  },
  themeOption: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
  selectedTheme: {
    backgroundColor: 'rgba(0,212,255,0.2)',
  },
  themeText: {
    color: '#a0c8e0',
    fontSize: 14,
  },
  signOutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255,58,58,0.2)',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ff3a3a',
    fontWeight: '600',
  },
});

// Helper to detect iOS
const isIOS = Platform.OS === 'ios';
