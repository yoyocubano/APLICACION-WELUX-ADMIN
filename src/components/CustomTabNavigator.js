
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import LeadsScreen from '../screens/LeadsScreen';
import ContentManagerScreen from '../screens/ContentManagerScreen';
import StreamingScreen from '../screens/StreamingScreen';

const COLORS = {
    primary: '#ecb613',
    inactive: '#897f61',
    background: '#ffffff',
    border: '#e6e3db',
};

export default function CustomTabNavigator() {
    const [activeTab, setActiveTab] = useState('Overview');
    const insets = useSafeAreaInsets();

    const tabs = [
        { id: 'Overview', label: 'Overview', component: DashboardScreen },
        { id: 'Leads', label: 'Leads', component: LeadsScreen },
        { id: 'Content', label: 'Content', component: ContentManagerScreen },
        { id: 'Live', label: 'Live', component: StreamingScreen },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardScreen;

    return (
        <View style={styles.container}>
            {/* Top Tab Bar */}
            <View style={[styles.tabBar, { paddingTop: insets.top }]}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tab}
                        onPress={() => setActiveTab(tab.id)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabLabel,
                                activeTab === tab.id && styles.tabLabelActive
                            ]}
                        >
                            {tab.label}
                        </Text>
                        {activeTab === tab.id && <View style={styles.indicator} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <ActiveComponent />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f6',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        position: 'relative',
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: COLORS.inactive,
    },
    tabLabelActive: {
        color: COLORS.primary,
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: COLORS.primary,
    },
    content: {
        flex: 1,
    },
});
