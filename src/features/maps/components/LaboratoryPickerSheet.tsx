import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { gayaBayangan } from '@/components/ui/shadow-style';

import { LABORATORY_OPTIONS } from '../constants/laboratory';
import type { LaboratoryId } from '../types/laboratory';

type LaboratoryPickerSheetProps = {
  selectedLabId: LaboratoryId | null;
  pesan?: string;
  onSelect: (labId: LaboratoryId) => void;
};

export default function LaboratoryPickerSheet({
  selectedLabId,
  pesan,
  onSelect,
}: LaboratoryPickerSheetProps) {
  return (
    <View
      className="absolute bottom-three left-three right-three rounded-xl bg-backgroundElement"
      style={[gayaBayangan, { maxHeight: 320 }]}
    >
      {/* Handle bar */}
      <View className="items-center pb-two pt-twoHalf">
        <View className="h-one w-five rounded-pill bg-border" />
      </View>

      <ScrollView
        className="px-four"
        contentContainerClassName="pb-four"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-subtitle font-semibold text-text">
          Temukan laboratoriummu
        </Text>

        <Text className="mt-one text-small text-textSecondary">
          Pilih laboratorium untuk melihat lokasi dan aktivitas praktikum.
        </Text>

        {/* Grid 2 kolom */}
        <View style={s.grid}>
          {LABORATORY_OPTIONS.map((option) => {
            const terpilih = selectedLabId === option.id;

            return (
              <Pressable
                key={option.id}
                accessibilityLabel={`Pilih ${option.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: terpilih }}
                onPress={() => onSelect(option.id)}
                style={[
                  s.tombol,
                  terpilih ? s.tombolAktif : s.tombolNormal,
                ]}
              >
                <Text
                  style={[
                    s.labelTombol,
                    terpilih ? s.labelAktif : s.labelNormal,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {pesan ? (
          <Text
            accessibilityLiveRegion="polite"
            className="mt-two text-caption text-danger"
          >
            {pesan}
          </Text>
        ) : null}

        <Text className="mt-three text-caption text-textSecondary">
          Ketuk penanda pada peta untuk melihat lokasi dan aktivitas laboratorium.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  tombol: {
    height: 48,
    minWidth: '45%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1.5,
  },
  tombolNormal: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tombolAktif: {
    borderColor: '#192957',
    backgroundColor: '#192957',
  },
  labelTombol: {
    fontSize: 15,
    fontWeight: '600',
  },
  labelNormal: {
    color: '#1E293B',
  },
  labelAktif: {
    color: '#FFFFFF',
  },
});

export type { LaboratoryPickerSheetProps };