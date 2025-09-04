export const Flex = ({
  children,
  justify = 'flex-start',
  align = 'stretch',
  direction = 'row',
  gap = 0,
  style = {}
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justify,
        alignItems: align,
        flexDirection: direction,
        gap,
        ...style
      }}
    >
      {children}
    </div>
  )
}
