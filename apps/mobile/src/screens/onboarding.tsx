import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useAuth } from '../auth/authprovider';

export default function OnboardingScreen() {
  const { updateMe } = useAuth();
  const [teach, setTeach] = useState('Python, Guitar');
  const [learn, setLearn] = useState('English, React');

  async function save() {
    try {
      const skillsTeach = teach.split(',').map(s=>s.trim()).filter(Boolean);
      const skillsLearn = learn.split(',').map(s=>s.trim()).filter(Boolean);
      await updateMe({ skillsTeach, skillsLearn });
      Alert.alert('Saved', 'Welcome to SkillSwap!');
    } catch (e:any) {
      Alert.alert('Could not save', e.message || 'Check API /me PUT');
    }
  }

  return (
    <View style={{ flex:1, padding:24, justifyContent:'center', gap:16 }}>
      <Text style={{ fontSize:28, fontWeight:'800' }}>Tell us your skills</Text>
      <View style={{ gap:8 }}>
        <Text style={{ fontWeight:'700' }}>I can teach</Text>
        <TextInput value={teach} onChangeText={setTeach} placeholder="e.g. Python, Guitar"
          style={{ borderWidth:1, borderRadius:10, padding:12 }} />
      </View>
      <View style={{ gap:8 }}>
        <Text style={{ fontWeight:'700' }}>I want to learn</Text>
        <TextInput value={learn} onChangeText={setLearn} placeholder="e.g. English, React"
          style={{ borderWidth:1, borderRadius:10, padding:12 }} />
      </View>
      <Pressable onPress={save}
        style={({pressed})=>({ backgroundColor:'#111827', padding:14, borderRadius:12, alignItems:'center', opacity:pressed?0.9:1 })}>
        <Text style={{ color:'white', fontWeight:'800' }}>Continue</Text>
      </Pressable>
    </View>
  );
}
