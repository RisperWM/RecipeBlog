import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

const Input = ({ icon, placeholder, value, onChange, multiline = false, keyboard = "default", ...props }: any) => (
    <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="#64748b" />
        <TextInput
            {...props}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboard}
            style={styles.input}
            multiline={multiline}
        />
    </View>
);


export default Input

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 10,
        paddingHorizontal: 5,
        marginBottom: 10,
        backgroundColor: "#f8fafc",
    },

    input: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
    },
})