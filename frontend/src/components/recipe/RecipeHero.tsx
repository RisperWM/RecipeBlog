import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecipeHeroProps {
  name: string;
  averageRating: number | string;
  ratingCount: number;
  onRatePress: () => void;
}

const RecipeHero = ({
  name,
  averageRating,
  ratingCount,
  onRatePress
}: RecipeHeroProps) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.title} numberOfLines={2}>
        {name}
      </Text>

      <TouchableOpacity
        style={styles.ratingRow}
        onPress={onRatePress}
        activeOpacity={0.7}
      >
        <Ionicons name="star" size={16} color="#f59e0b" />
        <Text style={styles.ratingValue}>
          {typeof averageRating === 'number' ? averageRating.toFixed(1) : (averageRating || "0.0")}
        </Text>
        <Text style={styles.ratingCount}>
          ({ratingCount || 0} reviews) • Rate
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecipeHero;

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 30,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  ratingCount: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
});