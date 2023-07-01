export function Loader ({ newClass = '' }) {
  return (
    <div className={`lds-ring ${newClass}`}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}
