"use client";

import * as React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight, Trash2, Maximize2 } from "lucide-react";

export const ImageNodeView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width = "100%", alignment = "center" } = node.attrs;

  const [isResizing, setIsResizing] = React.useState(false);
  const [prevWidthProp, setPrevWidthProp] = React.useState<string>(width);
  const [currentWidth, setCurrentWidth] = React.useState<string>(width);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (width !== prevWidthProp) {
    setPrevWidthProp(width);
    setCurrentWidth(width);
  }

  const handleAlign = (newAlign: "left" | "center" | "right") => {
    updateAttributes({ alignment: newAlign });
  };

  const handleWidthChange = (newWidthPct: number) => {
    const formattedWidth = `${newWidthPct}%`;
    setCurrentWidth(formattedWidth);
    updateAttributes({ width: formattedWidth });
  };

  const handleDeleteImage = async () => {
    if (src && (src.startsWith("/upload/img/") || src.includes("upload/img"))) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(src)}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete physical image file:", error);
      }
    }
    deleteNode();
  };

  // Drag resizer handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidthPx = imageRef.current ? imageRef.current.clientWidth : 300;
    const parentWidthPx = containerRef.current ? containerRef.current.clientWidth : 800;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidthPx = startWidthPx + deltaX;
      let newPct = Math.round((newWidthPx / parentWidthPx) * 100);
      if (newPct < 15) newPct = 15;
      if (newPct > 100) newPct = 100;
      const formatted = `${newPct}%`;
      setCurrentWidth(formatted);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (imageRef.current && containerRef.current) {
        const finalPct = Math.round(
          (imageRef.current.clientWidth / containerRef.current.clientWidth) * 100
        );
        updateAttributes({ width: `${Math.min(100, Math.max(15, finalPct))}%` });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const alignClass =
    alignment === "left"
      ? "text-left justify-start"
      : alignment === "right"
      ? "text-right justify-end"
      : "text-center justify-center";

  return (
    <NodeViewWrapper className="my-6">
      <div ref={containerRef} className={`w-full flex ${alignClass} group relative`}>
        {/* Outer Image Node Wrapper (NO overflow-hidden here, enabling floating toolbar to float freely without clipping!) */}
        <div
          className="relative inline-block max-w-full"
          style={{ width: currentWidth, maxWidth: "100%" }}
        >
          {/* High-Contrast Floating Controls Overlay */}
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 bg-paper/95 backdrop-blur-md text-ink px-3 py-1.5 rounded-xl shadow-xl border border-border-warm flex items-center space-x-2 z-20 transition-all ${
              selected
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
            }`}
          >
            {/* Align Buttons */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleAlign("left")}
                title="Align Left"
                className={`p-1.5 rounded-lg transition-all ${
                  alignment === "left"
                    ? "text-white bg-primary shadow-sm font-bold"
                    : "text-ink-muted hover:text-ink hover:bg-surface"
                }`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAlign("center")}
                title="Align Center"
                className={`p-1.5 rounded-lg transition-all ${
                  alignment === "center"
                    ? "text-white bg-primary shadow-sm font-bold"
                    : "text-ink-muted hover:text-ink hover:bg-surface"
                }`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAlign("right")}
                title="Align Right"
                className={`p-1.5 rounded-lg transition-all ${
                  alignment === "right"
                    ? "text-white bg-primary shadow-sm font-bold"
                    : "text-ink-muted hover:text-ink hover:bg-surface"
                }`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            <span className="w-px h-5 bg-border-warm my-auto" />

            {/* Quick Size Presets */}
            <div className="flex items-center space-x-1">
              {["25%", "50%", "75%", "100%"].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleWidthChange(parseInt(pct))}
                  className={`text-[11px] font-mono font-bold px-2 py-1 rounded-md border transition-all ${
                    currentWidth === pct
                      ? "text-white bg-primary border-primary shadow-sm"
                      : "text-ink border-border-subtle bg-surface hover:bg-paper hover:border-primary/50"
                  }`}
                >
                  {pct}
                </button>
              ))}
            </div>

            <span className="w-px h-5 bg-border-warm my-auto" />

            {/* Delete Node & Physical File */}
            <button
              type="button"
              onClick={handleDeleteImage}
              title="Delete Image & Physical File"
              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Actual Image Box with rounded corners and selection ring */}
          <div
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              selected ? "border-primary ring-4 ring-primary/20 shadow-lg" : "border-transparent"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={src}
              alt={alt || ""}
              className="w-full h-auto object-cover rounded-lg block"
            />
          </div>

          {/* Resize Handle Dragging Dot */}
          <div
            onMouseDown={handleMouseDown}
            className={`absolute bottom-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center cursor-se-resize shadow-lg hover:scale-125 transition-transform z-30 ${
              selected || isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            title="Drag to resize image width"
          >
            <Maximize2 className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
