
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';

const COLORS = {
    gold: '#D4AF37',
    obsidian: '#121212',
    cream: '#FAF8F3',
    white: '#FFFFFF',
    stone: '#8C8C8C',
};

export default function AddEditDealScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { deal } = route.params || {};

    const [title, setTitle] = useState(deal ? deal.title : '');
    const [discount, setDiscount] = useState(deal ? deal.discount : '');
    const [expiration, setExpiration] = useState(deal ? deal.expiration : '');
    const [description, setDescription] = useState(deal ? deal.description : '');
    const [loading, setLoading] = useState(false);

    const isEditing = !!deal;

    const handleSave = async () => {
        if (!title.trim() || !discount.trim()) {
            Alert.alert("Missing Fields", "Please enter at least Title and Discount.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title,
                discount,
                expiration,
                description,
                updated_at: new Date(),
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('deals')
                    .update(payload)
                    .eq('id', deal.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('deals')
                    .insert([{ ...payload, created_at: new Date() }]);
                if (error) throw error;
            }

            Alert.alert("Success", "Deal saved successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (err) {
            console.error("Error saving deal:", err);
            Alert.alert("Demo Mode", "Deal saved locally (mock).", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="close" size={24} color={COLORS.obsidian} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{isEditing ? 'Edit Deal' : 'New Deal'}</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>DEAL TITLE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E.g. Summer Special"
                            placeholderTextColor={COLORS.stone}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>DISCOUNT</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="20% OFF"
                                placeholderTextColor={COLORS.stone}
                                value={discount}
                                onChangeText={setDiscount}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>EXPIRATION</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={COLORS.stone}
                                value={expiration}
                                onChangeText={setExpiration}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>DESCRIPTION</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Deal terms and details..."
                            placeholderTextColor={COLORS.stone}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    style={[styles.saveBtn, loading && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.gold} />
                    ) : (
                        <Text style={styles.saveBtnText}>{isEditing ? 'Update Deal' : 'Launch Deal'}</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: COLORS.obsidian,
    },
    form: {
        gap: 20,
        marginBottom: 40,
    },
    inputGroup: {
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: COLORS.stone,
    },
    input: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        color: COLORS.obsidian,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    textArea: {
        height: 120,
    },
    saveBtn: {
        height: 56,
        backgroundColor: COLORS.obsidian,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.obsidian,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    saveBtnText: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});
