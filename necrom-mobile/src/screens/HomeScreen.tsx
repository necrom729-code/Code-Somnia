import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useI18n } from '../lib/i18n';
import { useAuth } from '../lib/auth';
import { useSecurity } from '../lib/security';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const { protections, isProtected } = useSecurity();

  if (!isAuthenticated) {
    // Redirect to sign-in (navigation would be handled by auth provider in real app)
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>{t('app.welcome')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => { /* navigate to sign-in */ }}>
          <Text style={styles.buttonText}>{t('nav.signIn')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
        />
        <Text style={styles.appName}>NECROM</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('home.storage')}</Text>
          <Text style={styles.statValue}>12.4 GB / 50 GB</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('home.protection')}</Text>
          <Text style={[styles.statValue, isProtected ? styles.protected : styles.vulnerable]}>
            {isProtected ? t('security.allEnabled') : t('security.someEnabled')}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionBox} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>📁</Text>
          <Text style={styles.actionText}>{t('files.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBox} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>☁️</Text>
          <Text style={styles.actionText}>{t('storage.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBox} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>{t('security.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBox} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionText}>{t('vpn.title')}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('footer.tagline')}</Text>
        <Text style={styles.footerText}>{t('footer.build')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c0392b',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    width: '45%',
  },
  statLabel: {
    fontSize: 14,
    color: '#a0c8e0',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00d4ff',
  },
  protected: {
    color: '#55efc4',
  },
  vulnerable: {
    color: '#ff3a3a',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBox: {
    alignItems: 'center',
    padding: 20,
    margin: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: '45%',
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#a0c8e0',
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  footerText: {
    fontSize: 12,
    color: '#3a6080',
    textAlign: 'center',
    marginVertical: 4,
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#a0c8e0',
  },
  button: {
    backgroundColor: '#00d4ff',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
