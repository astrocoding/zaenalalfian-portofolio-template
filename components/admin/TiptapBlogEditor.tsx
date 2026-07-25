"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { CustomImageExtension } from "./CustomImageExtension";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Code2,
  X,
  Upload,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Globe,
} from "lucide-react";

export interface TiptapBlogEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

export const TiptapBlogEditor: React.FC<TiptapBlogEditorProps> = ({
  content,
  onChange,
}) => {
  const [editorMode, setEditorMode] = React.useState<"visual" | "markdown">("visual");
  const [rawMarkdown, setRawMarkdown] = React.useState<string>(content);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [showLinkModal, setShowLinkModal] = React.useState(false);

  // Image modal state
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");
  const [imageAlign, setImageAlign] = React.useState<"left" | "center" | "right">("center");
  const [imageWidth, setImageWidth] = React.useState("100%");
  const [imageUploadTab, setImageUploadTab] = React.useState<"upload" | "url">("upload");
  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Link modal state
  const [linkUrl, setLinkUrl] = React.useState("");

  const lastContentRef = React.useRef<string>(content);

  const [prevContentProp, setPrevContentProp] = React.useState(content);
  if (content !== prevContentProp) {
    setPrevContentProp(content);
    setRawMarkdown(content);
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 space-y-1.5 my-3 text-ink-muted",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 space-y-1.5 my-3 text-ink-muted",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 hover:text-[#993b3d]",
        },
      }),
      CustomImageExtension,
      Markdown.configure({
        html: true,
        transformCopiedText: true,
        transformPastedText: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const storage = editor.storage as { markdown?: { getMarkdown: () => string } };
      const markdownOutput = storage.markdown
        ? storage.markdown.getMarkdown()
        : editor.getHTML();
      lastContentRef.current = markdownOutput;
      setRawMarkdown(markdownOutput);
      onChange(markdownOutput);
    },
    immediatelyRender: false,
  });

  React.useEffect(() => {
    if (editor && content !== lastContentRef.current) {
      lastContentRef.current = content;
      if (content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  const handleRawMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawMarkdown(val);
    onChange(val);
    if (editor) {
      editor.commands.setContent(val);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("files", file);
      body.append("prefix", "blogs");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: body,
      });

      const json = await res.json();
      if (json.success && json.urls && json.urls.length > 0) {
        setImageUrl(json.urls[0]);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInsertImage = () => {
    if (!imageUrl.trim() || !editor) return;
    editor.chain().focus().setImage({
      src: imageUrl,
      alt: imageAlt,
      width: imageWidth as unknown as number,
      alignment: imageAlign,
    } as unknown as { src: string; alt?: string; width?: number; alignment?: string }).run();

    setImageUrl("");
    setImageAlt("");
    setImageAlign("center");
    setImageWidth("100%");
    setShowImageModal(false);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim() || !editor) return;
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setShowLinkModal(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-border-warm rounded-xl overflow-hidden bg-paper shadow-sm">
      {/* Editor Main Header Toolbar */}
      <div className="bg-surface/95 backdrop-blur-md border-b border-border-warm px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        {/* Formatting Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {/* Headings H1, H2, H3 */}
          <div className="flex items-center space-x-1 bg-paper px-1.5 py-1 rounded-lg border border-border-subtle">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 text-xs font-serif font-bold rounded transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Heading 1 (#)"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 text-xs font-serif font-bold rounded transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Heading 2 (##)"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 text-xs font-serif font-bold rounded transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Heading 3 (###)"
            >
              H3
            </button>
          </div>

          <span className="w-px h-5 bg-border-warm my-auto" />

          {/* Bold & Italic */}
          <div className="flex items-center space-x-1 bg-paper px-1.5 py-1 rounded-lg border border-border-subtle">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("bold") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Bold (**text**)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("italic") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Italic (*text*)"
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>

          <span className="w-px h-5 bg-border-warm my-auto" />

          {/* Bullet & Numbered Lists */}
          <div className="flex items-center space-x-1 bg-paper px-1.5 py-1 rounded-lg border border-border-subtle">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("bulletList") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Bullet List (- list)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("orderedList") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Numbered List (1. list)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <span className="w-px h-5 bg-border-warm my-auto" />

          {/* Alignment Left, Center, Right, Justify */}
          <div className="flex items-center space-x-1 bg-paper px-1.5 py-1 rounded-lg border border-border-subtle">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive({ textAlign: "justify" })
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-surface"
              }`}
              title="Align Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <span className="w-px h-5 bg-border-warm my-auto" />

          {/* Quote, Code, Link, Image */}
          <div className="flex items-center space-x-1 bg-paper px-1.5 py-1 rounded-lg border border-border-subtle">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("blockquote") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Blockquote (> quote)"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("codeBlock") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Code Block (```code```)"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive("link") ? "bg-primary text-white" : "text-ink hover:bg-surface"
              }`}
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="p-1.5 rounded text-ink hover:bg-surface transition-colors"
              title="Insert & Upload Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle (Visual vs Raw Markdown) */}
        <div className="flex items-center space-x-1 bg-paper p-1 rounded-lg border border-border-subtle">
          <button
            type="button"
            onClick={() => setEditorMode("visual")}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
              editorMode === "visual"
                ? "bg-primary text-white shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode("markdown")}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
              editorMode === "markdown"
                ? "bg-primary text-white shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw MD</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area with Responsive Max Height & Vertical Scroll */}
      <div className="p-4 sm:p-6 bg-paper min-h-[350px] max-h-[520px] sm:max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-border-warm scrollbar-track-transparent">
        {editorMode === "visual" ? (
          <EditorContent
            editor={editor}
            className="prose max-w-none min-h-[320px] focus:outline-none text-ink font-sans leading-relaxed text-sm sm:text-base
              [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:focus:outline-none
              [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-ink [&_h1]:mt-6 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:font-serif [&_h2]:text-ink [&_h2]:mt-5 [&_h2]:mb-2.5
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:text-ink-muted [&_p]:leading-relaxed [&_p]:mb-3
              [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:space-y-1.5 [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:text-ink-muted
              [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:space-y-1.5 [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:text-ink-muted
              [&_.ProseMirror_li]:leading-relaxed
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:font-serif [&_blockquote]:my-4
              [&_pre]:bg-[#1e1e1e] [&_pre]:text-neutral-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-4"
          />
        ) : (
          <textarea
            rows={16}
            value={rawMarkdown}
            onChange={handleRawMarkdownChange}
            placeholder="Write Markdown content directly here..."
            className="w-full min-h-[320px] max-h-[460px] p-4 rounded-md border border-border-subtle bg-surface text-ink font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y overflow-y-auto"
          />
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper border border-border-warm rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <span>Upload & Format Blog Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Source Tab Selector (Upload File vs External URL) */}
            <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-border-subtle">
              <button
                type="button"
                onClick={() => setImageUploadTab("upload")}
                className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  imageUploadTab === "upload"
                    ? "bg-primary text-white shadow-sm font-semibold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Local File</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUploadTab("url")}
                className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  imageUploadTab === "url"
                    ? "bg-primary text-white shadow-sm font-semibold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>External Image URL</span>
              </button>
            </div>

            <div className="space-y-4">
              {imageUploadTab === "upload" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-medium text-ink">
                    Select Image (Saved to public/upload/img as blogs-[random].webp)
                  </label>
                  <div className="relative border-2 border-dashed border-border-warm rounded-xl p-6 bg-surface hover:border-primary/60 transition-colors text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center space-y-2 text-primary">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-mono font-semibold">
                          Compressing & converting to WebP...
                        </span>
                      </div>
                    ) : imageUrl ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border-subtle shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Uploaded preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Uploaded: {imageUrl}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1.5 text-ink-muted">
                        <UploadCloud className="w-7 h-7 text-primary/70 mb-1" />
                        <span className="text-xs font-semibold text-ink">
                          Click or drag image file here to upload
                        </span>
                        <span className="text-[10px] font-mono">
                          Auto converted to WebP format in public/upload/img/
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-ink">External Image URL *</label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-ink">Alt / Image Caption</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descriptive image caption..."
                  className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Alignment Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-ink">Image Position / Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageAlign("left")}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-colors ${
                      imageAlign === "left"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border-subtle bg-surface text-ink hover:bg-paper"
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("center")}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-colors ${
                      imageAlign === "center"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border-subtle bg-surface text-ink hover:bg-paper"
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Center</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("right")}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-colors ${
                      imageAlign === "right"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border-subtle bg-surface text-ink hover:bg-paper"
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>Right</span>
                  </button>
                </div>
              </div>

              {/* Width / Ratio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-ink">Initial Image Width / Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {["25%", "50%", "75%", "100%"].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setImageWidth(pct)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                        imageWidth === pct
                          ? "border-primary bg-primary text-white font-bold"
                          : "border-border-subtle bg-surface text-ink hover:bg-paper"
                      }`}
                    >
                      {pct}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-xs font-mono text-ink-muted hover:text-ink rounded-lg border border-border-subtle hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!imageUrl.trim() || uploadingImage}
                onClick={handleInsertImage}
                className="px-4 py-2 text-xs font-mono bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Insert Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper border border-border-warm rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                <span>Insert Hyperlink</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">Target URL</label>
              <input
                type="url"
                required
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-mono text-ink-muted hover:text-ink rounded-lg border border-border-subtle hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 text-xs font-mono bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
