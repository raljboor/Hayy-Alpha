import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { I, HayyMark } from '../../src/shared/primitives';
import { dawn as T } from '../../src/shared/tokens';

// ── Center Start button ────────────────────────────────────────────────────
function StartBtn({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ alignItems: 'center', gap: 5 }}>
      <View style={{
        width: 46, height: 46, borderRadius: 16, marginTop: -2,
        backgroundColor: T.clay, alignItems: 'center', justifyContent: 'center',
        shadowColor: T.clay, shadowOpacity: 0.55, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}>
        <I.plus size={24} stroke={2.2} color={T.paper} />
      </View>
      <Text style={{ fontSize: 10, fontWeight: '600', color: T.inkMute }}>Start</Text>
    </TouchableOpacity>
  );
}

// ── Tab bar icon ───────────────────────────────────────────────────────────
function TabIcon({ icon, label, focused, badge }: { icon: React.ReactNode; label: string; focused: boolean; badge?: number }) {
  return (
    <View style={{ alignItems: 'center', gap: 5 }}>
      <View style={{ position: 'relative' }}>
        {icon}
        {badge != null && (
          <View style={{
            position: 'absolute', top: -5, right: -9,
            minWidth: 15, height: 15, paddingHorizontal: 4, borderRadius: 999,
            backgroundColor: T.clay, borderWidth: 1.5, borderColor: T.paper,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: T.paper, fontSize: 9, fontWeight: '700' }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 10, fontWeight: focused ? '600' : '500', color: focused ? T.clay : T.inkMute }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: T.paper,
          borderTopColor: T.line,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 12,
          paddingHorizontal: 14,
          elevation: 0,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -6 },
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<I.home size={23} stroke={focused ? 2 : 1.6} color={focused ? T.clay : T.inkMute} />} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="roles"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<I.brief size={23} stroke={focused ? 2 : 1.6} color={focused ? T.clay : T.inkMute} />} label="Roles" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          tabBarIcon: () => <StartBtn onPress={() => {}} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<I.msg size={23} stroke={focused ? 2 : 1.6} color={focused ? T.clay : T.inkMute} />} label="Inbox" focused={focused} badge={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<I.users size={23} stroke={focused ? 2 : 1.6} color={focused ? T.clay : T.inkMute} />} label="You" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
