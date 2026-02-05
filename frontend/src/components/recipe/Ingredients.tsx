import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeStore } from '@/src/store/recipeStore';
import Input from '../Input';
import { RECIPE_UNITS, RecipeUnit } from '@shared/constants/recipeUnit';

interface Ingredient {
    tempId: string;
    name: string;
    quantity: number;
    unit: RecipeUnit;
}

const createEmptyIngredient = (): Ingredient => ({
    tempId: Date.now().toString() + Math.random().toString(36),
    name: '',
    quantity: 0,
    unit: 'g',
});

const Ingredients = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
    const { draft, setDraft } = useRecipeStore();
    const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);

    const [localIngredients, setLocalIngredients] = useState<Ingredient[]>(() => {
        if (draft.ingredients && draft.ingredients.length > 0) {
            return draft.ingredients.map((ing: any) => ({
                ...ing,
                tempId: ing.tempId || Date.now().toString() + Math.random().toString(36)
            }));
        }
        return [createEmptyIngredient()];
    });

    useEffect(() => {
        const id = setTimeout(() => {
            setDraft({ ingredients: localIngredients });
        }, 300);
        return () => clearTimeout(id);
    }, [localIngredients]);

    const handleNext = () => {
        setDraft({ ingredients: localIngredients });
        onNext();
    };

    const updateLocalItem = (tempId: string, field: keyof Ingredient, value: string) => {
        setLocalIngredients(prev =>
            prev.map(item => {
                if (item.tempId !== tempId) return item;
                if (field === 'quantity') {
                    const cleaned = value.replace(/[^0-9.]/g, '');
                    return { ...item, quantity: cleaned === '' ? 0 : parseFloat(cleaned) };
                }
                if (field === 'unit') return { ...item, unit: value as RecipeUnit };
                return { ...item, name: value };
            })
        );
    };

    const addItem = () => setLocalIngredients(prev => [...prev, createEmptyIngredient()]);
    const removeItem = (tempId: string) => {
        if (localIngredients.length > 1) {
            setLocalIngredients(prev => prev.filter(item => item.tempId !== tempId));
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={localIngredients}
                    keyExtractor={(item) => item.tempId}
                    ListHeaderComponent={() => (
                        <View style={styles.header}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <Text style={styles.subtitle}>List items and measurements</Text>
                        </View>
                    )}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item, index }) => (
                        <View style={styles.cardRow}>
                            <View style={styles.nameCol}>
                                <Input
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(v: string) => updateLocalItem(item.tempId, 'name', v)}
                                />
                            </View>
                            <View style={styles.qtyCol}>
                                <Input
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={item.quantity === 0 ? '' : item.quantity.toString()}
                                    onChange={(v: string) => updateLocalItem(item.tempId, 'quantity', v)}
                                />
                            </View>
                            <TouchableOpacity style={styles.unitCol} onPress={() => setActivePickerIndex(index)}>
                                <Text style={styles.unitText} numberOfLines={1}>{item.unit}</Text>
                                <Ionicons name="chevron-down" size={12} color="#94a3b8" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeItem(item.tempId)} style={styles.deleteCol}>
                                <Ionicons name="trash-outline" size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <Modal visible={activePickerIndex !== null} transparent animationType="fade">
                    <Pressable style={styles.modalOverlay} onPress={() => setActivePickerIndex(null)}>
                        <View style={styles.modalContent}>
                            <ScrollView>
                                {RECIPE_UNITS.map((unit, i) => (
                                    <TouchableOpacity
                                        key={`unit-${unit}-${i}`}
                                        style={styles.unitOption}
                                        onPress={() => {
                                            updateLocalItem(localIngredients[activePickerIndex!].tempId, 'unit', unit);
                                            setActivePickerIndex(null);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{unit}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Ionicons name="add" size={20} color="#f97316" />
                        <Text style={styles.addText}>Add Ingredient</Text>
                    </TouchableOpacity>
                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backLabel}>Back</Text></TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}><Text style={styles.nextLabel}>Next</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Ingredients;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { paddingHorizontal: 20, paddingVertical: 15 },
    sectionTitle: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
    subtitle: { fontSize: 14, color: '#64748b', marginBottom: 5 },
    listContainer: { paddingBottom: 180 },
    cardRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8, width: '100%' },
    nameCol: { flex: 1 },
    qtyCol: { width: 60, marginLeft: 8 },
    unitCol: {
        width: 75, marginLeft: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 8, height: 40,
    },
    deleteCol: { width: 35, alignItems: 'flex-end', marginLeft: 4 },
    unitText: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, paddingBottom: 35, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f97316', borderStyle: 'dashed' },
    addText: { color: '#f97316', fontWeight: '700' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: { padding: 10 },
    backLabel: { color: '#64748b', fontWeight: '600' },
    nextBtn: { backgroundColor: '#f97316', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 12 },
    nextLabel: { color: '#fff', fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', width: '75%', borderRadius: 15, paddingVertical: 10, maxHeight: '50%' },
    unitOption: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
    optionText: { textAlign: 'center', fontSize: 16 }
});