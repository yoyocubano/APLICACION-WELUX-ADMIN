
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { Text, Surface, FAB, ActivityIndicator, Chip } from 'react-native-paper';
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
    success: '#2E7D32',
};

export default function JobListScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (err) {
            console.log("Error fetching jobs (using mock):", err);
            setJobs([
                { id: 1, title: 'Event Coordinator', company: 'Welux Events', location: 'Luxembourg', type: 'Full-time', deadline: '2026-02-01' },
                { id: 2, title: 'Videographer', company: 'Freelance', location: 'Remote / On-site', type: 'Contract', deadline: '2026-01-20' },
                { id: 3, title: 'Marketing Intern', company: 'Welux HQ', location: 'Luxembourg', type: 'Internship', deadline: '2026-03-15' },
            ]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AddEditJob', { job: item })}
        >
            <Surface style={styles.card} elevation={2}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardCompany}>{item.company}</Text>
                    </View>
                    {item.type && (
                        <Chip style={styles.chip} textStyle={styles.chipText}>{item.type}</Chip>
                    )}
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                        <Ionicons name="location-outline" size={14} color={COLORS.stone} />
                        <Text style={styles.footerText}>{item.location}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Ionicons name="time-outline" size={14} color={COLORS.stone} />
                        <Text style={styles.footerText}>Exp: {item.deadline}</Text>
                    </View>
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
                <Text style={styles.headerTitle}>Jobs</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator animating={true} color={COLORS.gold} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={jobs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No Active Jobs</Text>
                        </View>
                    }
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                color={COLORS.gold}
                onPress={() => navigation.navigate('AddEditJob')}
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
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.obsidian,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: 4,
    },
    cardCompany: {
        fontSize: 14,
        color: COLORS.stone,
        fontWeight: '500',
    },
    chip: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        height: 28,
    },
    chipText: {
        fontSize: 10,
        color: COLORS.goldDark || '#9E8229',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.stone,
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
