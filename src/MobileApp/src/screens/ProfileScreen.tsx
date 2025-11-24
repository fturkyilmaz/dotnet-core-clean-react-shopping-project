import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('profile.title')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingLabelContainer}>
                        <Ionicons name="language-outline" size={24} color="#333" />
                        <Text style={styles.settingLabel}>{t('profile.language')}</Text>
                    </View>

                    <View style={styles.languageButtons}>
                        <TouchableOpacity
                            style={[
                                styles.langButton,
                                i18n.language === 'en' && styles.activeLangButton
                            ]}
                            onPress={() => changeLanguage('en')}
                        >
                            <Text style={[
                                styles.langButtonText,
                                i18n.language === 'en' && styles.activeLangButtonText
                            ]}>EN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.langButton,
                                i18n.language === 'tr' && styles.activeLangButton
                            ]}
                            onPress={() => changeLanguage('tr')}
                        >
                            <Text style={[
                                styles.langButtonText,
                                i18n.language === 'tr' && styles.activeLangButtonText
                            ]}>TR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    langButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeLangButton: {
        backgroundColor: '#007AFF',
    },
    langButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeLangButtonText: {
        color: '#fff',
    },
});

export default ProfileScreen;
