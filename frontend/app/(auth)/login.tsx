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
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { loginSchema } from "@shared/validator/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/src/service/authService";
import { useAuthStore } from "@/src/store/authStore";
import { router } from "expo-router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});

    const setAuth = useAuthStore((s) => s.setAuth);

    const { mutate, isPending } = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuth(data.token, data.user);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Invalid credentials";
            setLocalError(message);
        },
    });

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
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
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
                        <View style={styles.inputWrapper}>
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
                        {errors.email && <Text style={styles.error}>{errors.email[0]}</Text>}

                        {/* PASSWORD */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                secureTextEntry={!showPassword}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#64748b"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.error}>{errors.password[0]}</Text>}

                        {/* FORGOT PASSWORD */}
                        <TouchableOpacity style={styles.forgotWrapper}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {localError && <Text style={styles.error}>{localError}</Text>}

                        {/* BUTTON */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isPending}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                {isPending ? "Signing in..." : "Sign In"}
                            </Text>
                        </TouchableOpacity>

                        {/* REGISTER */}
                        <View style={styles.registerRow}>
                            <Text style={{ color: "#64748b" }}>Don't have an account?</Text>
                            <TouchableOpacity onPress={ () => router.navigate('/register')}>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    imageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },

    image: {
        width: 120,
        height: 120,
        resizeMode: "contain",
    },

    card: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        elevation: 3,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
    },

    subtitle: {
        textAlign: "center",
        color: "#64748b",
        marginBottom: 20,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: "#f8fafc",
    },

    input: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
    },

    forgotWrapper: {
        alignItems: "flex-end",
        marginBottom: 10,
    },

    forgotText: {
        color: "#f97316",
        fontWeight: "500",
    },

    button: {
        backgroundColor: "#f97316",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },

    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 18,
    },

    registerText: {
        color: "#f97316",
        fontWeight: "600",
    },

    socialRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 25,
    },

    error: {
        color: "#ef4444",
        marginBottom: 8,
        fontSize: 13,
    },
});
