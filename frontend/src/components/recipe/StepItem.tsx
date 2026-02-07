import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Step {
  instruction: string;
}

interface StepListProps {
  steps: Step[];
}

export const StepItem = ({ steps = [] }: StepListProps) => {
  return (
    <View style={styles.container}>
      {steps.map((step, idx) => (
        <View key={idx} style={styles.stepItem}>
          <Text style={styles.stepNumber}>STEP {idx + 1}</Text>
          <Text style={styles.stepText}>{step.instruction}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30
  },
  stepItem: {
    marginBottom: 20
  },
  stepNumber: {
    fontSize: 11, 
    fontWeight: "900", 
    color: "#f97316", 
    marginBottom: 4
  },
  stepText: {
    fontSize: 16, 
    color: "#334155", 
    lineHeight: 24
  },
});