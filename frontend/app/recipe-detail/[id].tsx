import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, ActivityIndicator,
  TouchableOpacity, Dimensions, Alert, TextInput, Modal, Pressable,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/src/service/recipeService';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useAuthStore } from '@/src/store/authStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const user = useAuthStore((state) => state.user);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // UI State
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions'>('Ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);

  // --- 1. DATA FETCHING ---
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id, user?.id],
    queryFn: () => recipeService.fetchRecipeById(id as string),
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => recipeService.fetchComments(id as string),
    enabled: !!id,
  });

  const isCurrentlyLiked = !!(recipe as any)?.isLiked;

  // --- 2. HEADER SYNCHRONIZATION ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/create-recipe-modal',
              params: { initialData: JSON.stringify(recipe) }
            })}
            style={styles.headerIconButton}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike()} style={styles.headerIconButton}>
            <Ionicons
              name={isCurrentlyLiked ? "heart" : "heart-outline"}
              size={20}
              color={isCurrentlyLiked ? "#ef4444" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isCurrentlyLiked, recipe]);

  // --- 3. MUTATIONS ---
  const { mutate: handleLike } = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error("Please log in to like recipes.");
      return recipeService.toggleLike(id as string, user.id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['recipe', id, user?.id] });
      const previousRecipe = queryClient.getQueryData(['recipe', id, user?.id]);
      queryClient.setQueryData(['recipe', id, user?.id], (old: any) => {
        if (!old) return old;
        const currentStatus = !!old.isLiked;
        return {
          ...old,
          isLiked: !currentStatus,
          likesCount: !currentStatus ? (Number(old.likesCount) || 0) + 1 : Math.max(0, (Number(old.likesCount) || 1) - 1)
        };
      });
      return { previousRecipe };
    },
    onError: (err: any, __, context) => {
      queryClient.setQueryData(['recipe', id, user?.id], context?.previousRecipe);
      Alert.alert("Action Failed", err.message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['recipe', id, user?.id] }),
  });

  const { mutate: submitRating, isPending: isSubmittingRating } = useMutation({
    mutationFn: (score: number) => recipeService.addRating(id!, user?.id || '', score),
    onSuccess: (data) => {
      queryClient.setQueryData(['recipe', id, user?.id], (old: any) => ({
        ...old,
        averageRating: data.averageRating,
        ratingCount: data.ratingCount
      }));
      setRatingModalVisible(false);
      setSelectedStars(0);
      Alert.alert("Success", "Thanks for your feedback!");
    },
    onError: (err: any) => Alert.alert("Error", err.message),
  });

  const { mutate: submitComment, isPending: isSubmittingComment } = useMutation({
    mutationFn: () => recipeService.addComment({ recipeId: id!, userId: user?.id || '', text: newComment }),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
    onError: (err: any) => Alert.alert("Error", err.message),
  });

  const toggleIngredient = (name: string) => {
    setCheckedIngredients(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#f97316" /></View>;
  if (error || !recipe) return <View style={styles.centered}><Text style={styles.errorText}>Recipe not found.</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.container}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />

          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.title}>{recipe.name}</Text>
              <TouchableOpacity style={styles.ratingRow} onPress={() => setRatingModalVisible(true)}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.ratingValue}>{(recipe as any).averageRating || '0.0'}</Text>
                <Text style={styles.ratingCount}>({(recipe as any).ratingCount || 0} reviews) • Rate</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              <MetaBox icon="time-outline" label="Total" value={`${(recipe.prepTime || 0) + (recipe.cookTime || 0)}m`} />
              <View style={styles.metaDivider} />
              <MetaBox icon="people-outline" label="Servings" value={`${recipe.servings || 1}`} />
              <View style={styles.metaDivider} />
              <MetaBox icon="flame-outline" label="Category" value={recipe.category} />
            </View>

            <View style={styles.tabContainer}>
              {['Ingredients', 'Instructions'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab as any)}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.detailsContainer}>
              {activeTab === 'Ingredients' ? (
                recipe.ingredients?.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientItem}>
                    <Checkbox
                      value={checkedIngredients.includes(ing.name)}
                      onValueChange={() => toggleIngredient(ing.name)}
                      color={checkedIngredients.includes(ing.name) ? '#f97316' : undefined}
                      style={styles.checkbox}
                    />
                    <Text style={[styles.ingredientText, checkedIngredients.includes(ing.name) && styles.textChecked]}>{ing.name}</Text>
                    <Text style={styles.qtyText}>{ing.quantity} {ing.unit}</Text>
                  </View>
                ))
              ) : (
                recipe.steps?.map((step, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <Text style={styles.stepNumber}>STEP {idx + 1}</Text>
                    <Text style={styles.stepText}>{step.instruction}</Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
              {comments.map((comment: any) => (
                <View key={comment._id} style={styles.commentBubble}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.userId?.firstName} {comment.userId?.surname}</Text>
                    <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* STICKY INPUT FOOTER */}
        <SafeAreaView style={styles.stickyInputWrapper}>
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              onPress={() => submitComment()}
              disabled={!newComment.trim() || isSubmittingComment}
              style={[styles.sendBtn, !newComment.trim() && styles.disabledBtn]}
            >
              {isSubmittingComment ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* RATING MODAL */}
      <Modal animationType="fade" transparent visible={ratingModalVisible} onRequestClose={() => setRatingModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRatingModalVisible(false)}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate this Recipe</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setSelectedStars(star)}>
                  <Ionicons name={star <= selectedStars ? "star" : "star-outline"} size={40} color="#f59e0b" />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setRatingModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, selectedStars === 0 && styles.disabledBtn]}
                disabled={selectedStars === 0 || isSubmittingRating}
                onPress={() => submitRating(selectedStars)}
              >
                {isSubmittingRating ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit</Text>}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const MetaBox = ({ icon, label, value }: any) => (
  <View style={styles.metaBox}>
    <Ionicons name={icon} size={18} color="#f97316" />
    <View><Text style={styles.metaLabel}>{label}</Text><Text style={styles.metaValue}>{value}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#64748b', fontSize: 16 },
  heroImage: { width: '100%', height: SCREEN_HEIGHT * 0.35 },
  headerRightContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 15 },
  headerIconButton: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
  content: { padding: 20, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, backgroundColor: '#fff', minHeight: SCREEN_HEIGHT * 0.7 },
  headerSection: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingValue: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  ratingCount: { fontSize: 12, color: '#64748b' },
  metaRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 16, padding: 15, marginBottom: 20, justifyContent: 'space-between', borderWidth: 1, borderColor: '#f1f5f9' },
  metaBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaDivider: { width: 1, height: 25, backgroundColor: '#e2e8f0' },
  metaLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  metaValue: { fontSize: 12, color: '#1e293b', fontWeight: '700' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 25, marginBottom: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 22 },
  activeTab: { backgroundColor: "#f97316" },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  activeTabText: { color: '#fff' },
  detailsContainer: { marginBottom: 30 },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4 },
  ingredientText: { fontSize: 16, color: '#334155', flex: 1 },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  textChecked: { textDecorationLine: 'line-through', color: '#cbd5e1' },
  stepItem: { marginBottom: 20 },
  stepNumber: { fontSize: 11, fontWeight: '900', color: '#f97316', marginBottom: 4 },
  stepText: { fontSize: 16, color: '#334155', lineHeight: 24 },
  commentSection: { borderTopWidth: 1, borderColor: '#f1f5f9', paddingTop: 25, paddingBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 15 },

  // NEW STICKY INPUT STYLES
  stickyInputWrapper: { borderTopWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 10 },
  commentInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: Platform.OS === 'android' ? 10 : 0 },
  input: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0', maxHeight: 100, fontSize: 15 },
  sendBtn: { backgroundColor: '#f97316', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: '#cbd5e1' },

  commentBubble: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 16, marginBottom: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentUser: { fontWeight: '700', fontSize: 14, color: '#1e293b' },
  commentDate: { fontSize: 11, color: '#94a3b8' },
  commentText: { color: '#475569', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 25, width: '90%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  starRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
  cancelBtnText: { color: '#64748b', fontWeight: '700' },
  submitBtn: { flex: 1, backgroundColor: '#f97316', padding: 15, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '800' }
});