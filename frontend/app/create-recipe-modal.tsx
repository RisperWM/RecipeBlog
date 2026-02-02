import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import BasicInfo from '@/src/components/recipe/BasicInfo'
import Steps from '@/src/components/recipe/Steps'
import Ingredients from '@/src/components/recipe/Ingredients'

const CreateRecipeModal = () => {
    const [step, setStep] = useState(1)
    const router = useRouter()

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                {[1, 2, 3].map((s) => (
                    <View key={s} style={[styles.progressDot, step >= s && styles.activeDot]}></View>
                ))}
            </View>
            <View style={styles.formContainer}>
                {step === 1 && <BasicInfo onNext={nextStep} />}
                {step === 2 && <Ingredients onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <Steps onBack={prevStep} />}
            </View>
        </SafeAreaView>
    )
}

export default CreateRecipeModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20
    },
    progressDot: {
        height: 6,
        width: 40,
        backgroundColor: "#e2e8f0",
        borderRadius: 3,
        marginHorizontal: 4
    },
    activeDot: {
        backgroundColor: "#f97316"
    },
    formContainer: {
        flex: 1
    }
})