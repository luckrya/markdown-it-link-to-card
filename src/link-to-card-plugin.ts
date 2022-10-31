import type { LinkToCardPlugin } from "./types";
import type Token from "markdown-it/lib/token";

import { isFunction } from "@luckrya/utility";
import { getUrlMetadata, generateCardDomFragment } from "./assemble";

export const linkToCardPlugin: LinkToCardPlugin = (md, pluginOptions = {}) => {
  // const _render = md.renderer.render.bind(md.renderer);
  // md.renderer.render = (tokens, options, env) => {
  //   const result = _render(tokens, options, env);
  //   return result;
  // };

  function parseCardLinkHref(href?: string) {
    const tagRegexp = new RegExp(
      `^(${pluginOptions?.tag || "C"}:)([a-zA-Z0-9]+.*)`
    );
    const match = href?.match(tagRegexp);

    return {
      isCardLink: !!match,
      url: match?.[2],
    };
  }

  function assembleCardTpl(options: {
    url: string;
    tokens: Token[];
    i: number;
  }) {
    const urlMetadata = getUrlMetadata(options.url);

    if (urlMetadata) {
      ignoreRestToken(options.tokens, options.i); // linkTitle 依赖 ignoreRestToken 的处理结果

      const cardDomOptions = {
        href: options.url,
        linkTitle: joinLinkTitle(options.tokens),
        target: pluginOptions.target || "_blank",
        size: pluginOptions.size || "large",
        showTitle: pluginOptions.showTitle || true,
        classPrefix: pluginOptions.classPrefix,
      };

      return isFunction(pluginOptions.render)
        ? pluginOptions.render(urlMetadata, cardDomOptions)
        : generateCardDomFragment(urlMetadata, cardDomOptions);
    }
  }

  // https://markdown-it.github.io/markdown-it/#MarkdownIt.renderInline
  md.renderer.renderInline = (tokens, rootOptions, env) => {
    let result = "";

    for (let i = 0; i < tokens.length; i++) {
      const currentToken = tokens[i];
      const ruleFunction = md.renderer.rules[currentToken.type];

      if (currentToken.hidden) {
        result += "";
      } else if (isFunction(ruleFunction)) {
        result += ruleFunction(tokens, i, rootOptions, env, md.renderer);
      } else {
        result += md.renderer.renderToken(tokens, i, rootOptions);
      }
    }

    return result;
  };

  md.renderer.rules.link_open = (tokens, i, rootOptions, env, self) => {
    const token = tokens[i];
    const isLinkOpenToken = token.tag === "a" && token.type === "link_open";
    const href = token.attrs?.filter((attr) => attr.includes("href"))[0]?.[1];
    const { url, isCardLink } = parseCardLinkHref(href);

    if (isLinkOpenToken && isCardLink && url) {
      const card = assembleCardTpl({
        url,
        tokens,
        i,
      });

      if (card) return card;
      return self.renderToken(tokens, i, rootOptions);
    }

    return self.renderToken(tokens, i, rootOptions);
  };
};

// TODO: handle softbreak https://markdown-it.github.io/
// []()
// []()
function ignoreRestToken(tokens: Token[], i: number) {
  tokens.forEach((token, index) => {
    if (index !== i) token.hidden = true;
  });
}

function joinLinkTitle(tokens: Token[]) {
  return tokens
    .map(({ hidden, content }) => {
      if (hidden) return content;
      return "";
    })
    .filter(Boolean)
    .join("");
}
