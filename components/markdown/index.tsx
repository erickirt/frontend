import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { childrenToSolid } from "./solid-markdown/ast-to-solid";
import { defaults } from "./solid-markdown/defaults";
import { html } from "property-information";
import { unified } from "unified";
import { VFile } from "vfile";

import { remarkUnicodeEmoji, RenderUnicodeEmoji } from "./plugins/unicodeEmoji";
import { remarkCustomEmoji, RenderCustomEmoji } from "./plugins/customEmoji";
import { remarkChannels, RenderChannel } from "./plugins/channels";
import { remarkMention, RenderMention } from "./plugins/mentions";
import { remarkSpoiler, RenderSpoiler } from "./plugins/spoiler";
import { remarkHtmlToText } from "./plugins/htmlToText";
import { remarkTimestamps } from "./plugins/timestamps";
import { RenderCodeblock } from "./plugins/Codeblock";
import { injectEmojiSize } from "./plugins/emoji";
import { RenderAnchor } from "./plugins/anchors";

import { handlers } from "./hast";
import { sanitise } from "./sanitise";
import { styled } from "solid-styled-components";

const Null = () => null;

/**
 * Custom Markdown components
 */
const components = {
  uemoji: RenderUnicodeEmoji,
  cemoji: RenderCustomEmoji,
  mention: RenderMention,
  spoiler: RenderSpoiler,
  channel: RenderChannel,
  a: RenderAnchor,
  p: styled.p<{ ["emoji-size"]?: "medium" | "large" }>`
    margin: 0;

    > code {
      padding: 1px 4px;
      flex-shrink: 0;
    }

    ${(props) =>
      props["emoji-size"]
        ? `--emoji-size:${props.theme!.layout.emoji[props["emoji-size"]]};`
        : ""}
  `,
  h1: styled.h1`
    margin: 0.2em 0;
  `,
  h2: styled.h2`
    margin: 0.2em 0;
  `,
  h3: styled.h3`
    margin: 0.2em 0;
  `,
  h4: styled.h4`
    margin: 0.2em 0;
  `,
  h5: styled.h5`
    margin: 0.2em 0;
  `,
  h6: styled.h6`
    margin: 0.2em 0;
  `,
  pre: RenderCodeblock,
  code: styled.code`
    color: ${(props) => props.theme!.colours.foreground};
    background: ${(props) => props.theme!.colours["background-100"]};

    font-size: 90%;
    font-family: var(--monospace-font), monospace;

    border-radius: 3px;
    box-decoration-break: clone;
  `,
  table: styled.table`
    border-collapse: collapse;

    th,
    td {
      padding: 6px;
      border: 1px solid ${(props) => props.theme!.colours["foreground-200"]};
    }
  `,
  ul: styled.ul`
    list-style-position: outside;
    padding-left: 1.5em;
    margin: 0.2em 0;
  `,
  ol: styled.ol`
    list-style-position: outside;
    padding-left: 1.5em;
    margin: 0.2em 0;
  `,
  blockquote: styled.blockquote`
    margin: 2px 0;
    padding: 2px 0;
    border-radius: ${(props) => props.theme!.borderRadius.md};
    background: ${(props) => props.theme!.colours["background-300"]};
    border-inline-start: 4px solid
      ${(props) => props.theme!.colours["background-200"]};

    > * {
      margin: 0 8px;
    }
  `,
  // Block image elements
  img: Null,
  // Catch literally everything else just in case
  video: Null,
  figure: Null,
  picture: Null,
  source: Null,
  audio: Null,
  script: Null,
  style: Null,
};

/**
 * Unified Markdown renderer
 */
const pipeline = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkSpoiler)
  .use(remarkTimestamps)
  .use(remarkChannels)
  .use(remarkMention)
  .use(remarkUnicodeEmoji)
  .use(remarkCustomEmoji)
  .use(remarkHtmlToText)
  .use(remarkRehype, {
    handlers,
  })
  .use(rehypeKatex, {
    maxSize: 10,
    maxExpand: 0,
    trust: false,
    strict: false,
    output: "html",
    throwOnError: false,
    errorColor: "var(--error)",
  })
  .use(rehypePrism);

export interface MarkdownProps {
  content: string;
  disallowBigEmoji?: boolean;
}

export { TextWithEmoji } from "./plugins/emoji";

/**
 * Remark renderer component
 */
export function Markdown(props: MarkdownProps) {
  const file = new VFile();
  file.value = sanitise(props.content);

  const hastNode = pipeline.runSync(pipeline.parse(file), file);

  if (hastNode.type !== "root") {
    throw new TypeError("Expected a `root` node");
  }

  injectEmojiSize(props, hastNode as any);

  return childrenToSolid(
    {
      options: {
        ...defaults,
        components,
      },
      schema: html,
      listDepth: 0,
    },
    // @ts-expect-error this is the correct type
    hastNode
  );
}
