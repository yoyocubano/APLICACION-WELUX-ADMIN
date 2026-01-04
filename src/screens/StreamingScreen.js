
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Text, Switch, Divider, Snackbar } from 'react-native-paper';
import { supabase } from '../services/supabase';

export default function StreamingScreen() {
    const [streamPlatform, setStreamPlatform] = useState('youtube');
    const [channelId, setChannelId] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const { data } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'stream_config')
            .single();

        if (data?.value) {
            const config = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
            setStreamPlatform(config.platform || 'youtube');
            setChannelId(config.channelId || '');
        }
    };

    const saveConfig = async () => {
        setLoading(true);
        try {
            const config = { platform: streamPlatform, channelId };
            const { error } = await supabase
                .from('app_settings')
                .upsert({ key: 'stream_config', value: config });

            if (error) throw error;
            setVisible(true); // Show success toast
        } catch (err) {
            console.error(err);
            alert('Error al guardar configuración');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="headlineSmall" style={styles.header}>Configuración de Live</Text>
            <Text style={styles.desc}>
                Controla lo que se ve en la sección "Live" de weluxevents.com desde tu móvil.
            </Text>

            <View style={styles.section}>
                <Text style={styles.label}>Fuente de Emisión</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    <Button
                        mode={streamPlatform === 'youtube' ? 'contained' : 'outlined'}
                        onPress={() => setStreamPlatform('youtube')}
                        icon="youtube"
                        buttonColor={streamPlatform === 'youtube' ? '#FF0000' : undefined}
                        style={styles.btnChoice}
                    >
                        YouTube
                    </Button>
                    <Button
                        mode={streamPlatform === 'twitch' ? 'contained' : 'outlined'}
                        onPress={() => setStreamPlatform('twitch')}
                        icon="twitch"
                        buttonColor={streamPlatform === 'twitch' ? '#9146FF' : undefined}
                        style={styles.btnChoice}
                        textColor={streamPlatform === 'twitch' ? 'white' : '#9146FF'}
                    >
                        Twitch
                    </Button>
                    <Button
                        mode={streamPlatform === 'url' ? 'contained' : 'outlined'}
                        onPress={() => setStreamPlatform('url')}
                        icon="link"
                        style={styles.btnChoice}
                    >
                        Link / OBS
                    </Button>
                    <Button
                        mode={streamPlatform === 'custom' ? 'contained' : 'outlined'}
                        onPress={() => setStreamPlatform('custom')}
                        icon="code-tags"
                        style={styles.btnChoice}
                    >
                        HTML
                    </Button>
                </ScrollView>
            </View>

            <View style={styles.section}>
                <TextInput
                    label={
                        streamPlatform === 'youtube' ? "Link de YouTube" :
                            streamPlatform === 'twitch' ? "Canal de Twitch" :
                                streamPlatform === 'url' ? "URL de Transmisión (m3u8/mp4)" :
                                    "Código Iframe"
                    }
                    value={channelId}
                    onChangeText={setChannelId}
                    mode="outlined"
                    multiline={streamPlatform === 'custom' || streamPlatform === 'url'}
                    numberOfLines={streamPlatform === 'custom' ? 4 : 1}
                    right={<TextInput.Icon icon="content-paste" />}
                    activeOutlineColor="#D4AF37"
                />
                <Text style={styles.helper}>
                    {streamPlatform === 'youtube' ? "Ej: https://youtube.com/watch?v=..." :
                        streamPlatform === 'twitch' ? "Ej: ibai" :
                            streamPlatform === 'url' ? "Ej: https://mi-servidor.com/stream.m3u8 (OBS)" :
                                "Pega el código <iframe src='...'></iframe> completo."}
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={saveConfig}
                loading={loading}
                icon="broadcast"
                style={styles.saveBtn}
                buttonColor="#1a1a1a"
            >
                ACTUALIZAR SITIO WEB
            </Button>

            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
            >
                ¡Web actualizada con éxito!
            </Snackbar>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FAF8F3',
        flexGrow: 1,
    },
    header: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    desc: {
        color: '#666',
        marginBottom: 20,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    btnChoice: {
        flex: 1,
    },
    helper: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    saveBtn: {
        marginTop: 20,
        paddingVertical: 5,
    }
});
