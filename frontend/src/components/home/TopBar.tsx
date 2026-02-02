import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // If you want to navigate from here

export default function TopBar() {
    const router = useRouter();

    return (
        <View style={styles.topbar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => { /* router.push('menu-screen') */ }}>
                <Ionicons name="menu-outline" size={26} color="#1e293b" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => { /* router.push('notifications-screen') */ }}>
                <View style={styles.notificationDot} />
                <FontAwesome name="bell-o" size={20} color="#1e293b" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    topbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    iconButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "#f8fafc",
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#f97316',
        zIndex: 1,
        borderWidth: 1.5,
        borderColor: '#fff'
    },
});