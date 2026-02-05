import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Text, Pressable } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';

export default function TopBar() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        setModalVisible(false);
        logout();
        router.replace('/login');
    };

    return (
        <View style={styles.topbar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
                <Ionicons name="menu-outline" size={26} color="#1e293b" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
                <View style={styles.notificationDot} />
                <FontAwesome name="bell-o" size={20} color="#1e293b" />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.userName}>
                            {user ? `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.surname}` : 'User'}
                        </Text>
                        <Text style={styles.userEmail}>{user?.email || 'Settings'}</Text>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    topbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 20
    },
    modalContent: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    userName: { fontWeight: '700', fontSize: 16, color: '#1e293b' },
    userEmail: { fontSize: 12, color: '#64748b', marginBottom: 10 },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5
    },
    logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 15 }
});