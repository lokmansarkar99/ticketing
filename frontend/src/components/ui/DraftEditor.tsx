import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEditorConfig } from "@/utils/helpers/useEditorConfig";
import { editorEmojis } from "@/utils/helpers/editorEmojis";

interface DraftEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<{ data: { link: string } }>;
  readOnly?: boolean;
  customToolbar?: any;
  className?: string;
  maxContentHeight?: string;
}

const DraftEditor = ({
  value,
  onChange,
  height = "300px",
  placeholder = "Start typing...",
  onImageUpload,
  readOnly = false,
  customToolbar,
  className = "",
  maxContentHeight,
}: DraftEditorProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isToolbarFixed, setIsToolbarFixed] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { toolbar, uploadImageCallBack } = useEditorConfig(onImageUpload);
  const isInitialMount = useRef(true);

  // Load initial content
  useEffect(() => {
    if (value && isInitialMount.current) {
      try {
        const blocksFromHtml = htmlToDraft(value);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      } catch (error) {
        console.error("Error parsing HTML content:", error);
      }
      isInitialMount.current = false;
    }
  }, [value]);

  // Scroll-based toolbar positioning
  useEffect(() => {
    const handleScroll = () => {
      if (!toolbarRef.current || !editorRef.current) return;
      const editorTop = editorRef.current.getBoundingClientRect().top;
      setIsToolbarFixed(editorTop < 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onEditorStateChange = useCallback(
    (newState: EditorState) => {
      setEditorState(newState);
      if (onChange) {
        const content = newState.getCurrentContent();
        const html = draftToHtml(convertToRaw(content));
        onChange(html);
      }
    },
    [onChange]
  );

  const finalToolbar = {
    ...toolbar,
    emoji: {
      ...toolbar.emoji,
      emojis: editorEmojis,
    },
    image: {
      ...toolbar.image,
      uploadCallback: uploadImageCallBack,
    },
    ...customToolbar,
  };

  return (
    <>
      <div id="editor-modals-root" />
      <div
        ref={editorRef}
        className={`editor-wrapper bg-white ${className}`}
        style={
          {
            "--editor-height": height,
            ...(maxContentHeight && {
              "--max-content-height": maxContentHeight,
            }),
          } as React.CSSProperties
        }
        dir="ltr"
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          placeholder={placeholder}
          readOnly={readOnly}
          toolbarClassName={`toolbar-class ${
            isToolbarFixed ? "toolbar-fixed" : ""
          }`}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbar={finalToolbar}
        //@ts-ignore
          toolbarRef={toolbarRef}
          stripPastedStyles={false}
          spellCheck
          textAlignment="left"
          textDirectionality="ltr"
          defaultTextAlignment="left"
          defaultTextDirection="ltr"
          editorStyle={{
            direction: "ltr",
            textAlign: "left",
          }}
          handlePastedText={(html) => {
            if (!html) return false;

            try {
              const blocksFromHtml = htmlToDraft(html);
              const contentState = ContentState.createFromBlockArray(
                blocksFromHtml.contentBlocks,
                blocksFromHtml.entityMap
              );
              const newEditorState = EditorState.push(
                editorState,
                contentState,
                "insert-fragment"
              );
              onEditorStateChange(newEditorState);
              return true;
            } catch (e) {
              console.error("Error handling pasted HTML:", e);
              return false;
            }
          }}
        />
      </div>
    </>
  );
};

export default DraftEditor;
