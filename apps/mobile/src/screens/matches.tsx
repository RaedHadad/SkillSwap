import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { api } from '../api/client';
import type { MatchResult } from '../types';

export default function MatchesScreen() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<MatchResult[]>([]);
  const [busy, setBusy] = useState(false);

  async function search() {
    try {
      setBusy(true);
      const data = await api('/match/search', { method:'POST', body: JSON.stringify({ learnSkill: query }) });
      setItems(data);
    } catch (e:any) {
      Alert.alert('Search failed', e.message || 'Create /match/search on the API');
    } finally { setBusy(false); }
  }

  function requestSession(userId: string) {
    Alert.alert('Request sent (stub)', `Ask backend: POST /sessions { peerId:${userId}, skill:${query} }`);
  }

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'800' }}>Find a teacher</Text>
      <View style={{ flexDirection:'row', gap:8, marginTop:12 }}>
        <TextInput placeholder="Skill (e.g. Python)" value={query} onChangeText={setQuery}
          style={{ flex:1, borderWidth:1, borderRadius:10, padding:10 }} />
        <Pressable onPress={search} disabled={!query || busy}
          style={({pressed})=>({ backgroundColor:'#111827', paddingHorizontal:16, justifyContent:'center', borderRadius:10, opacity:pressed?0.9:1 })}>
          <Text style={{ color:'white', fontWeight:'700' }}>{busy?'...':'Search'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(m)=>m.user.id}
        style={{ marginTop:16 }}
        renderItem={({item})=>(
          <View style={{ borderWidth:1, borderRadius:12, padding:12, marginBottom:10 }}>
            <Text style={{ fontSize:16, fontWeight:'700' }}>{item.user.name}  •  {item.user.ratingAvg ?? '—'}★</Text>
            <Text>Teaches: {item.user.skillsTeach?.join(', ') || '—'}</Text>
            <Text>Score: {item.score}</Text>
            <View style={{ flexDirection:'row', gap:10, marginTop:8 }}>
              <Pressable onPress={()=>requestSession(item.user.id)}
                style={{ backgroundColor:'#111827', paddingVertical:8, paddingHorizontal:12, borderRadius:8 }}>
                <Text style={{ color:'white', fontWeight:'700' }}>Request session</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop:24, opacity:0.6 }}>No results yet.</Text>}
      />
    </View>
  );
}
