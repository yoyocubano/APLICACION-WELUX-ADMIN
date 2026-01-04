
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LeadsScreen from './src/screens/LeadsScreen';
import ContentManagerScreen from './src/screens/ContentManagerScreen';
import StreamingScreen from './src/screens/StreamingScreen';
import VlogListScreen from './src/screens/vlogs/VlogListScreen';
import AddEditVlogScreen from './src/screens/vlogs/AddEditVlogScreen';
import JobListScreen from './src/screens/jobs/JobListScreen';
import AddEditJobScreen from './src/screens/jobs/AddEditJobScreen';
import DealListScreen from './src/screens/deals/DealListScreen';
import AddEditDealScreen from './src/screens/deals/AddEditDealScreen';

// Custom Tabs Component
import CustomTabNavigator from './src/components/CustomTabNavigator';

const Stack = createStackNavigator();

// New Modern Theme
const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#ecb613',
        secondary: '#181611',
        background: '#f8f8f6',
        surface: '#ffffff',
    },
};

// Main Tabs using Custom Navigator
function MainTabs() {
    return <CustomTabNavigator />;
}

export default function App() {
    const isWeb = Platform.OS === 'web';

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <View style={isWeb ? styles.webContainer : styles.matchParent}>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName="Login"
                            screenOptions={{
                                headerShown: false,
                                cardStyle: { backgroundColor: '#f8f8f6' }
                            }}
                        >
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Main" component={MainTabs} />

                            {/* Vlog Screens */}
                            <Stack.Screen name="VlogList" component={VlogListScreen} />
                            <Stack.Screen name="AddEditVlog" component={AddEditVlogScreen} />

                            {/* Job Screens */}
                            <Stack.Screen name="JobList" component={JobListScreen} />
                            <Stack.Screen name="AddEditJob" component={AddEditJobScreen} />

                            {/* Deal Screens */}
                            <Stack.Screen name="DealList" component={DealListScreen} />
                            <Stack.Screen name="AddEditDeal" component={AddEditDealScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    matchParent: {
        flex: 1,
    },
    webContainer: {
        flex: 1,
        maxWidth: 420,
        height: '100%',
        alignSelf: 'center',
        width: '100%',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        overflow: 'hidden',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eee',
    }
});
