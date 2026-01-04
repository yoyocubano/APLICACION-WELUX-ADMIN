
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
    error: '#D32F2F',
    discount: '#E53935',
};

export default function DealListScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDeals = async () => {
        try {
            const { data, error } = await supabase
                .from('deals')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDeals(data || []);
        } catch (err) {
            console.log("Error fetching deals (using mock):", err);
            setDeals([
                { id: 1, title: 'Winter Wedding Special', description: '20% off full photography packages for January/February weddings.', discount: '20% OFF', expiration: '2026-02-28' },
                { id: 2, title: 'Early Bird Corporate', description: 'Book your 2026 gala now and get free lighting upgrade.', discount: 'FREE UPGRADE', expiration: '2026-03-30' },
                { id: 3, title: 'Family Portrait Session', description: 'Mini-sessions available at the studio.', discount: '€50 OFF', expiration: '2026-01-31' },
            ]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDeals();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AddEditDeal', { deal: item })}
        >
            <Surface style={styles.card} elevation={2}>
                <View style={styles.cardHeader}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                    </View>
                    <View style={[styles.discountBadge, { transform: [{ rotate: '12deg' }] }]}>
                        <Text style={styles.discountText}>{item.discount}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                        <Ionicons name="hourglass-outline" size={14} color={COLORS.stone} />
                        <Text style={[styles.footerText, { color: COLORS.error }]}>Expires: {item.expiration}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.stone} />
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
                <Text style={styles.headerTitle}>Deals</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator animating={true} color={COLORS.gold} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={deals}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No Active Deals</Text>
                        </View>
                    }
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                color={COLORS.gold}
                onPress={() => navigation.navigate('AddEditDeal')}
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
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.obsidian,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        color: COLORS.stone,
        lineHeight: 18,
    },
    discountBadge: {
        backgroundColor: COLORS.obsidian,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: COLORS.gold,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    discountText: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '600',
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
