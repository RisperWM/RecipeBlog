import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
    Platform,
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
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
    const flatListRef = useRef<any>(null);

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

    const addItem = () => {
        const newItem = createEmptyIngredient();
        setLocalIngredients(prev => [...prev, newItem]);

        // Use scrollToIndex for guaranteed bottom placement
        // Timeout ensures the state update has finished rendering
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: localIngredients.length, // This is the index of the new item
                    animated: true,
                    viewPosition: 1, // 1 = Bottom of the list
                });
            }
        }, 150);
    };

    const updateLocalItem = (tempId: string, field: keyof Ingredient, value: string) => {
        setLocalIngredients(prev =>
            prev.map(item => {
                if (item.tempId !== tempId) return item;
                if (field === 'quantity') {
                    const cleaned = value.replace(/[^0-9.]/g, '');
                    return { ...item, quantity: cleaned === '' ? 0 : parseFloat(cleaned) };
                }
                return { ...item, [field]: value };
            })
        );
    };

    const removeItem = (tempId: string) => {
        if (localIngredients.length > 1) {
            setLocalIngredients(prev => prev.filter(item => item.tempId !== tempId));
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareFlatList
                innerRef={ref => { flatListRef.current = ref; }}
                data={localIngredients}
                keyExtractor={(item) => item.tempId}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 160 : 120}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.listContainer}

                // Prevents scrollToIndex from crashing if item isn't measured yet
                onScrollToIndexFailed={(info) => {
                    flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                }}

                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <Text style={styles.subtitle}>List items and measurements</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.cardRow}>
                        <View style={styles.nameCol}>
                            <Input
                                placeholder="Item name"
                                value={item.name}
                                onChange={(v: string) => updateLocalItem(item.tempId, 'name', v)}
                                blurOnSubmit={false}
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
                        <TouchableOpacity
                            style={styles.unitCol}
                            onPress={() => setActivePickerIndex(localIngredients.findIndex(i => i.tempId === item.tempId))}
                        >
                            <Text style={styles.unitText} numberOfLines={1}>{item.unit}</Text>
                            <Ionicons name="chevron-down" size={12} color="#94a3b8" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeItem(item.tempId)} style={styles.deleteCol}>
                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => (
                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Ionicons name="add" size={20} color="#f97316" />
                        <Text style={styles.addText}>Add Ingredient</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.navigationFooter}>
                <View style={styles.navRow}>
                    <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                        <Text style={styles.backLabel}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
                        <Text style={styles.nextLabel}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={activePickerIndex !== null} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setActivePickerIndex(null)}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {RECIPE_UNITS.map((unit, i) => (
                                <TouchableOpacity
                                    key={`unit-${unit}-${i}`}
                                    style={styles.unitOption}
                                    onPress={() => {
                                        if (activePickerIndex !== null) {
                                            updateLocalItem(localIngredients[activePickerIndex].tempId, 'unit', unit);
                                        }
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { paddingHorizontal: 20, paddingVertical: 15 },
    sectionTitle: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
    subtitle: { fontSize: 14, color: '#64748b', marginBottom: 5 },
    listContainer: { paddingBottom: 60 },
    cardRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8, width: '100%' },
    nameCol: { flex: 1 },
    qtyCol: { width: 60, marginLeft: 8 },
    unitCol: {
        width: 75, marginLeft: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 8, height: 42,bottom:5
    },
    deleteCol: { width: 35, alignItems: 'flex-end', marginLeft: 4, bottom: 5 },
    unitText: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginVertical: 15, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#f97316', borderStyle: 'dashed' },
    addText: { color: '#f97316', fontWeight: '700' },
    navigationFooter: { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 40 : 25, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: { padding: 10 },
    backLabel: { color: '#64748b', fontWeight: '600' },
    nextBtn: { backgroundColor: '#f97316', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 12 },
    nextLabel: { color: '#fff', fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', width: '75%', borderRadius: 15, paddingVertical: 10, maxHeight: '50%' },
    unitOption: { padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
    optionText: { textAlign: 'center', fontSize: 16 }
});

export default Ingredients;