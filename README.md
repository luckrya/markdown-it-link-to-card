# @luckrya/markdown-it-link-to-card

<img src="https://img.shields.io/npm/v/@luckrya/markdown-it-link-to-card" alt="NPM Version" />
<img src="https://img.shields.io/npm/l/@luckrya/markdown-it-link-to-card" alt="License">
<img src="https://img.shields.io/npm/dm/@luckrya/markdown-it-link-to-card.svg" alt="NPM Downloads" />
<br /><br />

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin for turning page links into link cards (which contain brief information about the link).

- Extract links with special flags (eg. `[text]($:url)`) and convert them into card information display.
- Support for custom renderers to support rendering into anything you want.
- Support injecting class names for cards to support custom styles.

## Install

```sh
npm i @luckrya/markdown-it-link-to-card
```

## Usage

```ts
import MarkdownIt from "markdown-it";
import { linkToCardPlugin } from "@luckrya/markdown-it-link-to-card";
import type { LinkToCardPluginOptions } from "@luckrya/markdown-it-link-to-card";

const md = MarkdownIt({ html: true }).use<LinkToCardPluginOptions>(
  linkToCardPlugin,
  {
    // options
    size: "small",
  }
);

const rendered = md.render(`

# Home

...

### Reference

  - [github](https://github.com)
  - [bing](https://cn.bing.com/)
  - [知乎 - 发现页](https://www.zhihu.com/explore)
  - [markdown-it-link-to-card](https://github.com/luckrya/markdown-it-link-to-card)

<br />

  - [github](@:https://github.com)
  - [bing](@:https://cn.bing.com)
  - [知乎 - 发现页](@:https://www.zhihu.com/explore)
  - [markdown-it-link-to-card](@:https://github.com/luckrya/markdown-it-link-to-card)

`);
```

**Use in vitepress:**

```ts
// docs/.vitepress/config.ts

import { defineConfig } from "vitepress";

export default defineConfig({
  // ...

  themeConfig: {
    nav: [{ text: "Home", link: "/index" }],
  },

  markdown: {
    config: (md) => {
      md.use<LinkToCardPluginOptions>(linkToCardPlugin, {
        size: "small",
        tag: "$",
      });
    },
  },

  // ...
});

// docs/index.md
// Let's say your home page content is:
`
# Home

...

### Reference

  - [github](https://github.com)
  - [bing](https://cn.bing.com/)
  - [知乎 - 发现页](https://www.zhihu.com/explore)
  - [markdown-it-link-to-card](https://github.com/luckrya/markdown-it-link-to-card)

<br />

  - [github]($:https://github.com)
  - [bing]($:https://cn.bing.com)
  - [知乎 - 发现页]($:https://www.zhihu.com/explore)
  - [markdown-it-link-to-card]($:https://github.com/luckrya/markdown-it-link-to-card)

`;
```

**_Rendering results:_**

![Rendering results](https://cdn.nlark.com/yuque/0/2022/png/414384/1667208979236-2f4a8098-eaf7-4c21-886d-90e76e040fb5.png)

## Options

### tag

- Type: `string`
- Default: `$`
- Details:

  Identifier, e.g. `[xxx]($:https://github.com)`

### Size

- Type: `'small' | 'large'`
- Default: `'small'`
- Details:

  Card size, only valid in inline style mode.

### target

- Type: `'_self' | '_blank' | '_top' | '_parent'`
- Default: `'_blank'`
- Details:

  Link jump behavior. [more detail](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target)

### classPrefix

- Type: `string | undefined`
- Default: `undefined`
- Details:

  Card DOM class name prefix. If this option is set, the inline style will not be injected, but the relevant class name will be injected directly. e.g. the setting value is `'my-docs'` will get the following structure

  ```html
  <div class="my-docs__container">
    <img class="my-docs__img" src="$logo" />
    <div class="my-docs__texts">
      <h3 class="my-docs__texts--title">$title</h3>
      <p class="my-docs__texts--desc">$description</p>
    </div>
  </div>
  ```

### showTitle

- Type: `boolean`
- Default: true
- Details:

  Whether to display the link title. Note that this will be displayed as a tooltip, with the displayed value extracted from `[link title]()`. [more detail](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title)

### render

- Type: `undefined | CardDomRender`

  ```ts
  type CardDomRender = (
    data: {
      logo?: string;
      title?: string;
      description?: string;
    },
    options: {
      href: string;
      linkTitle: string;
      showTitle: boolean;
      target: "_self" | "_blank" | "_top" | "_parent";
      size: "small" | "large";
      classPrefix?: string;
    }
  ) => string;
  ```

- Default: `undefined`
- Details:

  Custom Rendering DOM Fragments.

## Q/A

### How to get url metadata?

Synchronized remote request. why? "All complex parsers are sync by nature.".
As the number of card links you write increases, the loading will not become very slow, because it does caching internally.

### Does the plugin set up the cache? And how?

Yes, it's set. It will cache all the parsed metadata in the form of local cache instead of in memory!
A special file (`.linkcardrc`) will be created in the working directory of the current execution to store this metadata.

> It is not recommended that this file be ignored by Git！

## API

```ts
import { generateCard } from "@luckrya/markdown-it-link-to-card";

generateCard("https://github.com", {
  linkTitle: "Github Home",
  showTitle: true,
  size: "small",
}).then(({ dom }) => {
  // card dom fragment
  console.log(dom);
});
```
