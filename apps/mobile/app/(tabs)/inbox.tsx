import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../src/shared/primitives';
import { dawn as T } from '../../src/shared/tokens';

const threads = [
  { from: 'Maya Nasrallah', tone: 'clay' as const, preview: 'Happy to connect — drop me a time that works.', time: '2h', unread: true },
  { from: 'Rashid Khoury',  tone: 'dark' as const, preview: "Let me know when you're ready to practice.", time: '1d', unread: false },
  { from: 'Hana Yusuf',    tone: 'clay' as const, preview: 'Got your referral request — looks great!', time: '2d', unread: true },
  { from: 'Jenna Sun',     tone: 'olive' as const, preview: 'We should jump on a quick call.', time: '3d', unread: false },
];

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 22, paddingBottom: 100 }}>
        <Text style={{ fontSize: 11, color: T.clay, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>2 unread</Text>
        <Text style={{ fontSize: 36, color: T.ink, marginBottom: 28 }}>Inbox</Text>

        {threads.map((t, i) => (
          <View key={i} style={{
            flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16,
            borderRadius: 16, marginBottom: 2,
            backgroundColor: t.unread ? 'rgba(194,104,63,0.05)' : 'transparent',
          }}>
            <View style={{ position: 'relative' }}>
              <Avatar name={t.from} size={44} tone={t.tone} />
              {t.unread && <View style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: T.clay, borderWidth: 2, borderColor: T.bg }} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: t.unread ? '700' : '500', color: T.ink }}>{t.from}</Text>
                <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase' }}>{t.time}</Text>
              </View>
              <Text numberOfLines={1} style={{ fontSize: 13, color: T.inkSoft }}>{t.preview}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
