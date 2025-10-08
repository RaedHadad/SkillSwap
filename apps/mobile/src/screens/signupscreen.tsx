import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../auth/authprovider';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen({ navigation }: any) {
  const { register } = useAuth();

  const [name, setName] = useState('Raed');
  const [email, setEmail] = useState('raed@example.com');
  const [password, setPassword] = useState('pass');
  const [confirm, setConfirm] = useState('pass');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(true);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = '6+ characters recommended';
    if (password !== confirm) e.confirm = "Passwords don't match";
    if (!accepted) e.accepted = 'Accept the terms to continue';
    return e;
  }, [name, email, password, confirm, accepted]);

  const canSubmit = Object.keys(errors).length === 0 && !busy;

  async function onSubmit() {
    try {
      setBusy(true);
      await register(name.trim(), email.trim(), password);
      // navigation.replace('Dashboard') happens inside your auth flow
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Please try again');
    } finally {
      setBusy(false);
    }
  }

  return (
    <LinearGradient
      colors={['#0ea5e9', '#6366f1']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
            {/* Logo / Title */}
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  width: 64, height: 64, borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center', alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 22 }}>
                  SS
                </Text>
              </View>
              <Text style={{ color: 'white', fontSize: 30, fontWeight: '800', marginTop: 12 }}>
                Create your account
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                Learn, teach, and swap skills.
              </Text>
            </View>

            {/* Card */}
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
                elevation: 3,
                gap: 12,
              }}
            >
              {/* Name */}
              <Field
                label="Full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                error={errors.name}
              />

              {/* Email */}
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                error={errors.email}
              />

              {/* Password */}
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                autoComplete="password-new"
                right={
                  <Pressable onPress={() => setShowPw(s => !s)} style={{ padding: 8 }}>
                    <Text style={{ color: '#2563eb', fontWeight: '600' }}>
                      {showPw ? 'Hide' : 'Show'}
                    </Text>
                  </Pressable>
                }
                error={errors.password}
              />

              {/* Confirm */}
              <Field
                label="Confirm password"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showPw}
                autoComplete="password-new"
                error={errors.confirm}
              />

              {/* Terms */}
              <Pressable onPress={() => setAccepted(a => !a)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <View
                  style={{
                    width: 20, height: 20, borderRadius: 6,
                    borderWidth: 2, borderColor: accepted ? '#22c55e' : '#cbd5e1',
                    backgroundColor: accepted ? '#22c55e' : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {accepted ? <Text style={{ color: 'white', fontWeight: '800' }}>✓</Text> : null}
                </View>
                <Text style={{ color: '#334155' }}>
                  I agree to the <Text style={{ color: '#2563eb', fontWeight: '600' }}>Terms</Text> and <Text style={{ color: '#2563eb', fontWeight: '600' }}>Privacy</Text>.
                </Text>
              </Pressable>
              {errors.accepted ? <ErrorText text={errors.accepted} /> : null}

              {/* Submit */}
              <Pressable
                onPress={onSubmit}
                disabled={!canSubmit}
                style={({ pressed }) => ({
                  marginTop: 6,
                  backgroundColor: canSubmit ? '#111827' : '#cbd5e1',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                {busy ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Create account</Text>
                )}
              </Pressable>

              {/* Switch to login */}
              <View style={{ alignItems: 'center', marginTop: 6 }}>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={{ color: '#2563eb', fontWeight: '600' }}>Already have an account? Sign in</Text>
                </Pressable>
              </View>
            </View>

            {/* Footer blurb */}
            <View style={{ alignItems: 'center', marginTop: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                By continuing, you agree to our Terms and Privacy Policy.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/** ---------- Reusable Field component (keeps the page tidy) ---------- */
function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?:
    | 'name' | 'email' | 'password' | 'password-new'
    | 'username' | 'off' | 'one-time-code';
  keyboardType?:
    | 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  right?: React.ReactNode;
  error?: string;
}) {
  const {
    label, value, onChangeText, secureTextEntry,
    autoCapitalize, autoComplete, keyboardType, right, error,
  } = props;

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: '#0f172a', fontWeight: '700' }}>{label}</Text>
      <View
        style={{
          borderWidth: 1.5,
          borderColor: error ? '#ef4444' : '#e5e7eb',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          keyboardType={keyboardType}
          placeholder={label}
          style={{ flex: 1, paddingVertical: 12, fontSize: 16 }}
        />
        {right}
      </View>
      {error ? <ErrorText text={error} /> : null}
    </View>
  );
}

function ErrorText({ text }: { text: string }) {
  return <Text style={{ color: '#ef4444' }}>{text}</Text>;
}
