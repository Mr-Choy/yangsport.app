import { getAvatarClass, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  idx: number;
  size?: number;
}

export function Avatar({ name, idx, size = 44 }: AvatarProps) {
  const cls = getAvatarClass(idx);
  return (
    <div className={`avatar ${cls}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {getInitials(name)}
    </div>
  );
}
