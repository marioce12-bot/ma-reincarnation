import type { Character } from "@/lib/types";
import { affinityMeta } from "@/lib/eras";

export default function CharacterAvatar({
  character,
  size = 96,
  className = "",
}: {
  character: Character;
  size?: number;
  className?: string;
}) {
  const meta = affinityMeta(character.affinity_tags[0]);

  if (character.portrait_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={character.portrait_url}
        alt={character.name}
        width={size}
        height={size}
        className={`rounded-2xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl font-display font-bold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(145deg, ${meta.to}, ${meta.from})`,
        color: "#14102b",
      }}
      aria-hidden
    >
      {character.name.charAt(0).toUpperCase()}
    </div>
  );
}
