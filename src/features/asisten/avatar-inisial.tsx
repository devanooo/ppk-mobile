import { Text, View } from 'react-native';

function inisialNama(nama: string): string {
  const kata = nama
    .trim()
    .split(/\s+/)
    .filter((bagian) => bagian.length > 0);

  if (kata.length === 0) return '?';

  return kata
    .slice(0, 2)
    .map((bagian) => bagian[0]?.toUpperCase() ?? '')
    .join('');
}

type AvatarInisialProps = {
  nama: string;
  className?: string;
};

export function AvatarInisial({ nama, className = '' }: AvatarInisialProps) {
  return (
    <View
      accessible={false}
      className={`h-touch w-touch items-center justify-center rounded-pill bg-backgroundSelected ${className}`}
    >
      <Text className="text-body font-semibold text-primary">
        {inisialNama(nama)}
      </Text>
    </View>
  );
}

export type { AvatarInisialProps };
