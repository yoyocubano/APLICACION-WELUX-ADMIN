
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

// New Design System from HTML
const COLORS = {
    primary: '#ecb613',
    primaryDark: '#d9a610',
    backgroundLight: '#FAF8F3',
    backgroundDark: '#1a1a1a',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#2C2C2C',
    textMain: '#181611',
    textSecondary: '#897f61',
    border: '#e6e3db',
    blobGold: 'rgba(236, 182, 19, 0.15)',
};

export default function LoginScreen({ navigation }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
                style={styles.keyboardView}
            >
                {/* Background Decorative Elements */}
                <View style={styles.blobTopRight} />
                <View style={styles.blobBottomLeft} />

                <View style={styles.contentWrapper}>
                    {/* Logo / Header Section */}
                    <View style={styles.headerSection}>
                        {/* Diamond Logo */}
                        <View style={styles.logoContainer}>
                            <Ionicons name="diamond" size={32} color={COLORS.surfaceLight} />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Welux Events</Text>

                        {/* Subtitle */}
                        <Text style={styles.subtitle}>ADMINISTRATION ACCESS</Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.formSection}>
                        {/* Input Label */}
                        <Text style={styles.inputLabel}>Master Security Code</Text>

                        {/* Input Container */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor={`${COLORS.textSecondary}80`}
                                value={code}
                                onChangeText={setCode}
                                secureTextEntry={secureTextEntry}
                                autoCapitalize="none"
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            >
                                <Ionicons
                                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        {/* Primary Action Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.9}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.textMain} />
                            ) : (
                                <Text style={styles.loginButtonText}>Verify Access</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* FaceID Button (Decorative for now) */}
                        <TouchableOpacity
                            style={styles.faceIdButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="person-outline" size={20} color={COLORS.textMain} />
                            <Text style={styles.faceIdButtonText}>Sign in with FaceID</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>
                                Forgot Code? Contact IT Support
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    keyboardView: {
        flex: 1,
    },
    // Background blobs
    blobTopRight: {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '50%',
        height: '30%',
        backgroundColor: COLORS.blobGold,
        borderRadius: 9999,
        opacity: 0.6,
    },
    blobBottomLeft: {
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '40%',
        height: '40%',
        backgroundColor: COLORS.blobGold,
        borderRadius: 9999,
        opacity: 0.4,
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 448, // max-w-md (28rem = 448px)
        marginHorizontal: 'auto',
        paddingHorizontal: 24,
        paddingVertical: 40,
        zIndex: 10,
    },
    // Header Section
    headerSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 48,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 44,
        color: COLORS.textMain,
        marginBottom: 8,
    },
    subtitle: {
        color: `${COLORS.textMain}99`, // 60% opacity
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 3.2, // 0.2em tracking
        textAlign: 'center',
    },
    // Form Section
    formSection: {
        width: '100%',
        gap: 24,
    },
    inputLabel: {
        color: COLORS.textMain,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        paddingLeft: 4,
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        width: '100%',
        height: 56,
        paddingLeft: 16,
        paddingRight: 48,
        borderRadius: 8,
        backgroundColor: COLORS.surfaceLight,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textMain,
        fontSize: 16,
        fontWeight: '400',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    eyeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 56,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center',
        marginTop: -12, // Negative margin to reduce gap
    },
    loginButton: {
        width: '100%',
        height: 56,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: COLORS.textMain,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.24, // 0.015em
    },
    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        color: `${COLORS.textMain}66`, // 40% opacity
        fontSize: 12,
        fontWeight: '500',
    },
    // FaceID Button
    faceIdButton: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
    },
    faceIdButtonText: {
        color: COLORS.textMain,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.21, // 0.015em
    },
    // Footer
    footer: {
        marginTop: 'auto',
        paddingTop: 40,
        paddingBottom: 16,
        width: '100%',
        alignItems: 'center',
    },
    footerLink: {
        color: `${COLORS.textMain}80`, // 50% opacity
        fontSize: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
});
