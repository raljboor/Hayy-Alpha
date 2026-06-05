import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, I } from '../../src/shared/primitives';
import { dawn as T, r } from '../../src/shared/tokens';

export default function HostScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [title, setTitle] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 22, paddingBottom: 100 }}>
        <Text style={{ fontSize: 11, color: T.clay, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>Start</Text>
        <Text style={{ fontSize: 36, color: T.ink, marginBottom: 8 }}>Create a room</Text>
        <Text style={{ fontSize: 15, color: T.inkSoft, marginBottom: 28 }}>Careers grow in conversation. Start one.</Text>

        {/* Mode toggle */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 28 }}>
          {(['now', 'schedule'] as const).map(m => (
            <TouchableOpacity key={m} onPress={() => setMode(m)} activeOpacity={0.85} style={{
              flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
              backgroundColor: mode === m ? T.clay : T.paper,
              borderWidth: mode === m ? 0 : 1, borderColor: T.line,
            }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: mode === m ? T.paper : T.inkSoft }}>
                {m === 'now' ? '⚡ Start now' : '📅 Schedule'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title input */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: T.inkSoft, marginBottom: 6 }}>Room title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Breaking into Product at Big Tech"
          placeholderTextColor={T.inkMute}
          style={{
            backgroundColor: T.paper, borderRadius: 12, borderWidth: 1, borderColor: T.line,
            padding: 14, fontSize: 14, color: T.ink, marginBottom: 20,
          }}
        />

        {/* Topics */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: T.inkSoft, marginBottom: 10 }}>Topic</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['Product', 'Engineering', 'Design', 'Data', 'Hiring', 'Careers'].map(t => (
            <TouchableOpacity key={t} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: T.line, backgroundColor: T.paper }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: T.inkSoft }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Btn kind="primary" size="lg" style={{ width: '100%', justifyContent: 'center' }}
          icon={<I.mic size={18} color={T.paper} />}>
          {mode === 'now' ? 'Go live' : 'Schedule room'}
        </Btn>
      </ScrollView>
    </View>
  );
}
