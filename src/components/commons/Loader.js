export function Loader ({ newClass = '', size = 80 }) {
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
  )
}
