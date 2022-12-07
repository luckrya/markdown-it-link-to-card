import type { Size } from "../types";

function hyphenate(str: string): string {
  return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
}

function join(style: Record<string, string | number>) {
  return Object.entries(style)
    .map(([k, v]) => {
      if (k && v) return `${hyphenate(k)}: ${v};`;
    })
    .filter(Boolean)
    .join(" ");
}

function inlineStyle(style: Record<string, string | number>) {
  return `style="${join(style)}"`;
}

const ellipsisStyle = (line: number = 3) => ({
  "-webkit-box-orient": "vertical",
  "-webkit-line-clamp": line,
  lineClamp: line,
  display: "-webkit-box",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const STYLE = {
  small: {
    a: inlineStyle({
      color: "unset !important",
      display: "block",
      minWidth: "340px",
      width: "90%",
    }),
    container: inlineStyle({
      display: "flex",
      alignItems: "center",
      padding: "6px 10px 8px 10px",
      borderRadius: "8px",
      border: "0.8px solid #dedede",
    }),
    img: inlineStyle({
      marginRight: "12px",
      borderRadius: "8px",
      width: "50px",
      height: "50px",
    }),
    texts: inlineStyle({}),
    title: inlineStyle({
      ...ellipsisStyle(1),
      margin: 0,
      opacity: 0.8,
      fontSize: "14px",
      lineHeight: "14px",
      fontWeight: "bold",
    }),
    description: inlineStyle({
      ...ellipsisStyle(2),
      opacity: 0.6,
      margin: "4px 0 0 0",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
    }),
  },
  large: {
    a: inlineStyle({
      color: "unset !important",
      display: "block",
      minWidth: "340px",
    }),
    container: inlineStyle({
      display: "flex",
      alignItems: "center",
      padding: "12px 14px",
      borderRadius: "8px",
      border: "1px solid #dedede",
    }),
    img: inlineStyle({
      marginRight: "12px",
      borderRadius: "12px",
      width: "80px",
      height: "80px",
    }),
    texts: inlineStyle({}),
    title: inlineStyle({
      ...ellipsisStyle(2),
      margin: 0,
      opacity: 0.8,
      fontSize: "16px",
      lineHeight: "16px",
      fontWeight: "bold",
    }),
    description: inlineStyle({
      ...ellipsisStyle(),
      opacity: 0.6,
      fontSize: "13px",
      margin: "2px 0 0 0",
      lineHeight: "14px",
    }),
  },
};

export function styleNames(size: Size) {
  return STYLE[size] || STYLE.large;
}

export const classNames = (prefix?: string) => ({
  container: `${prefix}__container`,
  img: `${prefix}__img`,
  texts: `${prefix}__texts`,
  title: `${prefix}__texts--title`,
  description: `${prefix}__texts--desc`,
});
