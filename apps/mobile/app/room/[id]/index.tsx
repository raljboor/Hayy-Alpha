import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { I, Avatar, LiveTag, Btn, Waveform, Stack, RoundBtn } from '../../../src/shared/primitives';
import { dawn as T } from '../../../src/shared/tokens';
import { ROOMS } from '../../../src/shared/data';

export default function RoomDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const room = ROOMS.find(r => r.id === id) ?? ROOMS[0];

  const speakers = [
    { name: 'Maya Nasrallah', role: 'Host · Sr PM, AWS', tone: 'clay' as const },
    { name: 'Rashid Khoury',  role: 'Eng Mgr · Amazon', tone: 'dark' as const },
    { name: 'Jenna Sun',      role: 'Talent · Shopify',  tone: 'olive' as const },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 22, paddingBottom: 120 }}>
        {/* Back */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <RoundBtn icon={<I.chevL size={18} color={T.inkSoft} />} onPress={() => router.back()} />
          <Text style={{ fontSize: 10, color: T.clay, letterSpacing: 1.4, textTransform: 'uppercase' }}>Room detail</Text>
        </View>

        {/* Status */}
        <View style={{ marginBottom: 14 }}>
          {room.live ? <LiveTag>Live now · {room.attendees} here</LiveTag> : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: T.paper, borderRadius: 999, borderWidth: 1, borderColor: T.line, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
              <I.cal size={12} color={T.inkMute} />
              <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>{room.time}</Text>
            </View>
          )}
        </View>

        <Text style={{ fontSize: 32, lineHeight: 36, marginBottom: 18, color: T.ink }}>{room.title}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Avatar name={room.host} size={44} tone={room.hostTone} />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: T.ink }}>{room.host}</Text>
            <Text style={{ fontSize: 13, color: T.inkMute }}>Sr PM · {room.hostRole} · hosting</Text>
          </View>
        </View>

        {/* Waveform */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: T.cream, borderWidth: 1, borderColor: T.line, marginBottom: 24 }}>
          <Waveform bars={28} height={28} color={T.clay} active={room.live} />
          <Text style={{ fontSize: 13, color: T.inkSoft, flex: 1 }}>
            {room.live ? '"This is exactly the conversation I needed…"' : 'Room starts ' + room.time.toLowerCase()}
          </Text>
        </View>

        {/* Speakers */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: T.ink, marginBottom: 12 }}>On stage</Text>
        <View style={{ gap: 10, marginBottom: 24 }}>
          {speakers.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: 14 }}>
              <Avatar name={s.name} size={44} tone={s.tone} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink }}>{s.name}</Text>
                <Text style={{ fontSize: 13, color: T.inkMute }}>{s.role}</Text>
              </View>
              {i === 0 && (
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(194,104,63,0.12)' }}>
                  <Text style={{ fontSize: 11, color: T.clay, fontWeight: '600' }}>Host</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Stack names={['Adam S', 'Layla P', 'Omar A', 'Diego R']} n={room.attendees} />
          <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>{room.attendees} going</Text>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22, paddingBottom: insets.bottom + 14, backgroundColor: T.bg, borderTopWidth: 1, borderTopColor: T.line }}>
        {room.live
          ? <Btn kind="primary" size="lg" iconRight={<I.arrow size={16} color={T.paper} />} onPress={() => router.push(`/room/${room.id}/live` as any)} style={{ width: '100%', justifyContent: 'center' }}>Join live room</Btn>
          : <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn kind="primary" size="lg" iconRight={<I.arrow size={16} color={T.paper} />} onPress={() => {}} style={{ flex: 1, justifyContent: 'center' }}>Reserve a seat</Btn>
              <Btn kind="soft" size="lg" onPress={() => {}}>Calendar</Btn>
            </View>
        }
      </View>
    </View>
  );
}
