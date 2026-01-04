
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Lujo Moderno Theme
const COLORS = {
    gold: '#D4AF37',
    goldLight: '#EAD696',
    obsidian: '#121212',
    cream: '#FAF8F3',
    white: '#FFFFFF',
    stone: '#8C8C8C',
};

const MENU_ITEMS = [
    { id: 'vlogs', title: 'Vlogs', subtitle: 'Manage video content', icon: 'film', color: '#1E1E1E', route: 'VlogList' },
    { id: 'jobs', title: 'Jobs', subtitle: 'Open positions', icon: 'briefcase', color: '#2C3E50', route: 'JobList' },
    { id: 'deals', title: 'Deals', subtitle: 'Special offers', icon: 'pricetag', color: '#C0392B', route: 'DealList' },
    { id: 'settings', title: 'Settings', subtitle: 'App configuration', icon: 'settings', color: COLORS.stone, route: null },
];

export default function ContentManagerScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handlePress = (item) => {
        if (item.route) {
            navigation.navigate(item.route);
        } else {
            // Placeholder for features not yet implemented
            alert(`Feature ${item.title} coming soon!`);
        }
    };

    const MenuItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.menuItem}
            onPress={() => handlePress(item)}
        >
            <View style={styles.iconContainer}>
                <Surface style={styles.iconSurface} elevation={2}>
                    <Ionicons name={item.icon} size={24} color={COLORS.gold} />
                </Surface>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.stone} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Content Manager</Text>
                    <Text style={styles.subtitle}>Select a module to edit</Text>
                </View>

                {/* Menu Grid */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </View>

                {/* Quick Action Banner */}
                <View style={styles.banner}>
                    <View>
                        <Text style={styles.bannerTitle}>Need Help?</Text>
                        <Text style={styles.bannerText}>Contact support</Text>
                    </View>
                    <TouchableOpacity style={styles.bannerBtn}>
                        <Text style={styles.bannerBtnText}>Chat</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 40,
    },
    title: {
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: COLORS.obsidian,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.stone,
        marginTop: 8,
    },
    menuContainer: {
        gap: 16,
        marginBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 20,
        // Soft Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 16,
    },
    iconSurface: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: COLORS.obsidian,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.obsidian,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    itemSub: {
        fontSize: 12,
        color: COLORS.stone,
        marginTop: 2,
    },

    // Banner
    banner: {
        backgroundColor: COLORS.gold,
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    bannerText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    bannerBtn: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    bannerBtnText: {
        fontWeight: 'bold',
        color: COLORS.gold,
    }
});
