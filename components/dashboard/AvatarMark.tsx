export function AvatarMark({
  initials,
  from,
  to,
  photo,
  size = 40,
}: {
  initials: string;
  from: string;
  to: string;
  photo?: string | null;
  size?: number;
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full font-sans font-medium text-[#081424]"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${from}, ${to})`,
        color: from === "#F8F6F0" ? "#081424" : "#F8F6F0",
        fontSize: size < 36 ? 11 : 13,
      }}
    >
      {initials}
    </span>
  );
}
