import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MetaProps {
    prepTime: number | undefined;
    cookTime: number | undefined;
    servings: number | undefined;
    category: string;
}

const MetaBox = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View style={styles.metaBox}>
        <Ionicons name={icon} size={18} color="#f97316" />
        <View>
            <Text style={styles.metaLabel}>{label}</Text>
            <Text style={styles.metaValue}>{value}</Text>
        </View>
    </View>
);

export const RecipeMeta = ({ prepTime, cookTime, servings, category }: MetaProps) => (
    <View style={styles.metaRow}>
        <MetaBox icon="time-outline" label="Total" value={`${(prepTime || 0) + (cookTime || 0)}m`} />
        <View style={styles.metaDivider} />
        <MetaBox icon="people-outline" label="Servings" value={`${servings || 1}`} />
        <View style={styles.metaDivider} />
        <MetaBox icon="flame-outline" label="Category" value={category} />
    </View>
);

const styles = StyleSheet.create({
    metaRow: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    metaBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaDivider: { width: 1, height: 25, backgroundColor: '#e2e8f0' },
    metaLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
    metaValue: { fontSize: 12, color: '#1e293b', fontWeight: '700' },
});