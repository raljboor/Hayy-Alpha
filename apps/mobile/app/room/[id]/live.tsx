import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { I, Avatar } from '../../../src/shared/primitives';
import { dusk as T } from '../../../src/shared/tokens';

const speakers = [
  { n: 'Maya Nasrallah', r: 'Host · AWS', tone: 'clay' as const, talking: true },
  { n: 'Rashid Khoury',  r: 'Amazon', tone: 'dark' as const, talking: false },
  { n: 'Jenna Sun',      r: 'Shopify', tone: 'olive' as const, talking: true },
  { n: 'Omar Aziz',      r: 'RBC', tone: 'sand' as const, talking: false },
  { n: 'Priya Shah',     r: 'Stripe', tone: 'clay' as const, talking: false },
];

const liveComments = [
  { n: 'Dana', t: 'this is so helpful 🙌', tone: 'olive' as const },
  { n: 'Tom',  t: 'how junior is too junior?', tone: 'dark' as const },
  { n: 'Priya',t: '+1 to the portfolio point', tone: 'clay' as const },
  { n: 'Sam',  t: 'following!', tone: 'sand' as const },
  { n: 'Lea',  t: 'what about non-CS grads?', tone: 'olive' as const },
];

const SpeakerBubble = ({ s, size }: { s: typeof speakers[0]; size: number }) => (
  <View style={{ alignItems: 'center', gap: 8, width: size + 18 }}>
    <View style={{
      borderRadius: size, padding: 3,
      backgroundColor: s.talking ? T.clay : 'transparent',
      shadowColor: s.talking ? T.clay : 'transparent',
      shadowOpacity: s.talking ? 0.5 : 0,
      shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
      elevation: s.talking ? 4 : 0,
    }}>
      <Avatar name={s.n} size={size} tone={s.tone} />
    </View>
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{s.n.split(' ')[0]}</Text>
      <Text style={{ fontSize: 11, color: T.inkMute }}>{s.r}</Text>
    </View>
  </View>
);

export default function LiveRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [muted, setMuted] = useState(true);
  const [msg, setMsg] = useState('');
  const [comments, setComments] = useState<typeof liveComments>([]);

  useEffect(() => {
    let idx = 0;
    const push = () => setComments(prev => [...prev, liveComments[idx++ % liveComments.length]].slice(-3));
    push();
    const t = setInterval(push, 1800);
    return () => clearInterval(t);
  }, []);

  const ctrl = (accent: boolean): any => ({
    height: 54, minWidth: 54, borderRadius: 18, padding: 0,
    backgroundColor: accent ? T.clay : T.paper,
    borderWidth: 1, borderColor: T.line,
    alignItems: 'center', justifyContent: 'center',
  });

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar style="light" />
      {/* Glow bg */}
      <View style={{ position: 'absolute', inset: 0, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(212,114,74,0.12)' }} pointerEvents="none" />

      {/* Top bar */}
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85}
          style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: T.line, alignItems: 'center', justifyContent: 'center' }}>
          <I.chevL size={18} color={T.ink} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e53e1a' }} />
            <Text style={{ fontSize: 11, color: T.inkMute, letterSpacing: 1, textTransform: 'uppercase' }}>LIVE · 42 HERE</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.85}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(212,114,74,0.18)', borderWidth: 1, borderColor: 'rgba(212,114,74,0.4)' }}>
          <I.shuffle size={14} color={T.clay} />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: T.clay }}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, lineHeight: 24, textAlign: 'center', color: T.ink }}>Breaking into Product at Big Tech</Text>
      </View>

      {/* Stage */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26, padding: 20 }}>
        <SpeakerBubble s={speakers[0]} size={92} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, maxWidth: 320 }}>
          {speakers.slice(1).map((s, i) => <SpeakerBubble key={i} s={s} size={58} />)}
        </View>
        <Text style={{ fontSize: 11, color: T.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 }}>+ 37 listening</Text>
      </View>

      {/* Floating comments */}
      <View style={{ position: 'absolute', left: 16, right: 64, bottom: 160, zIndex: 3, gap: 8, justifyContent: 'flex-end' }} pointerEvents="none">
        {comments.map((c, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
            <Avatar name={c.n} size={26} tone={c.tone} />
            <View style={{ backgroundColor: 'rgba(26,29,36,0.78)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7, flexDirection: 'row', gap: 7, alignItems: 'baseline' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: T.clay }}>{c.n}</Text>
              <Text style={{ fontSize: 13.5, color: T.ink }}>{c.t}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Chat input */}
      <View style={{ paddingHorizontal: 22, paddingBottom: 10, zIndex: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 16, borderRadius: 999, backgroundColor: 'rgba(26,29,36,0.7)', borderWidth: 1, borderColor: T.line }}>
          <I.msg size={16} color={T.inkMute} />
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="Say something…"
            placeholderTextColor={T.inkMute}
            style={{ flex: 1, fontSize: 14, color: T.ink }}
          />
          <I.arrow size={16} color={T.clay} />
        </View>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 22, paddingBottom: insets.bottom + 14 }}>
        <TouchableOpacity onPress={() => setMuted(!muted)} style={ctrl(false)}>
          {muted ? <I.micOff size={22} color={T.ink} /> : <I.mic size={22} color={T.ink} />}
        </TouchableOpacity>
        <TouchableOpacity style={[ctrl(false), { flex: 1, flexDirection: 'row', gap: 9 }]}>
          <I.hand2 size={20} color={T.ink} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink }}>Raise hand</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ctrl(true)}>
          <I.heart size={22} color={T.paper} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
