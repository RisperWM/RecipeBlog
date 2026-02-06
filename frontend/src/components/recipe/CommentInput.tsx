import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    value: string;
    onChange: (t: string) => void;
    onSubmit: () => void;
    isPending: boolean;
}

export const CommentInput = ({ value, onChange, onSubmit, isPending }: Props) => (
    <SafeAreaView style={styles.wrapper} edges={['bottom']}>
        <View style={styles.row}>
            <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                value={value}
                onChangeText={onChange}
                multiline
                placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
                onPress={onSubmit}
                disabled={!value.trim() || isPending}
                style={[styles.sendBtn, !value.trim() && styles.disabledBtn]}
            >
                {isPending ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Ionicons name="send" size={18} color="#fff" />
                )}
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    wrapper: { borderTopWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 10 },
    row: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: Platform.OS === 'android' ? 10 : 0 },
    input: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0', maxHeight: 100, fontSize: 15 },
    sendBtn: { backgroundColor: '#f97316', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    disabledBtn: { backgroundColor: '#cbd5e1' },
});