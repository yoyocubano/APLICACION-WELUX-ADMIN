
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Users, Video, Layers, FileText } from 'lucide-react-native';
// import { Ionicons } from '@expo/vector-icons'; (Removed due to missing dependency)
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ... (Lines 11 onward unchanged)

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderTopColor: 'rgba(212, 175, 55, 0.1)',
                    elevation: 0,
                    height: 85,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#D4AF37',
                tabBarInactiveTintColor: '#8C8C8C',
                tabBarLabelStyle: {
                    fontFamily: 'System',
                    fontSize: 10,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    marginTop: 4,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Overview') return <FileText size={24} color={color} />;
                    if (route.name === 'Leads') return <Users size={24} color={color} />;
                    if (route.name === 'Content') return <Layers size={24} color={color} />;
                    if (route.name === 'Live') return <Video size={24} color={color} />;
                    return null;
                },
            })}
        >
            <Tab.Screen name="Overview" component={DashboardScreen} />
            <Tab.Screen name="Leads" component={LeadsScreen} />
            <Tab.Screen name="Content" component={ContentManagerScreen} />
            <Tab.Screen name="Live" component={StreamingScreen} />
        </Tab.Navigator>
    );
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
                                cardStyle: { backgroundColor: '#FFFFFF' }
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
