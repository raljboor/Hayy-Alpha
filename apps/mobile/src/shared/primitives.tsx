import React, { useMemo, useEffect, useState } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, Animated,
  TextStyle, ViewStyle, Pressable,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { dawn as T, r, d, font } from './tokens';

// ── Types ──────────────────────────────────────────────────────────────────
export type Tone = 'clay' | 'olive' | 'sand' | 'dark';

const toneBg: Record<Tone, string> = {
  clay:  'rgba(194,104,63,0.18)',
  olive: 'rgba(107,122,74,0.18)',
  sand:  T.sand,
  dark:  'rgba(42,38,34,0.14)',
};
const toneFg: Record<Tone, string> = {
  clay:  T.clay,
  olive: T.olive,
  sand:  T.inkSoft,
  dark:  T.ink,
};

// ── Icon ───────────────────────────────────────────────────────────────────
interface IProps { size?: number; stroke?: number; color?: string }

const mkIcon = (paths: React.ReactNode) =>
  ({ size = 16, stroke = 1.6, color = T.ink }: IProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths}
    </Svg>
  );

export const I = {
  arrow:   mkIcon(<Path d="M5 12h14M13 5l7 7-7 7" />),
  mic:     mkIcon(<><Rect x="9" y="2" width="6" height="12" rx="3" /><Path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" /></>),
  micOff:  mkIcon(<><Path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><Path d="M5 10a7 7 0 0 0 10.71 5.95M19 10a7 7 0 0 1-.11 1.23M12 19v2M8 23h8M2 2l20 20"/></>),
  hand2:   mkIcon(<><Path d="M18 11V6a2 2 0 0 0-4 0"/><Path d="M14 10V4a2 2 0 0 0-4 0v2"/><Path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><Path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></>),
  users:   mkIcon(<><Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><Circle cx="9" cy="7" r="4"/><Path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>),
  bell:    mkIcon(<Path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" />),
  msg:     mkIcon(<Path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9 8.5 8.5 0 0 1 8.5 8.5z" />),
  home:    mkIcon(<Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2z" />),
  search:  mkIcon(<><Circle cx="11" cy="11" r="7"/><Path d="m21 21-4.3-4.3"/></>),
  shake:   mkIcon(<><Path d="m11 17 2 2a1 1 0 1 0 3-3"/><Path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25H21"/><Path d="m21 3 1 11h-2"/><Path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><Path d="M3 4h8"/></>),
  plus:    mkIcon(<Path d="M12 5v14M5 12h14" />),
  heart:   mkIcon(<Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />),
  closed:  mkIcon(<Path d="M18 6 6 18M6 6l12 12" />),
  shuffle: mkIcon(<><Path d="M18 4l3 3-3 3"/><Path d="M18 20l3-3-3-3"/><Path d="M3 7h3.5a4 4 0 0 1 3.3 1.8l4.4 6.4a4 4 0 0 0 3.3 1.8H21"/><Path d="M3 17h3.5a4 4 0 0 0 3.3-1.8l.7-1M21 7h-3.2a4 4 0 0 0-3.3 1.8l-.7 1"/></>),
  gear:    mkIcon(<><Circle cx="12" cy="12" r="3"/><Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
  brief:   mkIcon(<><Rect x="2" y="7" width="20" height="14" rx="2"/><Path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>),
  chevL:   mkIcon(<Path d="M15 18l-6-6 6-6" />),
  chevR:   mkIcon(<Path d="M9 18l6-6-6-6" />),
  pin:     mkIcon(<><Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><Circle cx="12" cy="10" r="3"/></>),
  link:    mkIcon(<Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />),
  lock:    mkIcon(<><Rect x="3" y="11" width="18" height="11" rx="2"/><Path d="M7 11V7a5 5 0 0 1 10 0v4"/></>),
};

// ── Avatar ─────────────────────────────────────────────────────────────────
export const Avatar = ({ name = 'AB', size = 36, tone = 'clay' as Tone }) => {
  const initials = name.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const fs = Math.round(size * 0.36);
  return (
    <View style={{ width: size, height: size, borderRadius: size, backgroundColor: toneBg[tone], alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: toneFg[tone], fontSize: fs, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
};

// ── LiveTag ────────────────────────────────────────────────────────────────
export const LiveTag = ({ children = 'Live' }: { children?: React.ReactNode }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#e53e1a', borderRadius: 999 }}>
    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'white' }} />
    <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{children}</Text>
  </View>
);

// ── Btn ────────────────────────────────────────────────────────────────────
type BtnKind = 'primary' | 'soft' | 'ghost';
type BtnSize = 'md' | 'lg' | 'xl';

interface BtnProps {
  kind?: BtnKind;
  size?: BtnSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const btnBg: Record<BtnKind, string> = { primary: T.clay, soft: T.paper, ghost: 'transparent' };
const btnColor: Record<BtnKind, string> = { primary: T.paper, soft: T.ink, ghost: T.inkSoft };
const btnH: Record<BtnSize, number> = { md: 40, lg: 48, xl: 56 };
const btnPx: Record<BtnSize, number> = { md: 18, lg: 24, xl: 30 };
const btnFs: Record<BtnSize, number> = { md: 14, lg: 15, xl: 16 };

export const Btn = ({ kind = 'primary', size = 'md', children, icon, iconRight, onPress, disabled, style }: BtnProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.82}
    style={[{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 7, height: btnH[size], paddingHorizontal: btnPx[size],
      borderRadius: r.pill,
      backgroundColor: btnBg[kind],
      borderWidth: kind === 'soft' ? 1 : 0,
      borderColor: kind === 'soft' ? T.line : undefined,
      opacity: disabled ? 0.5 : 1,
    }, style]}
  >
    {icon}
    {typeof children === 'string'
      ? <Text style={{ color: btnColor[kind], fontSize: btnFs[size], fontWeight: '600' }}>{children}</Text>
      : children}
    {iconRight}
  </TouchableOpacity>
);

// ── Pill ───────────────────────────────────────────────────────────────────
export const Pill = ({ children, live }: { children?: React.ReactNode; live?: boolean }) => (
  <View style={{
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: r.pill,
    backgroundColor: live ? '#e53e1a' : T.paper,
    borderWidth: live ? 0 : 1, borderColor: T.line,
  }}>
    {typeof children === 'string'
      ? <Text style={{ color: live ? 'white' : T.inkSoft, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>{children}</Text>
      : children}
  </View>
);

// ── Card ───────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; style?: ViewStyle; onPress?: () => void; pad?: number }

export const Card = ({ children, style, onPress, pad = 16 }: CardProps) => {
  const inner = (
    <View style={[{ backgroundColor: T.paper, borderRadius: 20, borderWidth: 1, borderColor: T.line, padding: pad }, style]}>
      {children}
    </View>
  );
  return onPress ? <TouchableOpacity onPress={onPress} activeOpacity={0.85}>{inner}</TouchableOpacity> : inner;
};

// ── Meta label ─────────────────────────────────────────────────────────────
export const Meta = ({ children, style }: { children?: React.ReactNode; style?: TextStyle }) => (
  <Text style={[{ fontSize: 11, color: T.inkMute, letterSpacing: 0.5, textTransform: 'uppercase' }, style]}>{children}</Text>
);

// ── RoundBtn ───────────────────────────────────────────────────────────────
export const RoundBtn = ({ icon, badge, onPress }: { icon: React.ReactNode; badge?: boolean; onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{
    width: 42, height: 42, borderRadius: 14, backgroundColor: T.paper,
    borderWidth: 1, borderColor: T.line, alignItems: 'center', justifyContent: 'center',
  }}>
    {icon}
    {badge && <View style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: 4, backgroundColor: T.clay, borderWidth: 1.5, borderColor: T.bg }} />}
  </TouchableOpacity>
);

// ── Stack (overlapping avatars) ────────────────────────────────────────────
const tones: Tone[] = ['clay', 'olive', 'sand', 'dark'];

export const Stack = ({ names, n }: { names: string[]; n: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {names.slice(0, 3).map((nm, i) => (
      <View key={i} style={{ marginLeft: i ? -9 : 0, borderWidth: 2, borderColor: T.paper, borderRadius: 12 }}>
        <Avatar name={nm} size={24} tone={tones[i % 4]} />
      </View>
    ))}
    {n > 3 && <Text style={{ marginLeft: 7, fontSize: 12, color: T.inkMute }}>+{n - 3}</Text>}
  </View>
);

// ── Waveform ───────────────────────────────────────────────────────────────
export const Waveform = ({ bars = 18, height = 18, active = true, color = T.clay }: { bars?: number; height?: number; active?: boolean; color?: string }) => {
  const hs = useMemo(() => Array.from({ length: bars }, (_, i) => 0.3 + Math.abs(Math.sin(i * 1.7)) * 0.7), [bars]);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, height }}>
      {hs.map((h, i) => (
        <View key={i} style={{ width: 2, height: h * height, backgroundColor: color, borderRadius: 2, opacity: active ? 1 : 0.35 }} />
      ))}
    </View>
  );
};

// ── HayyMark ───────────────────────────────────────────────────────────────
export const HayyMark = ({ size = 28, color = T.clay }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill={color}>
    <Rect x="12" y="9" width="9" height="46" rx="2.2" />
    <Rect x="43" y="9" width="9" height="46" rx="2.2" />
    <Circle cx="32" cy="32" r="7" />
  </Svg>
);
