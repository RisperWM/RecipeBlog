import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Pressable,
    Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRecipeStore } from '@/src/store/recipeStore';
import Input from '../Input';
import { CUISINES } from '@shared/constants/cuisine';
import { MEAL_CATEGORIES } from '@shared/constants/mealCategory';
import { Ionicons } from '@expo/vector-icons';

const BasicInfo = ({ onNext }: { onNext: () => void }) => {
    const { draft, setDraft } = useRecipeStore();
    const [activePicker, setActivePicker] = useState<'cuisine' | 'category' | null>(null);

    const handleUpdate = (field: string, value: any) => {
        let processedValue = value;
        if (['prepTime', 'cookTime', 'servings'].includes(field)) {
            processedValue = value === '' ? '' : (parseInt(value) || 0);
        }
        setDraft({ [field]: processedValue });
    };

    const renderPicker = (type: 'cuisine' | 'category', data: readonly string[]) => (
        <Modal visible={activePicker === type} transparent animationType="slide">
            <Pressable style={styles.modalOverlay} onPress={() => setActivePicker(null)}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select {type === 'cuisine' ? 'Cuisine' : 'Category'}</Text>
                    </View>
                    <KeyboardAwareScrollView>
                        {data.map((item, index) => (
                            <TouchableOpacity
                                key={`${type}-${item}-${index}`}
                                style={styles.optionItem}
                                onPress={() => {
                                    handleUpdate(type === 'cuisine' ? 'cuisine' : 'category', item);
                                    setActivePicker(null);
                                }}
                            >
                                <Text style={styles.optionText}>{item}</Text>
                                {draft[type === 'cuisine' ? 'cuisine' : 'category'] === item && (
                                    <Ionicons name="checkmark" size={20} color="#f97316" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </KeyboardAwareScrollView>
                </View>
            </Pressable>
        </Modal>
    );

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            // Important: extraHeight provides the "push" needed to keep bottom fields visible
            extraHeight={150}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            keyboardShouldPersistTaps="handled"
            // paddingBottom must be large enough to allow the scrollview to actually move up
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <Text style={styles.sectionTitle}>{draft._id ? 'Edit Recipe' : 'Basic Details'}</Text>

            <Text style={styles.label}>Recipe Name</Text>
            <Input
                placeholder="e.g. Grandma's Special Pasta"
                value={draft.name || ''}
                onChange={(v: string) => handleUpdate('name', v)}
            />

            <Text style={styles.label}>Image URL</Text>
            <Input
                placeholder="https://example.com/food.jpg"
                value={draft.imageUrl || ''}
                onChange={(v: string) => handleUpdate('imageUrl', v)}
            />

            <Text style={styles.label}>Description</Text>
            <Input
                placeholder="Briefly describe your delicious dish..."
                multiline={true}
                value={draft.description || ''}
                onChange={(v: string) => handleUpdate('description', v)}
                // Fixes issues where multiline inputs get buried
                scrollEnabled={false}
            />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Category</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => setActivePicker('category')}>
                        <Text style={styles.pickerValue}>{draft.category || 'Select'}</Text>
                        <Ionicons name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.label}>Cuisine</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => setActivePicker('cuisine')}>
                        <Text style={styles.pickerValue}>{draft.cuisine || 'Select'}</Text>
                        <Ionicons name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Prep (min)</Text>
                    <Input
                        keyboardType="numeric"
                        placeholder="15"
                        value={draft.prepTime?.toString() || ''}
                        onChange={(v: string) => handleUpdate('prepTime', v)}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.label}>Cook (min)</Text>
                    <Input
                        keyboardType="numeric"
                        placeholder="20"
                        value={draft.cookTime?.toString() || ''}
                        onChange={(v: string) => handleUpdate('cookTime', v)}
                    />
                </View>
            </View>

            <View style={{ width: '48%' }}>
                <Text style={styles.label}>Servings (plates)</Text>
                <Input
                    keyboardType="numeric"
                    placeholder="2"
                    value={draft.servings?.toString() || ''}
                    onChange={(v: string) => handleUpdate('servings', v)}
                />
            </View>

            {renderPicker('category', MEAL_CATEGORIES)}
            {renderPicker('cuisine', CUISINES)}

            <TouchableOpacity style={styles.mainButton} onPress={onNext}>
                <Text style={styles.buttonText}>Next: Ingredients</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    );
};

export default BasicInfo;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    sectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 20, color: '#1e293b' },
    label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 6, marginTop: 12 },
    row: { flexDirection: 'row', marginBottom: 5 },
    pickerTrigger: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10,
        paddingHorizontal: 12, height: 48,
    },
    pickerValue: { fontSize: 14, color: '#1e293b', fontWeight: '500' },
    mainButton: { backgroundColor: '#f97316', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 30 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', paddingBottom: 40 },
    modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    modalTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
    optionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
    optionText: { fontSize: 16, color: '#334155' }
});