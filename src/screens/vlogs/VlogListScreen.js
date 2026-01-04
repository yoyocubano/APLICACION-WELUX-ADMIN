
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Platform, RefreshControl } from 'react-native';
import { Text, Surface, FAB, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase';

// Lujo Moderno Theme
const COLORS = {
    gold: '#D4AF37',
    goldLight: '#EAD696',
    obsidian: '#121212',
    cream: '#FAF8F3',
    white: '#FFFFFF',
    stone: '#8C8C8C',
};

export default function VlogListScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [vlogs, setVlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVlogs = async () => {
        try {
            const { data, error } = await supabase
                .from('vlogs') // Assuming table name is 'vlogs'
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVlogs(data || []);
        } catch (err) {
            // If table doesn't exist yet, we'll use mock data for demo
            console.log("Error fetching vlogs, using mock data:", err);
            setVlogs([
                { id: 1, title: 'Summer Wedding Highlights', description: 'Best moments from the majestic garden wedding.', date: '2025-06-15', thumbnail: null },
                { id: 2, title: 'Corporate Gala 2024', description: 'Full coverage of the annual tech summit.', date: '2024-12-10', thumbnail: null },
                { id: 3, title: 'Behind the Scenes', description: 'Setting up the stage for the rock concert.', date: '2024-11-20', thumbnail: null },
            ]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVlogs();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchVlogs();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AddEditVlog', { vlog: item })}
        >
            <Surface style={styles.card} elevation={2}>
                <View style={styles.thumbnailContainer}>
                    {item.thumbnail ? (
                        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                    ) : (
                        <View style={styles.placeholderThumbnail}>
                            <Ionicons name="play-circle-outline" size={32} color={COLORS.gold} />
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.cardFooter}>
                        <Ionicons name="calendar-outline" size={12} color={COLORS.stone} />
                        <Text style={styles.cardDate}>{item.date || 'No Date'}</Text>
                    </View>
                </View>
                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.stone} />
                </View>
            </Surface>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.obsidian} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Vlogs</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator animating={true} color={COLORS.gold} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={vlogs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No vlogs found. Add one!</Text>
                        </View>
                    }
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                color={COLORS.gold}
                onPress={() => navigation.navigate('AddEditVlog')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: COLORS.obsidian,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        padding: 12,
    },
    thumbnailContainer: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    placeholderThumbnail: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.obsidian,
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.obsidian,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        color: COLORS.stone,
        lineHeight: 18,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardDate: {
        fontSize: 10,
        color: COLORS.stone,
    },
    arrowContainer: {
        justifyContent: 'center',
        paddingLeft: 8,
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.obsidian,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.stone,
        fontStyle: 'italic',
    }
});
