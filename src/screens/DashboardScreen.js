
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

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

export default function DashboardScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [recentLeads, setRecentLeads] = useState([]);
    const [stats, setStats] = useState({
        totalLeads: 0,
        streamingStatus: 'LIVE',
        systemHealth: 'Optimal',
        weeklyGrowth: '+12%'
    });

    // Dynamic Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'GOOD MORNING';
        if (hour < 18) return 'GOOD AFTERNOON';
        if (hour < 21) return 'GOOD EVENING';
        return 'GOOD NIGHT';
    };

    // Fetch Real Stats & Recent Activity
    useEffect(() => {
        fetchStats();
        fetchRecentActivity();
    }, []);

    const fetchStats = async () => {
        setRefreshing(true);
        try {
            const { count, error } = await supabase
                .from('client_inquiries')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            setStats(prev => ({
                ...prev,
                totalLeads: count || 0
            }));
        } catch (e) {
            console.error("Dashboard Fetch Error:", e);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const { data, error } = await supabase
                .from('client_inquiries')
                .select('id, name, eventType, createdAt')
                .order('createdAt', { ascending: false })
                .limit(3);

            if (error) throw error;
            setRecentLeads(data || []);
        } catch (e) {
            console.error("Recent Activity Fetch Error:", e);
        }
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const onRefresh = () => {
        fetchStats();
    };

    const StatCard = ({ title, value, subtext, icon, color }) => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={24} color={color} />
                </View>
                {title === 'Streaming' && value === 'LIVE' && (
                    <View style={[styles.badge, { backgroundColor: COLORS.success }]}>
                        <View style={styles.dot} />
                        <Text style={styles.badgeText}>ON AIR</Text>
                    </View>
                )}
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
            {subtext && <Text style={styles.statSub}>{subtext}</Text>}
        </Surface>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()},</Text>
                        <Image
                            source={{ uri: 'https://cdn.b12.io/client_media/b6a2267D/b9637656-7871-11ef-92df-0242ac110002-jpg-regular_image.jpeg' }}
                            style={{ width: 160, height: 40, resizeMode: 'contain', marginLeft: -4, marginTop: 4 }}
                        />
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <Ionicons name="person" size={20} color={COLORS.gold} />
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.grid}>
                    <View style={styles.col}>
                        <StatCard
                            title="Total Leads"
                            value={stats.totalLeads}
                            subtext={stats.weeklyGrowth}
                            icon="people"
                            color={COLORS.gold}
                        />
                        <StatCard
                            title="System Health"
                            value={stats.systemHealth}
                            icon="server"
                            color={COLORS.obsidian}
                        />
                    </View>
                    <View style={styles.col}>
                        <StatCard
                            title="Streaming"
                            value={stats.streamingStatus}
                            icon="videocam"
                            color="#D32F2F"
                        />
                        <Surface style={[styles.card, { backgroundColor: COLORS.obsidian }]} elevation={4}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(212, 175, 55, 0.2)' }]}>
                                    <Ionicons name="trending-up" size={24} color={COLORS.gold} />
                                </View>
                            </View>
                            <Text style={[styles.statValue, { color: COLORS.gold }]}>$24k</Text>
                            <Text style={[styles.statTitle, { color: COLORS.white }]}>Revenue</Text>
                            <Text style={[styles.statSub, { color: '#888' }]}>This Month</Text>
                        </Surface>
                    </View>
                </View>

                {/* Recent Activity Section */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <Surface style={styles.activityCard} elevation={1}>
                    {recentLeads.length > 0 ? (
                        recentLeads.map((lead, index) => (
                            <View key={lead.id}>
                                {index > 0 && <View style={styles.divider} />}
                                <View style={styles.activityItem}>
                                    <View style={styles.activityDot} />
                                    <View>
                                        <Text style={styles.activityText}>
                                            New {lead.eventType || 'inquiry'} from {lead.name}
                                        </Text>
                                        <Text style={styles.activityTime}>
                                            {getTimeAgo(lead.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.activityItem}>
                            <Text style={styles.activityText}>No recent activity</Text>
                        </View>
                    )}
                </Surface>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.stone,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        color: COLORS.obsidian,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
    },
    profileBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    col: {
        flex: 1,
        gap: 16,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        minHeight: 160,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.obsidian,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    statTitle: {
        fontSize: 14,
        color: COLORS.stone,
        fontWeight: '500',
        marginTop: 4,
    },
    statSub: {
        fontSize: 12, // smaller
        color: COLORS.success,
        fontWeight: '700',
        marginTop: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: COLORS.obsidian,
        marginBottom: 16,
    },
    activityCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
    },
    activityItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    activityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.gold,
    },
    activityText: {
        fontSize: 14,
        color: COLORS.obsidian,
        fontWeight: '500',
    },
    activityTime: {
        fontSize: 12,
        color: COLORS.stone,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 16,
        marginLeft: 26,
    },
});
