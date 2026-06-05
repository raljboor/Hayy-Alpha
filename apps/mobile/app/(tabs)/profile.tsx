import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Btn, Card, Meta, I } from '../../src/shared/primitives';
import { dawn as T } from '../../src/shared/tokens';
import { ME, MAYA } from '../../src/shared/data';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 22, paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <Text style={{ fontSize: 36, color: T.ink }}>You</Text>
        <TouchableOpacity onPress={() => router.push('/settings' as any)} style={{
          flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8,
          borderRadius: 999, backgroundColor: T.paper, borderWidth: 1, borderColor: T.line,
        }}>
          <I.gear size={16} color={T.inkSoft} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Profile card */}
      <View style={{ backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: 18, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 18 }}>
          <Avatar name={ME.name} size={68} tone={ME.avatarTone} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, color: T.ink, marginBottom: 4 }}>{ME.name}</Text>
            <Text style={{ fontSize: 14, color: T.inkSoft, marginBottom: 6 }}>{ME.headline}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <I.pin size={13} color={T.inkMute} />
              <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>{ME.location}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: T.line, paddingTop: 16, marginBottom: 16 }}>
          {[
            { value: ME.stats.rooms, label: 'rooms' },
            { value: ME.stats.intros, label: 'intros' },
            { value: ME.stats.referrals, label: 'referrals' },
            { value: ME.stats.followers, label: 'followers' },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 3 ? 1 : 0, borderRightColor: T.lineSoft }}>
              <Text style={{ fontSize: 24, color: T.ink, fontWeight: '500', lineHeight: 28 }}>{s.value}</Text>
              <Text style={{ fontSize: 10, color: T.inkMute, textTransform: 'uppercase', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={{ flex: 1, height: 40, borderRadius: 999, borderWidth: 1, borderColor: T.line, backgroundColor: T.paper, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink }}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: T.line, backgroundColor: T.paper, alignItems: 'center', justifyContent: 'center' }}>
            <I.link size={16} color={T.inkSoft} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bio */}
      <View style={{ backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, color: T.clay, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>About</Text>
        <Text style={{ fontSize: 14, color: T.inkSoft, lineHeight: 22 }}>{ME.bio}</Text>
      </View>

      {/* Looking for */}
      <View style={{ backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, color: T.clay, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Looking for</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ME.lookingFor.map((t, i) => (
            <View key={i} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(194,104,63,0.1)', borderWidth: 1, borderColor: 'rgba(194,104,63,0.22)' }}>
              <Text style={{ fontSize: 11, color: T.clay, fontWeight: '600' }}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
