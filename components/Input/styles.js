import { dims, type, colors } from 'theme'

export default function styles({
  focused,
  errorMsg,
  width = dims.baseUnit * 10,
  fontSize = dims.smallFontSize,
  inputStyle,
  inputContainerStyle
}) {

  let labelColor

  if (errorMsg) {
    labelColor = colors.red
  } else if (focused) {
    labelColor = colors.medBlue
  } else {
    labelColor = colors.darkGrey
  }

  let borderColor

  if (errorMsg) {
    borderColor = colors.red
  } else if (focused) {
    borderColor = colors.medBlue
  } else {
    borderColor = colors.lightGrey
  }

  return {
    container: {
      width,
      ...inputContainerStyle
    },
    label: {
      color: labelColor,
      ...type.gothamSSmBook,
      fontSize: dims.exSmallFontSize,
      transition: 'color 250ms ease-in-out',
    },
    input: {
      display: 'block',
      outline: 'none',
      background: 'none',
      fontSize,
      ...type.gothamSSmBook,
      border: `1px solid ${borderColor}`,
      borderRadius: '2px',
      width: '100%',
      padding: `8px`,
      transition: 'border 250ms ease-in-out',
      ...inputStyle
    },
    error: {
      color: colors.red,
      minHeight: dims.baseUnit,
      ...type.label,
      ...type.gothamSSmBook,
      fontSize: dims.exSmallFontSize,
    }
  }
}
