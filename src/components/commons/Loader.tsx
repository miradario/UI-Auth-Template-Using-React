export function Loader({
  newClass = "",
  size = 80,
}: {
  newClass?: string;
  size?: number | string;
}) {
  return (
    <div
      className={`lds-ring ${newClass}`}
      style={{ width: size, height: size }}
    >
      <div style={{ width: size, height: size }} />
      <div style={{ width: size, height: size }} />
      <div style={{ width: size, height: size }} />
      <div style={{ width: size, height: size }} />
    </div>
  );
}
