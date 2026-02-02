import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/src/service/authService";
import { registerSchema } from '@shared/validator/registerSchema'
import PasswordInput from "@/src/components/PasswordInput";
import Input from "@/src/components/Input";
import { useAuthStore } from "@/src/store/authStore";

const GENDERS = ["male", "female", "other"];
const COUNTRIES = [
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
];

const Register = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    phoneNumber: "",
    flag: "🇰🇪",
    countryCode: "+254",
    gender: "male",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [modalType, setModalType] = useState<"country" | "gender" | null>(null);
  const [localError, setLocalError] = useState<Record<string, string[]> | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Registration failed. Try again.";
      console.log(error)
      Alert.alert("Error", msg);
    },
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert("Wait!", "Your passwords don't match.");
      return;
    }

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      setLocalError(result.error.flatten().fieldErrors);
      return;
    }

    setLocalError(null);
    mutate(result.data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require("../../assets/images/recipeblog_icon.png")} style={styles.image} />

          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to continue</Text>

            <View style={styles.inputGroup}>
              <Input icon="person-outline" placeholder="First Name" value={form.firstName} onChange={(v: string) => updateField("firstName", v)} />
              {localError?.firstName && (
                <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{localError.firstName[0]}</Text>
              )}
              <Input icon="person-outline" placeholder="Middle Name (Optional)" value={form.middleName} onChange={(v: string) => updateField("middleName", v)} />
              {localError?.middleName && (
                <Text style={{ color: 'red', fontSize: 12 }}>{localError.middleName[0]}</Text>
              )}
              <Input icon="person-outline" placeholder="Surname" value={form.surname} onChange={(v: string) => updateField("surname", v)} />
              {localError?.surname && (
                <Text style={{ color: 'red', fontSize: 12 }}>{localError.surname[0]}</Text>
              )}
            </View>

            {/* INLINE PHONE & GENDER ROW */}
            <View style={styles.row}>
              <TouchableOpacity style={styles.selector} onPress={() => setModalType("country")}>
                <Text style={styles.selectorText}>{form.flag} {form.countryCode}</Text>
                <Ionicons name="chevron-down" size={12} color="#94a3b8" />
              </TouchableOpacity>

              <View style={styles.phoneInputContainer}>
                <Ionicons name="call-outline" size={18} color="#94a3b8" style={{ marginLeft: 4 }} />
                <TextInput
                  placeholder="712 345 678"
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  value={form.phoneNumber}
                  onChangeText={(v) => updateField("phoneNumber", v)}
                />
              </View>

            </View>
            {localError?.countryCode && (
              <Text style={{ color: 'red', fontSize: 12 }}>{localError.countryCode[0]}</Text>
            )}
            {localError?.phoneNumber && (
              <Text style={{ color: 'red', fontSize: 12 }}>{localError.phoneNumber[0]}</Text>
            )}

            <View style={styles.inputGroup}>
              <Input icon="mail-outline" placeholder="Email" value={form.email} onChange={(v: string) => updateField("email", v)} />
              {localError?.email && (
                <Text style={{ color: 'red', fontSize: 12 }}>{localError.email[0]}</Text>
              )}
              <PasswordInput icon="" placeholder="Password" value={form.password} onChange={(v: string) => updateField("password", v)} />
              {localError?.password && (
                <Text style={{ color: 'red', fontSize: 12 }}>{localError.password[0]}</Text>
              )}
              <PasswordInput icon="" placeholder="Confirm Password" value={form.confirmPassword} onChange={(v: string) => updateField("confirmPassword", v)} />
            </View>

            <TouchableOpacity
              style={[styles.button, isPending && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity><Text style={styles.link}>Login</Text></TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* SELECTION MODAL */}
      <Modal visible={!!modalType} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country </Text>

            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => {
                  setForm(f => ({ ...f, countryCode: item.code, flag: item.flag }));
                  setModalType(null);
                }}>
                  <Text style={styles.itemText}>{item.flag} {item.name} ({item.code})</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalType(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  inputGroup: {
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12
  },
  selector: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  selectorText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: '500'
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    width: 180
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 12,
    fontSize: 16,
    color: '#1e293b'
  },
  button: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  footerText: { color: "#64748b" },
  link: { color: "#f97316", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '60%'
  },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, color: '#1e293b' },
  item: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemText: { fontSize: 16, color: '#334155', fontWeight: '500' },
  cancelBtn: { marginTop: 10, alignItems: 'center', padding: 15 },
  cancelText: { color: '#ef4444', fontWeight: '700' }
});