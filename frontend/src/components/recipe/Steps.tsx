import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRecipeStore } from '@/src/store/recipeStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/src/service/recipeService';
import { useRouter } from 'expo-router';
import Input from '../Input';
import { Ionicons } from '@expo/vector-icons';

export default function Steps({ onBack }: any) {
    const { draft, resetDraft, setDraft } = useRecipeStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    const steps = draft.steps || [];

    const { mutate, isPending } = useMutation({
        mutationFn: recipeService.createRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
            resetDraft();
            Alert.alert("Success", "Recipe Published!");
            router.replace('/(tabs)'); // Navigate back to main feed
        },
        onError: (err) => {
            Alert.alert("Error", "Could not save recipe.");
            console.log('err=>', err);
        }
    });

    const updateStep = (index: number, val: string) => {
        const list = [...steps];
        list[index] = { stepNumber: index + 1, instruction: val };
        setDraft({ steps: list });
    };

    const addStep = () => {
        setDraft({ steps: [...steps, { stepNumber: steps.length + 1, instruction: '' }] });
    };

    // UI Parts for FlatList
    const ListHeader = () => <Text style={styles.sectionTitle}>Instructions</Text>;

    const ListFooter = () => (
        <TouchableOpacity onPress={addStep} style={styles.addButton}>
            <Ionicons name="add" size={20} color="#f97316" />
            <Text style={{ color: '#f97316', fontWeight: '700', marginLeft: 5 }}>Add Step</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <View style={styles.container}>
                <FlatList
                    data={steps}
                    keyExtractor={(_, i) => `step-${i}`}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={ListFooter}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                    renderItem={({ item, index }) => (
                        <View style={styles.stepBox}>
                            <View style={styles.labelRow}>
                                <Text style={styles.stepLabel}>Step {index + 1}</Text>
                                {steps.length > 1 && (
                                    <TouchableOpacity onPress={() => {
                                        const filtered = steps.filter((_, i) => i !== index);
                                        setDraft({ steps: filtered });
                                    }}>
                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Input
                                multiline
                                placeholder="e.g. Boil water and add salt..."
                                value={item.instruction}
                                onChange={(v: any) => updateStep(index, v)}
                            />
                        </View>
                    )}
                />

                <View style={styles.footerNav}>
                    <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => mutate(draft as any)}
                        disabled={isPending}
                        style={[styles.publishBtn, isPending && { opacity: 0.7 }]}
                    >
                        {isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.publishText}>Publish Recipe</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20, paddingBottom: 100 },
    sectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 20, color: '#1e293b' },
    stepBox: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    stepLabel: { fontWeight: '700', color: '#475569' },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f97316',
        borderStyle: 'dashed'
    },
    footerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9'
    },
    backBtn: { justifyContent: 'center', paddingHorizontal: 25, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    backText: { color: '#64748b', fontWeight: '600' },
    publishBtn: { backgroundColor: '#f97316', paddingHorizontal: 35, paddingVertical: 16, borderRadius: 12, minWidth: 160, alignItems: 'center' },
    publishText: { color: '#fff', fontWeight: '800' }
});