import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (stars: number) => void;
  isSubmitting: boolean;
}

const RatingModal = ({ visible, onClose, onSubmit, isSubmitting }: RatingModalProps) => {
  const [localStars, setLocalStars] = useState(0);

  useEffect(() => {
    if (!visible) {
      setLocalStars(0);
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* Prevent clicks inside the content from closing the modal */}
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>Rate this Recipe</Text>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setLocalStars(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= localStars ? "star" : "star-outline"}
                  size={40}
                  color="#f59e0b"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (localStars === 0 || isSubmitting) && styles.disabledBtn,
              ]}
              disabled={localStars === 0 || isSubmitting}
              onPress={() => onSubmit(localStars)}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20
  },
  starRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%"
  },
  cancelBtn: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 15
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#f97316",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  disabledBtn: {
    backgroundColor: "#cbd5e1",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15
  },
});