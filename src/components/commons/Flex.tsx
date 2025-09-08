export const Flex = ({
  children,
  justify = "flex-start",
  align = "stretch",
  direction = "row",
  gap = 0,
  style = {},
  className = "",
}: {
  children: React.ReactNode;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: number | string;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: justify,
        alignItems: align,
        flexDirection: direction,
        gap,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
