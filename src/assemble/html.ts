import type { CardDomRender } from "../types";

import { isString } from "@luckrya/utility";
import { styleNames, classNames } from "./style";

export const generateCardDomFragment: CardDomRender = (data, options) => {
  const aa = {
    rel: `rel="noopener noreferrer"`,
    target: `target="${options.target}"`,
    href: `href="${options.href}"`,
    title: options.showTitle ? `title="${options.linkTitle}"` : "",
  };

  const inject = (s: string, c: string) => {
    if (isString(options.classPrefix) && !!options.classPrefix) return c;
    return s;
  };

  const classes = classNames(options.classPrefix);
  const style = styleNames(options.size);

  return `<span style="display:block;">
  <a ${aa.rel} ${aa.target} ${aa.href} ${aa.title} ${style.a}>
    <span ${inject(style.container, classes.container)}>
      <img src="${data?.logo}" ${inject(style.img, classes.img)}/>

      <span ${inject(style.texts, classes.texts)}>
        <span ${inject(style.title, classes.title)}>
          ${data.title || options.linkTitle || ""}
        </span>
        <span ${inject(style.description, classes.description)}>
          ${data.description || ""}
        </span>
      </span>
    </span>
  </a>
</span>`;
};
