import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { I, Avatar, LiveTag, Btn, Card, Meta, Stack, RoundBtn } from '../../src/shared/primitives';
import { dawn as T, r, d } from '../../src/shared/tokens';
import { ME, LIVE_NOW, UPCOMING, FEATURED, PEOPLE } from '../../src/shared/data';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Wash gradient effect via background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, backgroundColor: 'rgba(194,104,63,0.07)' }} />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 22, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 11, color: T.clay, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>TUESDAY · MAY 31</Text>
            <Text style={{ fontSize: 30, color: T.ink, lineHeight: 34 }}>
              Evening, <Text style={{ fontStyle: 'italic', color: T.clay }}>Adam.</Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, paddingTop: 4 }}>
            <RoundBtn icon={<I.bell size={18} color={T.inkSoft} />} badge onPress={() => {}} />
            <RoundBtn icon={<I.search size={18} color={T.inkSoft} />} onPress={() => {}} />
          </View>
        </View>

        {/* Live now strip */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e53e1a' }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: T.ink }}>Live now</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/room/r02/live')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <I.shuffle size={14} color={T.clay} />
            <Text style={{ fontSize: 13, color: T.clay, fontWeight: '600' }}>Shuffle</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28, marginHorizontal: -22 }} contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}>
          {LIVE_NOW.map(r => (
            <TouchableOpacity key={r.id} onPress={() => router.push(`/room/${r.id}/live` as any)} activeOpacity={0.85}
              style={{ width: 198, backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: 14 }}>
              <LiveTag>Live</LiveTag>
              <Text style={{ fontSize: 15, fontWeight: '600', lineHeight: 20, marginTop: 12, marginBottom: 14, minHeight: 38, color: T.ink }}>{r.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar name={r.host} size={26} tone={r.hostTone} />
                <Text style={{ fontSize: 11, color: T.inkMute }}>{r.attendees} listening</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Up next — featured room */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: T.ink, marginBottom: 12 }}>Up next for you</Text>
        <TouchableOpacity onPress={() => router.push(`/room/${FEATURED.id}` as any)} activeOpacity={0.85}
          style={{ backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, marginBottom: 28, overflow: 'hidden' }}>
          <View style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(194,104,63,0.12)', borderWidth: 1, borderColor: 'rgba(194,104,63,0.24)' }}>
                <Text style={{ color: T.clay, fontSize: 11, fontWeight: '600' }}>Reserved</Text>
              </View>
              <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>TODAY · 7:00 PM</Text>
            </View>
            <Text style={{ fontSize: 23, lineHeight: 26, marginBottom: 16, color: T.ink }}>{FEATURED.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Avatar name="Maya Nasrallah" size={38} tone="clay" />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink }}>Maya Nasrallah</Text>
                <Text style={{ fontSize: 12, color: T.inkMute }}>Sr PM · AWS · hosting</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Stack names={['A B', 'C D', 'E F', 'G H']} n={42} />
                <Text style={{ fontSize: 11, color: T.inkMute }}>42 going</Text>
              </View>
              <Btn kind="primary" iconRight={<I.arrow size={16} color={T.paper} />} onPress={() => router.push('/room/r04' as any)}>
                View
              </Btn>
            </View>
          </View>
        </TouchableOpacity>

        {/* Later this week */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: T.inkSoft }}>Later this week</Text>
          <Text style={{ fontSize: 13, color: T.clay, fontWeight: '600' }}>See all</Text>
        </View>
        <View style={{ gap: 10, marginBottom: 28 }}>
          {UPCOMING.slice(1, 3).map(r => (
            <TouchableOpacity key={r.id} onPress={() => router.push(`/room/${r.id}` as any)} activeOpacity={0.85}
              style={{ flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: 16 }}>
              <Avatar name={r.host} size={44} tone={r.hostTone} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', lineHeight: 19, marginBottom: 4, color: T.ink }}>{r.title}</Text>
                <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>{r.host} · {r.hostRole}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: T.clay }}>{r.time}</Text>
                <Text style={{ fontSize: 11, color: T.inkMute }}>{r.attendees} going</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* People to meet */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: T.ink, marginBottom: 12 }}>People to meet</Text>
        <View>
          {PEOPLE.slice(0, 2).map((p, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4,
              borderBottomWidth: i === 0 ? 1 : 0, borderBottomColor: T.lineSoft,
            }}>
              <Avatar name={p.name} size={44} tone={p.tone} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink }}>{p.name}</Text>
                <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>{p.role}</Text>
              </View>
              <Btn kind="soft" size="md">Follow</Btn>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
