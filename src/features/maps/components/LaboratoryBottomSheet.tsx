import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Skeleton,
  StatusBadge,
} from '@/components/ui';
import { gayaBayangan } from '@/components/ui/shadow-style';

import type {
  AktivitasLaboratorium,
  HasilAktivitas,
  StatusAktivitas,
} from '../types/activity';
import type { Laboratory } from '../types/laboratory';
import {
  labelTanggalAktivitas,
  rentangJamAktivitas,
} from '../utils/activity';

interface LaboratoryBottomSheetProps {
  laboratory: Laboratory;
  distance: number | null;
  mode: 'view' | 'select';
  aktivitas: HasilAktivitas;
  statusAktivitas: StatusAktivitas;
  pesanGalatAktivitas?: string;
  labelLab: string;
  onRetryAktivitas: () => void;
  onClose: () => void;
  onSelect?: (labId: string) => void;
}

export default function LaboratoryBottomSheet({
  laboratory,
  distance,
  mode,
  aktivitas,
  statusAktivitas,
  pesanGalatAktivitas,
  labelLab,
  onRetryAktivitas,
  onClose,
  onSelect,
}: LaboratoryBottomSheetProps) {
  return (
    <View
      className="absolute bottom-three left-three right-three rounded-xl bg-backgroundElement"
      style={[gayaBayangan, s.sheet]}
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
        {/* Judul + tombol tutup */}
        <View style={s.baris}>
          <View style={{ flex: 1 }}>
            <Text style={s.namaLab}>{laboratory.name}</Text>
            <Text style={s.alamatLab}>
              {laboratory.building}
              {laboratory.floor !== null
                ? ` · Lantai ${laboratory.floor}`
                : ''}
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Tutup detail laboratorium"
            accessibilityRole="button"
            onPress={onClose}
            style={s.tombolTutup}
          >
            <Text style={s.ikonTutup}>×</Text>
          </Pressable>
        </View>

        {/* Info jarak */}
        <View style={s.infoWrap}>
          <BarisInfo
            label="Radius laboratorium"
            nilai={`${laboratory.radiusMeters} meter`}
          />
          <BarisInfo
            label="Jarak Anda"
            nilai={
              distance !== null
                ? `${Math.round(distance)} meter`
                : 'Lokasi tidak tersedia'
            }
          />
        </View>

        {/* Aktivitas */}
        <View style={s.sectionAktivitas}>
          <Text style={s.labelSeksi}>Aktivitas laboratorium</Text>

          <IsiAktivitas
            aktivitas={aktivitas}
            labelLab={labelLab}
            onRetry={onRetryAktivitas}
            pesanGalat={pesanGalatAktivitas}
            status={statusAktivitas}
          />
        </View>

        {mode === 'select' ? (
          <AppButton
            className="mt-four"
            label="Pilih Lokasi Ini"
            onPress={() => onSelect?.(laboratory.id)}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

function BarisInfo({ label, nilai }: { label: string; nilai: string }) {
  return (
    <View style={s.barisInfo}>
      <Text style={s.labelInfo}>{label}</Text>
      <Text style={s.nilaiInfo}>{nilai}</Text>
    </View>
  );
}

function IsiAktivitas({
  aktivitas,
  status,
  pesanGalat,
  labelLab,
  onRetry,
}: {
  aktivitas: HasilAktivitas;
  status: StatusAktivitas;
  pesanGalat?: string;
  labelLab: string;
  onRetry: () => void;
}) {
  if (status === 'memuat') {
    return (
      <View style={{ marginTop: 8 }}>
        <Skeleton
          accessibilityLabel="Memuat aktivitas laboratorium"
          baris={2}
        />
      </View>
    );
  }

  if (status === 'gagal') {
    return (
      <View style={s.kartuGagal}>
        <Text style={s.judulKartu}>Gagal memuat aktivitas</Text>
        <Text style={s.isiKartu}>
          {pesanGalat ?? 'Aktivitas laboratorium tidak dapat dimuat.'}
        </Text>
        <AppButton
          className="mt-two"
          label="Coba Lagi"
          onPress={onRetry}
          size="sm"
          variant="secondary"
        />
      </View>
    );
  }

  if (!aktivitas.saatIni && !aktivitas.berikutnya) {
    return (
      <View style={s.kartuKosong}>
        <Text style={s.judulKartu}>Belum ada aktivitas</Text>
        <Text style={s.isiKartu}>
          Tidak ada praktikum saat ini maupun berikutnya di {labelLab}.
        </Text>
      </View>
    );
  }

  return (
    <View style={s.daftarAktivitas}>
      {aktivitas.saatIni ? (
        <KartuAktivitas aktivitas={aktivitas.saatIni} label="Saat ini" />
      ) : null}
      {aktivitas.berikutnya ? (
        <KartuAktivitas aktivitas={aktivitas.berikutnya} label="Berikutnya" />
      ) : null}
    </View>
  );
}

function KartuAktivitas({
  label,
  aktivitas,
}: {
  label: string;
  aktivitas: AktivitasLaboratorium;
}) {
  return (
    <View style={s.kartuAktivitas}>
      <View style={s.baris}>
        <Text style={s.labelWaktu}>{label}</Text>
        <StatusBadge status={aktivitas.sesi.status} />
      </View>
      <Text style={s.namaKelas}>{aktivitas.namaKelas}</Text>
      <Text style={s.detailKelas}>
        {aktivitas.lab} · {rentangJamAktivitas(aktivitas.sesi)}
      </Text>
      <Text style={s.tanggalKelas}>
        {labelTanggalAktivitas(aktivitas.sesi)}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  sheet: {
    maxHeight: 420,
  },
  baris: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  namaLab: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  alamatLab: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },
  tombolTutup: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  ikonTutup: {
    fontSize: 20,
    lineHeight: 24,
    color: '#64748B',
  },
  infoWrap: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  barisInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  labelInfo: {
    fontSize: 13,
    color: '#64748B',
  },
  nilaiInfo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
    textAlign: 'right',
  },
  sectionAktivitas: {
    marginTop: 14,
  },
  labelSeksi: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  daftarAktivitas: {
    gap: 8,
  },
  kartuAktivitas: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  labelWaktu: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  namaKelas: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailKelas: {
    marginTop: 3,
    fontSize: 12,
    color: '#64748B',
  },
  tanggalKelas: {
    marginTop: 2,
    fontSize: 11,
    color: '#94A3B8',
  },
  kartuGagal: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    padding: 12,
  },
  kartuKosong: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  judulKartu: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  isiKartu: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
});