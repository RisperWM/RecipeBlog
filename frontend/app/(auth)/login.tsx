import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Ionicons, FontAwesome, Entypo } from "@expo/vector-icons";

// Logic & Validation
import { loginSchema } from "@shared/validator/loginSchema";
import { authService } from "@/src/service/authService";
import { useAuthStore } from "@/src/store/authStore";

const Login = () => {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    // State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});

    // --- MUTATION ---
    const { mutate, isPending } = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuth(data.token, data.user);
            // Redirection is usually handled by a Root Layout observer on the token,
            // but you can also manually navigate here if needed.
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Invalid credentials";
            setLocalError(message);
        },
    });

    // --- HANDLERS ---
    const handleLogin = () => {
        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        setErrors({});
        setLocalError(null);
        mutate(result.data);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. HIDE HEADER: Using Stack.Screen inside the component ensures the header is hidden */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* 2. KEYBOARD HANDLING: Use 'padding' for iOS and 'height' or undefined for Android */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flexOne}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* LOGO */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../../assets/images/recipeblog_icon.png")}
                            style={styles.image}
                        />
                    </View>

                    {/* FORM CARD */}
                    <View style={styles.card}>
                        <Text style={styles.title}>Welcome Back 👋</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>

                        {/* EMAIL */}
                        <View style={[styles.inputWrapper, errors.email && styles.inputErrorBorder]}>
                            <Ionicons name="mail-outline" size={20} color="#64748b" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}

                        {/* PASSWORD */}
                        <View style={[styles.inputWrapper, errors.password && styles.inputErrorBorder]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                // 3. EYE TOGGLE FIX: secureTextEntry must react to showPassword state
                                secureTextEntry={!showPassword}
                                style={styles.input}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#64748b"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}

                        {/* FORGOT PASSWORD */}
                        <TouchableOpacity style={styles.forgotWrapper}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {localError && <Text style={styles.serverError}>{localError}</Text>}

                        {/* BUTTON */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isPending}
                            style={[styles.button, isPending && styles.buttonDisabled]}
                        >
                            {isPending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        {/* REGISTER */}
                        <View style={styles.registerRow}>
                            <Text style={{ color: "#64748b" }}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text style={styles.registerText}> Register</Text>
                            </TouchableOpacity>
                        </View>

                        {/* SOCIALS */}
                        <View style={styles.socialRow}>
                            <FontAwesome name="google" size={22} color="#db4437" />
                            <Entypo name="facebook-with-circle" size={24} color="#1877f2" />
                            <Entypo name="instagram-with-circle" size={24} color="#e1306c" />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    flexOne: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    card: {
        backgroundColor: "#f8fafc",
        padding: 24,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        textAlign: "center",
        color: "#1e293b",
    },
    subtitle: {
        textAlign: "center",
        color: "#64748b",
        marginBottom: 24,
        fontSize: 15,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#f1f5f9",
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 4,
        height: 56,
    },
    inputErrorBorder: {
        borderColor: "#fee2e2",
        backgroundColor: "#fffafb",
    },
    input: {
        flex: 1,
        height: "100%",
        marginLeft: 12,
        fontSize: 15,
        color: "#1e293b",
    },
    forgotWrapper: {
        alignItems: "flex-end",
        marginTop: 8,
        marginBottom: 16,
    },
    forgotText: {
        color: "#f97316",
        fontWeight: "600",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#f97316",
        height: 56,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: "#f97316",
        fontWeight: "700",
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        paddingTop: 20,
    },
    errorText: {
        color: "#ef4444",
        marginBottom: 12,
        fontSize: 12,
        marginLeft: 4,
    },
    serverError: {
        color: "#ef4444",
        textAlign: "center",
        marginBottom: 16,
        fontSize: 14,
        fontWeight: "500",
    },
});