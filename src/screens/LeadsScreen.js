
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Linking, RefreshControl, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

// Stitch Design Constants (Matching Login & HTML)
const COLORS = {
    gold: '#D4AF37',
    goldDark: '#9E8229',
    goldLight: '#EAD696',
    cream: '#FAF8F3',
    obsidian: '#121212',
    stone: '#8C8C8C',
    white: '#FFFFFF',
};

const FILTER_CHIPS = ["All", "New", "Contacted", "Booked"];

export default function LeadsScreen() {
    const insets = useSafeAreaInsets();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState(null); // For accordion effect
    const [activeFilter, setActiveFilter] = useState("All");

    const fetchLeads = async () => {
        try {
            const { data, error } = await supabase
                .from('client_inquiries')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeads();
        setExpandedId(null);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id); // Toggle logic
    };

    const contactClient = (type, value) => {
        if (type === 'email') Linking.openURL(`mailto:${value}`);
        if (type === 'phone') Linking.openURL(`tel:${value}`);
    };

    const renderFilter = ({ item }) => {
        const isActive = activeFilter === item;
        return (
            <TouchableOpacity
                style={[
                    styles.filterChip,
                    isActive ? styles.filterChipActive : styles.filterChipInactive
                ]}
                onPress={() => setActiveFilter(item)}
            >
                <Text style={[styles.filterText, isActive ? { color: COLORS.gold } : { color: COLORS.stone }]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;
        const dateStr = new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        return (
            <View style={styles.cardContainer}>
                {/* Main Card */}
                <TouchableOpacity
                    style={styles.cardHeader}
                    activeOpacity={0.9}
                    onPress={() => toggleExpand(item.id)}
                >
                    {/* Status Indicator Line (Left) */}
                    <View style={[styles.statusLine, { backgroundColor: isExpanded ? COLORS.gold : COLORS.goldLight }]} />

                    <View style={styles.cardContent}>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.clientName}>{item.name}</Text>
                                <Text style={styles.eventType}>{item.eventType || "Consulta General"}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.dateText}>{dateStr}</Text>
                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={COLORS.gold}
                                    style={{ marginTop: 4 }}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Expandable Content (Accordion) */}
                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.divider} />
                        <Text style={styles.messageText}>
                            {item.message || "No hay mensaje adjunto."}
                        </Text>

                        <View style={styles.actionRow}>
                            {item.phone && (
                                <TouchableOpacity style={styles.callButton} onPress={() => contactClient('phone', item.phone)}>
                                    <Ionicons name="call" size={16} color={COLORS.gold} style={{ marginRight: 8 }} />
                                    <Text style={styles.callButtonText}>Call Client</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.emailButton} onPress={() => contactClient('email', item.email)}>
                                <Ionicons name="mail" size={16} color={COLORS.obsidian} style={{ marginRight: 8 }} />
                                <Text style={styles.emailButtonText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header & Filters */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Leads CRM</Text>
                <TouchableOpacity style={styles.filterIconBtn}>
                    <Ionicons name="filter" size={20} color={COLORS.obsidian} />
                </TouchableOpacity>
            </View>

            <View style={styles.filtersContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={FILTER_CHIPS}
                    renderItem={renderFilter}
                    keyExtractor={item => item}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
                />
            </View>

            <FlatList
                data={leads}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white, // As per Stitch HTML body bg
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    headerTitle: {
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.obsidian,
    },
    filterIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    filtersContainer: {
        paddingBottom: 5,
    },
    filterChip: {
        height: 36,
        paddingHorizontal: 20,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
    },
    filterChipActive: {
        backgroundColor: COLORS.obsidian,
        borderColor: COLORS.obsidian,
    },
    filterChipInactive: {
        backgroundColor: COLORS.white,
        borderColor: '#E5E5E5',
        borderWidth: 1,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    listContent: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },

    // CARD STYLES
    cardContainer: {
        backgroundColor: COLORS.cream,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)', // Gold/10
        // Luxury Shadow
        shadowColor: "#141414",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
    },
    statusLine: {
        width: 6,
        backgroundColor: COLORS.gold,
    },
    cardContent: {
        flex: 1,
        padding: 20,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clientName: {
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.obsidian,
        marginBottom: 4,
    },
    eventType: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: COLORS.goldDark,
    },
    dateText: {
        fontSize: 11,
        fontWeight: '500',
        color: COLORS.stone,
    },

    // EXPANDED
    expandedContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingLeft: 26, // Align with content text (skip status line)
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        marginBottom: 16,
    },
    messageText: {
        fontSize: 14,
        color: COLORS.stone,
        lineHeight: 22,
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    callButton: {
        flex: 1,
        height: 48,
        backgroundColor: COLORS.obsidian,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    callButtonText: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 14,
    },
    emailButton: {
        flex: 1,
        height: 48,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(18, 18, 18, 0.2)',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailButtonText: {
        color: COLORS.obsidian,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
