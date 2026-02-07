import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export type RecipeTab = 'Ingredients' | 'Instructions';

interface RecipeTabsProps {
    activeTab: RecipeTab;
    onTabChange: (tab: RecipeTab) => void;
}

/**
 * RecipeTabs Component
 * A controlled switcher to toggle between Ingredients and Instructions.
 */
const RecipeTabs = ({ activeTab, onTabChange }: RecipeTabsProps) => {
    const tabs: RecipeTab[] = ["Ingredients", "Instructions"];

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;

                return (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => onTabChange(tab)}
                        style={[styles.tab, isActive && styles.activeTab]}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                isActive && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default RecipeTabs;

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderRadius: 25,
        marginBottom: 20,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 22,
    },
    activeTab: {
        backgroundColor: "#f97316", 
        shadowColor: "#f97316",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#64748b",
    },
    activeTabText: {
        color: "#fff",
    },
});