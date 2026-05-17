import { Image as BaseImage } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export const CustomImageExtension = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => {
          if (element.style?.width) return element.style.width;
          const dataWidth = element.getAttribute("data-width");
          if (dataWidth) return dataWidth;
          const imgInside = element.querySelector?.("img");
          if (imgInside && imgInside.style?.width) return imgInside.style.width;
          return "100%";
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            "data-width": attributes.width,
          };
        },
      },
      alignment: {
        default: "center",
        parseHTML: (element) => {
          const dataAlign = element.getAttribute("data-align");
          if (dataAlign) return dataAlign;
          if (element.style?.textAlign) return element.style.textAlign;
          const parent = element.parentElement;
          if (parent && (parent.style?.textAlign || parent.getAttribute("data-align"))) {
            return parent.style.textAlign || parent.getAttribute("data-align") || "center";
          }
          return "center";
        },
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.alignment || "center",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-img-wrapper]",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const img = el.querySelector("img");
          if (!img) return false;
          const alignment = el.getAttribute("data-align") || el.style.textAlign || "center";
          const width = img.style.width || el.getAttribute("data-width") || "100%";
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            alignment,
            width,
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          const img = element as HTMLElement;
          const parent = img.parentElement;
          let alignment = img.getAttribute("data-align") || "center";
          if (parent && (parent.style?.textAlign || parent.getAttribute("data-align"))) {
            alignment = parent.style.textAlign || parent.getAttribute("data-align") || alignment;
          } else if (img.getAttribute("align")) {
            alignment = img.getAttribute("align") || alignment;
          }
          const width = img.style.width || img.getAttribute("data-width") || "100%";
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            alignment,
            width,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { alignment = "center", width = "100%", ...rest } = HTMLAttributes;
    const textAlign = alignment || "center";
    const widthStyle = width.endsWith("%") || width.endsWith("px") ? width : `${width}%`;

    let marginStyle = "margin-left: auto; margin-right: auto;";
    if (textAlign === "left") marginStyle = "margin-left: 0; margin-right: auto;";
    if (textAlign === "right") marginStyle = "margin-left: auto; margin-right: 0;";

    return [
      "img",
      {
        ...rest,
        "data-align": textAlign,
        "data-width": widthStyle,
        style: `max-width: 100%; width: ${widthStyle}; height: auto; display: block; ${marginStyle} border-radius: 0.5rem;`,
      },
    ];
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const { src, alt, title, alignment = "center", width = "100%" } = node.attrs;
          if (!src) return;
          const altStr = alt ? ` alt="${state.esc(alt)}"` : "";
          const titleStr = title ? ` title="${state.esc(title)}"` : "";
          const widthStr = width.endsWith("%") || width.endsWith("px") ? width : `${width}%`;

          let marginStyle = "margin-left: auto; margin-right: auto;";
          if (alignment === "left") marginStyle = "margin-left: 0; margin-right: auto;";
          if (alignment === "right") marginStyle = "margin-left: auto; margin-right: 0;";

          state.write(
            `<img src="${state.esc(
              src
            )}"${altStr}${titleStr} data-align="${alignment}" data-width="${widthStr}" style="max-width: 100%; width: ${widthStr}; height: auto; display: block; ${marginStyle} border-radius: 0.5rem;" />`
          );
          state.closeBlock(node);
        },
        parse: {
          // Handled via parseHTML rules
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
