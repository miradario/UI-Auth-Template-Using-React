import { CSSProperties } from "react";

export function Loader({
  newClass = "",
  size = 80,
  color = "#feae00",
  style = {},
}: {
  newClass?: string;
  size?: number | string;
  color?: string;
  style?: CSSProperties;
}) {
  const divStyles = {
    width: size,
    height: size,
    border: `8px solid ${color}`,
    borderColor: `${color} transparent transparent transparent`,
  };
  return (
    <div
      className={`lds-ring ${newClass}`}
      style={{ width: size, height: size, ...style }}
    >
      <div style={divStyles} />
      <div style={divStyles} />
      <div style={divStyles} />
      <div style={divStyles} />
    </div>
  );
}
