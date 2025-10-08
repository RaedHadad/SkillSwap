import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useAuth } from '../auth/authprovider';

export default function ProfileScreen() {
  const { me, updateMe, logout } = useAuth();
  const [teach, setTeach] = useState('');
  const [learn, setLearn] = useState('');

  useEffect(() => {
    setTeach(me?.skillsTeach?.join(', ') || '');
    setLearn(me?.skillsLearn?.join(', ') || '');
  }, [me]);

  async function save() {
    const skillsTeach = teach.split(',').map(s=>s.trim()).filter(Boolean);
    const skillsLearn = learn.split(',').map(s=>s.trim()).filter(Boolean);
    try {
      await updateMe({ skillsTeach, skillsLearn });
      Alert.alert('Saved', 'Profile updated');
    } catch (e:any) {
      Alert.alert('Could not save', e.message || 'Check /me PUT');
    }
  }

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:'800' }}>Profile</Text>
      <Text>Name: {me?.name ?? '—'}</Text>
      <Text>Email: {me?.email ?? '—'}</Text>
      <View style={{ gap:6 }}>
        <Text style={{ fontWeight:'700' }}>Teaches</Text>
        <TextInput value={teach} onChangeText={setTeach} style={{ borderWidth:1, borderRadius:10, padding:10 }} />
      </View>
      <View style={{ gap:6 }}>
        <Text style={{ fontWeight:'700' }}>Wants to learn</Text>
        <TextInput value={learn} onChangeText={setLearn} style={{ borderWidth:1, borderRadius:10, padding:10 }} />
      </View>
      <Pressable onPress={save} style={{ backgroundColor:'#111827', padding:12, borderRadius:10, alignItems:'center' }}>
        <Text style={{ color:'white', fontWeight:'800' }}>Save</Text>
      </Pressable>
      <Pressable onPress={logout} style={{ padding:12, alignItems:'center' }}>
        <Text style={{ color:'#ef4444', fontWeight:'700' }}>Log out</Text>
      </Pressable>
    </View>
  );
}
