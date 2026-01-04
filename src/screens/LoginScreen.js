
import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Text, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

// Stitch Luxury Modern Theme Constants
const COLORS = {
    primary: '#D4AF37', // Welux Gold
    background: '#FAF8F3', // Soft Cream
    textMain: '#333333', // Deep Black Accent
    textGray: '#A0A0A0',
    white: '#FFFFFF',
    inputBorder: '#E0E0E0',
    blob: 'rgba(212, 175, 55, 0.15)', // Gold with low opacity
};

export default function LoginScreen({ navigation }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'master_security_code')
                .single();

            if (error) throw error;
            const storedCode = data?.value?.replace(/['"]+/g, '').trim();

            if (code === storedCode) {
                // Save session for persistence
                await AsyncStorage.setItem('welux_session', 'active');
                navigation.replace('Main');
            } else {
                setError('Access Denied: Invalid Code');
            }
        } catch (err) {
            setError('System Connection Error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
            >
                {/* 1.1 Root View Container Background is set in styles.container */}

                {/* Background Ambience (Optional but keeps the 'Luxury' feel) */}
                <View style={[styles.blob, styles.blobTop]} />
                <View style={[styles.blob, styles.blobBottom]} />

                {/* 1.2 Welux Events Logo */}
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />

                {/* 1.3 Screen Title */}
                <Text style={styles.screenTitle}>Welux Admin</Text>

                {/* 1.4 Master Security Code Input */}
                <View style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused
                ]}>
                    <TextInput
                        mode="flat"
                        value={code}
                        onChangeText={setCode}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Master Security Code"
                        placeholderTextColor={COLORS.textGray}
                        secureTextEntry={secureTextEntry}
                        style={styles.input}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        selectionColor={COLORS.primary}
                        textColor={COLORS.textMain}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? "eye-off" : "eye"}
                                color={COLORS.textGray}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            />
                        }
                        returnKeyType="go"
                        onSubmitEditing={handleLogin}
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* 1.5 Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? "VERIFYING..." : "LOGIN"}
                    </Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // 1.1 Root View Container
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 2,
    },
    // 1.2 Logo
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 32,
        borderRadius: 60, // Circular if image allows, otherwise remove
    },
    // 1.3 Screen Title
    screenTitle: {
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontSize: 32,
        fontWeight: 'bold', // '700'
        color: COLORS.textMain,
        marginBottom: 48,
        textAlign: 'center',
    },
    // 1.4 Input
    inputContainer: {
        width: '100%',
        height: 56,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        marginBottom: 24,
        justifyContent: 'center',
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 2,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
    },
    input: {
        backgroundColor: COLORS.white,
        fontSize: 18,
        height: 56,
        paddingHorizontal: 16,
    },
    errorText: {
        color: '#D32F2F',
        marginBottom: 16,
        fontSize: 14,
        fontWeight: '600',
    },
    // 1.5 Login Button
    loginButton: {
        width: '100%',
        height: 56,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold', // '700'
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        letterSpacing: 1,
    },

    // Decorative Blobs
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.blob,
    },
    blobTop: {
        top: -120,
        left: -80,
    },
    blobBottom: {
        bottom: -80,
        right: -80,
    },
});
