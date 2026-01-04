
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';

// Lujo Moderno Theme
const COLORS = {
    gold: '#D4AF37',
    goldLight: '#EAD696',
    obsidian: '#121212',
    cream: '#FAF8F3',
    white: '#FFFFFF',
    stone: '#8C8C8C',
    error: '#D32F2F',
};

export default function AddEditVlogScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { vlog } = route.params || {};

    const [title, setTitle] = useState(vlog ? vlog.title : '');
    const [description, setDescription] = useState(vlog ? vlog.description : '');
    const [loading, setLoading] = useState(false);

    // If editing, setup initial state
    const isEditing = !!vlog;

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Missing Fields", "Please enter both a title and description.");
            return;
        }

        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                title,
                description,
                updated_at: new Date(),
            };

            if (isEditing) {
                // Update
                const { error } = await supabase
                    .from('vlogs')
                    .update(payload)
                    .eq('id', vlog.id);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('vlogs')
                    .insert([{ ...payload, created_at: new Date() }]);

                if (error) throw error;
            }

            Alert.alert("Success", `Vlog ${isEditing ? 'updated' : 'created'} successfully!`, [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (err) {
            console.error("Error saving vlog:", err);
            Alert.alert("Error", "Could not save vlog. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert("Delete Vlog", "Are you sure you want to delete this vlog? This action cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    setLoading(true);
                    try {
                        const { error } = await supabase.from('vlogs').delete().eq('id', vlog.id);
                        if (error) throw error;
                        navigation.goBack();
                    } catch (err) {
                        Alert.alert("Error", "Could not delete vlog.");
                        setLoading(false);
                    }
                }
            }
        ]);
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
                    <Text style={styles.headerTitle}>{isEditing ? 'Edit Vlog' : 'New Vlog'}</Text>
                    {isEditing ? (
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                            <Ionicons name="trash-outline" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    ) : (<View style={{ width: 40 }} />)}
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>TITLE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E.g. Summer Wedding Highlights"
                            placeholderTextColor={COLORS.stone}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>DESCRIPTION</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe the content..."
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
                        <Text style={styles.saveBtnText}>{isEditing ? 'Update Vlog' : 'Create Vlog'}</Text>
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
    deleteBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: COLORS.obsidian,
    },
    form: {
        gap: 24,
        marginBottom: 40,
    },
    inputGroup: {
        gap: 10,
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
        // Minimal border
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    textArea: {
        height: 150,
    },
    saveBtn: {
        height: 56,
        backgroundColor: COLORS.obsidian,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow
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
