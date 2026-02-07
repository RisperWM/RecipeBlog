import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Checkbox from 'expo-checkbox';

interface Ingredient {
	name: string;
	quantity: string | number;
	unit: string;
}

interface IngredientListProps {
	ingredients: Ingredient[];
	checkedIngredients: string[];
	onToggleIngredient: (name: string) => void;
}

export const IngredientItem = ({
	ingredients = [],
	checkedIngredients,
	onToggleIngredient
}: IngredientListProps) => {
	return (
		<View style={styles.container}>
			{ingredients.map((ing, idx) => {
				const isChecked = checkedIngredients.includes(ing.name);

				return (
					<View key={`${ing.name}-${idx}`} style={styles.ingredientItem}>
						<Checkbox
							value={isChecked}
							onValueChange={() => onToggleIngredient(ing.name)}
							color={isChecked ? "#f97316" : undefined}
							style={styles.checkbox}
						/>
						<Text style={[styles.ingredientText, isChecked && styles.textChecked]}>
							{ing.name}
						</Text>
						<Text style={styles.qtyText}>
							{ing.quantity} {ing.unit}
						</Text>
					</View>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 30
	},
	ingredientItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		gap: 10,
	},
	checkbox: {
		width: 20, 
		height: 20, 
		borderRadius: 4
	},
	ingredientText: {
		fontSize: 16, 
		color: "#334155", 
		flex: 1
	},
	qtyText: {
		fontSize: 14, 
		fontWeight: "700", 
		color: "#0f172a"
	},
	textChecked: {
		textDecorationLine: "line-through", 
		color: "#cbd5e1"
	},
});