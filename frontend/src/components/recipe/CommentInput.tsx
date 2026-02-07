import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    value: string;
    onChange: (t: string) => void;
    onSubmit: () => void;
    isPending: boolean;
    isEditing?: boolean;     
    onCancelEdit?: () => void;
}

export const CommentInput = ({
    value,
    onChange,
    onSubmit,
    isPending,
    isEditing,
    onCancelEdit
}: Props) => (
    <SafeAreaView style={styles.wrapper} edges={['bottom']}>
        <View style={styles.row}>
            {isEditing && (
                <TouchableOpacity onPress={onCancelEdit} style={styles.cancelBtn}>
                    <Ionicons name="close-circle" size={24} color="#64748b" />
                </TouchableOpacity>
            )}
            <TextInput
                style={[styles.input, isEditing && styles.editingInput]}
                placeholder={isEditing ? "Edit your comment..." : "Add a comment..."}
                value={value}
                onChangeText={onChange}
                multiline
                placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
                onPress={onSubmit}
                disabled={!value.trim() || isPending}
                style={[
                    styles.sendBtn,
                    !value.trim() && styles.disabledBtn,
                    isEditing && { backgroundColor: '#10b981' }
                ]}
            >
                {isPending ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Ionicons name={isEditing ? "checkmark" : "send"} size={18} color="#fff" />
                )}
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    wrapper: {
        borderTopWidth: 1,
        borderColor: '#f1f5f9',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 10
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 10 : 0
    },
    input: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        maxHeight: 100,
        fontSize: 15,
        color: '#1e293b'
    },
    editingInput: {
        borderColor: '#10b981',
        backgroundColor: '#f0fdf4'
    },
    cancelBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendBtn: {
        backgroundColor: '#f97316',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledBtn: {
        backgroundColor: '#cbd5e1'
    },
});