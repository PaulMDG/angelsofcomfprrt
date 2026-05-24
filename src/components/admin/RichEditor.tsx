import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { uploadCmsImage } from "@/lib/cms-services";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1 text-[12px] rounded border transition-colors ${
        active
          ? "bg-[var(--navy-deep)] text-[var(--ivory)] border-[var(--navy-deep)]"
          : "bg-white text-[var(--navy-deep)] border-[var(--gold)]/30 hover:border-[var(--gold)]"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = async (file: File) => {
    try {
      const url = await uploadCmsImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (e) {
      alert("Image upload failed: " + (e as Error).message);
    }
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border-b border-[var(--gold)]/20 bg-[var(--cream)]/60">
      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        " Quote
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("link")} onClick={setLink}>
        Link
      </ToolbarButton>
      <ToolbarButton onClick={() => fileRef.current?.click()}>Image</ToolbarButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImage(f);
          e.target.value = "";
        }}
      />
      <div className="flex-1" />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarButton>
    </div>
  );
}

export function RichEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener", target: "_blank" } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Write something thoughtful…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[280px] px-4 py-4 outline-none font-serif text-[18px] leading-relaxed text-[var(--navy-deep)]",
      },
    },
  });

  // Keep editor in sync if external value changes (e.g. after load)
  useEffect(() => {
    if (!editor) return;
    if (value && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-[var(--gold)]/30 rounded-[4px] bg-white overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}