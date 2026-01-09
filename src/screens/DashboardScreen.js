
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, Image, Linking } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const [systemStatus, setSystemStatus] = useState(null);
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

            // Fetch System Health from Cloudflare
            const res = await fetch('https://welux-events.pages.dev/api/system-status');
            const statusData = await res.json();
            setSystemStatus(statusData);

            if (statusData.supabase) {
                setStats(prev => ({ ...prev, systemHealth: 'Optimal' }));
            }
        } catch (e) {
            console.error("Dashboard Fetch Error:", e);
            setStats(prev => ({ ...prev, systemHealth: 'Offline' }));
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

    const handleLogout = () => {
        navigation.replace('Login');
    };

    const onRefresh = () => {
        fetchStats();
        fetchRecentActivity();
    };

    const StatusRow = ({ name, status, details }) => {
        const isOperational = status === 'operational' || status === 'ready';
        const isCritical = status === 'failed' || status === 'critical' || status === 'exhausted';
        const isAI = name.includes('AI') || name.includes('DeepSeek');

        const handlePress = () => {
            if (isAI) {
                Linking.openURL('https://platform.deepseek.com/top_up');
            }
        };

        return (
            <TouchableOpacity
                style={[
                    styles.statusRow,
                    isAI && {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: 8,
                        borderRadius: 12,
                        marginVertical: 4,
                        borderWidth: 1,
                        borderColor: isCritical ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255,255,255,0.1)'
                    }
                ]}
                onPress={handlePress}
                disabled={!isAI}
                activeOpacity={0.6}
            >
                <View>
                    <View style={styles.statusInfo}>
                        <View style={[styles.statusIndicator, {
                            backgroundColor: isOperational ? '#4CAF50' : (isCritical ? '#F44336' : '#FF9800')
                        }]} />
                        <Text style={styles.statusName}>{name}</Text>
                    </View>
                    {isAI && (
                        <Text style={{
                            fontSize: 10,
                            color: COLORS.gold,
                            marginLeft: 20,
                            marginTop: 2,
                            fontWeight: 'bold',
                            letterSpacing: 0.5
                        }}>
                            {isCritical ? '⚠ CREDIT EXHAUSTED - TAP TO RECHARGE' : 'TAP TO MANAGE DEEPSEEK FUNDS'}
                        </Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.statusDetails, isCritical && { color: '#F44336' }]}>
                        {details || status}
                    </Text>
                    {isAI && <Ionicons name="chevron-forward" size={14} color={COLORS.gold} />}
                </View>
            </TouchableOpacity>
        );
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
                    <TouchableOpacity style={styles.profileBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color={COLORS.gold} />
                    </TouchableOpacity>
                </View>

                {/* System Health Section (New) */}
                <Surface style={styles.systemCard} elevation={2}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>SYSTEM PULSE</Text>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>
                    <View style={styles.statusList}>
                        {systemStatus ? (
                            systemStatus.services.map((svc, idx) => (
                                <StatusRow key={idx} name={svc.name} status={svc.status} details={svc.details} />
                            ))
                        ) : (
                            <Text style={{ color: '#888', fontStyle: 'italic' }}>Syncing with core...</Text>
                        )}
                    </View>
                </Surface>

                {/* Stats Grid */}
                <View style={[styles.grid, { marginTop: 24 }]}>
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
    systemCard: {
        backgroundColor: COLORS.obsidian,
        borderRadius: 24,
        padding: 24,
        shadowColor: COLORS.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    cardTitle: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
    },
    liveText: {
        color: '#4CAF50',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusList: {
        marginTop: 20,
        gap: 12,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusName: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    statusDetails: {
        color: COLORS.stone,
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
});
