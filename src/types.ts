import type MarkdownIt from "markdown-it";

export type LinkToCardPlugin =
  MarkdownIt.PluginWithOptions<LinkToCardPluginOptions>;

/**
 * @reference
 *   - https://daringfireball.net/projects/markdown/syntax#link
 *   - https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/title
 *   - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
 */
export interface LinkToCardPluginOptions {
  tag?: string /* 标识符，默认：C  如，[xxx](C::https://github.com) */;
  target?: ATarget /* 在哪里显示链接的 URL，默认：_blank ，即新开 Tab 页打开链接*/;

  size?: Size /* 卡片尺寸，只在内联样式下生效，即不设置 classPrefix。 默认： large */;
  showTitle?: boolean /* 是否显示链接标题，默认： true 。注意，这将以提示信息展示 */;

  classPrefix?: string /* 卡片 DOM 类名前缀，若设置该项，将不注入内链样式，直接注入相关类目。如，'my-docs__link-card' */;
  render?: CardDomRender /* 自定义渲染 DOM Fragment */;
}

export interface UrlMetadata {
  title?: string;
  description?: string;
  logo?: string;
}

export type Size = "small" | "large";

export type ATarget = "_self" | "_blank" | "_top" | "_parent";

export interface CardDomRenderOptions {
  href: string;
  linkTitle: string;
  showTitle: boolean;
  target: ATarget;
  size: Size;
  classPrefix?: string;
}

export type CardDomRender = (
  data: UrlMetadata,
  options: CardDomRenderOptions
) => string;
