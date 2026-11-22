import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';

const NAVY = Colors.light.loginInk;
const TERANG = Colors.light.loginField;
const PUTIH = Colors.light.loginBackground;
const AKSEN = Colors.light.warning;

type LandingHeroProps = {
  className?: string;
};

/**
 * Ilustrasi meja kerja lab komputer. Praktikum yang dicatat aplikasi ini
 * berlangsung di lab komputer, jadi monitor, keyboard, dan meja adalah konteks
 * nyata penggunanya, bukan gambar dekoratif umum.
 *
 * Semua warna berasal dari token; variasi nada dibuat lewat `fillOpacity`
 * supaya tidak ada nilai hex baru di komponen.
 */
export function LandingHero({ className = '' }: LandingHeroProps) {
  return (
    <View
      accessibilityElementsHidden
      accessible={false}
      className={`w-full ${className}`}
      importantForAccessibility="no-hide-descendants"
      style={{ aspectRatio: 360 / 300 }}
    >
      <Svg height="100%" viewBox="0 0 360 300" width="100%">
        <Rect fill={NAVY} height={300} width={360} x={0} y={0} />

        <Ellipse cx={72} cy={180} fill={PUTIH} fillOpacity={0.05} rx={84} ry={84} />
        <Ellipse cx={306} cy={100} fill={PUTIH} fillOpacity={0.04} rx={62} ry={62} />

        <Circle cx={28} cy={170} fill={AKSEN} r={4} />
        <Circle cx={334} cy={214} fill={AKSEN} r={3} />

        <G opacity={0.6}>
          <Rect fill={TERANG} height={54} rx={6} width={84} x={8} y={36} />
          <Rect fill={NAVY} height={4} rx={2} width={42} x={18} y={48} />
          <Rect fill={NAVY} height={4} rx={2} width={54} x={18} y={58} />
          <Rect fill={NAVY} height={4} rx={2} width={32} x={18} y={68} />
        </G>

        <G opacity={0.6}>
          <Rect fill={TERANG} height={58} rx={6} width={82} x={270} y={30} />
          <Rect fill={NAVY} height={4} rx={2} width={28} x={280} y={42} />
          <Rect fill={AKSEN} height={4} rx={2} width={18} x={316} y={42} />
          <Rect fill={NAVY} height={4} rx={2} width={50} x={280} y={52} />
          <Rect fill={NAVY} height={4} rx={2} width={36} x={280} y={62} />
        </G>

        <Rect fill={PUTIH} fillOpacity={0.12} height={32} rx={4} width={66} x={14} y={122} />
        <Rect fill={PUTIH} fillOpacity={0.3} height={4} rx={2} width={40} x={22} y={132} />
        <Rect fill={PUTIH} fillOpacity={0.2} height={4} rx={2} width={50} x={22} y={142} />

        <Rect fill={TERANG} height={90} rx={7} width={168} x={96} y={110} />
        <Rect fill={NAVY} height={74} rx={3} width={152} x={104} y={118} />

        <Rect fill={TERANG} fillOpacity={0.55} height={62} rx={3} width={36} x={110} y={124} />
        <Rect fill={PUTIH} fillOpacity={0.22} height={4} rx={2} width={22} x={116} y={132} />
        <Rect fill={PUTIH} fillOpacity={0.22} height={4} rx={2} width={28} x={116} y={142} />
        <Rect fill={PUTIH} fillOpacity={0.22} height={4} rx={2} width={18} x={116} y={152} />

        <Rect fill={PUTIH} fillOpacity={0.2} height={4} rx={2} width={44} x={154} y={128} />
        <Rect fill={AKSEN} height={4} rx={2} width={26} x={202} y={128} />
        <Rect fill={PUTIH} fillOpacity={0.2} height={4} rx={2} width={62} x={154} y={140} />
        <Rect fill={PUTIH} fillOpacity={0.2} height={4} rx={2} width={34} x={168} y={152} />
        <Rect fill={PUTIH} fillOpacity={0.2} height={4} rx={2} width={48} x={168} y={164} />

        <Rect fill={TERANG} height={44} rx={3} width={16} x={172} y={200} />
        <Rect fill={TERANG} height={8} rx={4} width={68} x={146} y={244} />

        <Rect fill={TERANG} height={16} rx={4} width={360} x={0} y={252} />
        <Rect fill={PUTIH} fillOpacity={0.4} height={3} rx={1.5} width={360} x={0} y={252} />
        <Rect fill={PUTIH} fillOpacity={0.07} height={6} rx={2} width={360} x={0} y={268} />

        <Rect fill={NAVY} fillOpacity={0.16} height={10} rx={3} width={124} x={118} y={255} />
        <Rect fill={NAVY} fillOpacity={0.4} height={3} rx={1.5} width={108} x={126} y={259} />

        <Ellipse cx={262} cy={260} fill={NAVY} fillOpacity={0.16} rx={9} ry={6} />
      </Svg>
    </View>
  );
}

export type { LandingHeroProps };
