import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dawn as T } from '../../src/shared/tokens';

export default function RolesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 22, paddingBottom: 100 }}>
        <Text style={{ fontSize: 36, color: T.ink, marginBottom: 8 }}>Roles</Text>
        <Text style={{ fontSize: 14, color: T.inkSoft, marginBottom: 32, lineHeight: 20 }}>
          Every listing has a{' '}
          <Text style={{ fontStyle: 'italic', color: T.clay }}>way in</Text>
          {' '}— the room and people who can get you there.
        </Text>
        <Text style={{ fontSize: 14, color: T.inkMute, textAlign: 'center', marginTop: 40 }}>
          Available on web · hayy.app/roles
        </Text>
      </ScrollView>
    </View>
  );
}
