/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo } from "react";
import { optimizeImage } from "./imageUtils";

export const useEditorConfig = (onImageUpload:any) => {
  const uploadImageCallBack = useCallback(
    async (file:any) => {
      try {
        const optimizedImage = await optimizeImage(file);
        const uploadResult = onImageUpload
          ? await onImageUpload(optimizedImage.blob)
          : null;

        return {
          data: {
            link: uploadResult?.url || URL.createObjectURL(optimizedImage.blob),
            width: optimizedImage.width,
            height: optimizedImage.height,
            aspectRatio: optimizedImage.aspectRatio,
          },
        };
      } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
      }
    },
    [onImageUpload]
  );

  const toolbar = useMemo(
    () => ({
      options: [
        "blockType",
        "fontSize",
        "fontFamily",
        "inline",
        "textAlign",
        "colorPicker",
        "list",
        "link",
        "embedded",
        "emoji",
        "image",
        "remove",
        "history",
      ],
      blockType: {
        inDropdown: true,
        options: [
          "Normal",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "Blockquote",
          "Code",
        ],
        className: "toolbar-dropdown heading-dropdown",
        dropdownClassName: "toolbar-dropdown-option",
        title: "Heading",
      },
      fontSize: {
        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
        className: "toolbar-dropdown",
        dropdownClassName: "toolbar-dropdown-option",
        title: "Font Size",
      },
      fontFamily: {
        options: [
          "Arial",
          "Georgia",
          "Impact",
          "Tahoma",
          "Times New Roman",
          "Verdana",
          "Roboto",
          "Inter",
          "Poppins",
        ],
        className: "toolbar-dropdown",
        dropdownClassName: "toolbar-dropdown-option",
        title: "Font Family",
      },
      inline: {
        options: [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "monospace",
          "superscript",
          "subscript",
        ],
        bold: { className: "toolbar-button", title: "Bold" },
        italic: { className: "toolbar-button", title: "Italic" },
        underline: { className: "toolbar-button", title: "Underline" },
        strikethrough: { className: "toolbar-button", title: "Strikethrough" },
        monospace: { className: "toolbar-button", title: "Monospace" },
        superscript: { className: "toolbar-button", title: "Superscript" },
        subscript: { className: "toolbar-button", title: "Subscript" },
      },
      textAlign: {
        inDropdown: false,
        className: "toolbar-button-group",
        options: ["left", "center", "right", "justify"],
        left: { className: "toolbar-button", title: "Align Left" },
        center: { className: "toolbar-button", title: "Align Center" },
        right: { className: "toolbar-button", title: "Align Right" },
        justify: { className: "toolbar-button", title: "Justify" },
      },
      colorPicker: {
        className: "toolbar-button color-picker",
        popupClassName: "toolbar-popup color-picker-popup",
        colors: [
          "rgb(97,189,109)",
          "rgb(26,188,156)",
          "rgb(84,172,210)",
          "rgb(44,130,201)",
          "rgb(147,101,184)",
          "rgb(71,85,119)",
          "rgb(204,204,204)",
          "rgb(65,168,95)",
          "rgb(0,168,133)",
          "rgb(61,142,185)",
          "rgb(41,105,176)",
          "rgb(85,57,130)",
          "rgb(40,50,78)",
          "rgb(0,0,0)",
          "rgb(247,218,100)",
          "rgb(251,160,38)",
          "rgb(235,107,86)",
          "rgb(226,80,65)",
          "rgb(163,143,132)",
          "rgb(239,239,239)",
          "rgb(255,255,255)",
          "rgb(250,197,28)",
          "rgb(243,121,52)",
          "rgb(209,72,65)",
          "rgb(184,49,47)",
          "rgb(124,112,107)",
          "rgb(209,213,216)",
        ],
      },
      list: {
        inDropdown: false,
        className: "toolbar-button-group",
        options: ["unordered", "ordered", "indent", "outdent"],
        unordered: { className: "toolbar-button", title: "Unordered List" },
        ordered: { className: "toolbar-button", title: "Ordered List" },
        indent: { className: "toolbar-button", title: "Increase Indent" },
        outdent: { className: "toolbar-button", title: "Decrease Indent" },
      },
      link: {
        inDropdown: false,
        className: "toolbar-button-group",
        popupClassName: "toolbar-popup link-popup",
        showOpenOptionOnHover: true,
        defaultTargetOption: "_blank",
        options: ["link", "unlink"],
        link: {
          className: "toolbar-button",
          title: "Add Link",
        },
        unlink: {
          className: "toolbar-button",
          title: "Remove Link",
        },
        linkCallback: (url:any) => {
          // Validate URL format
          try {
            new URL(url);
            return true;
          } catch (e) {
            return false;
          }
        },
      },
      emoji: {
        className: "toolbar-button",
        popupClassName: "toolbar-popup emoji-popup",
        emojis: [],
      },
      embedded: {
        className: "toolbar-button",
        popupClassName: "toolbar-popup embedded-popup",
        defaultSize: {
          height: "auto",
          width: "auto",
        },
      },
      image: {
        className: "toolbar-button",
        popupClassName: "toolbar-popup image-popup",
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        
        uploadCallback: uploadImageCallBack,
        previewImage: true,
        inputAccept:
          "image/gif,image/jpeg,image/jpg,image/png,image/svg,image/webp",
        alt: { present: true, mandatory: true },
        defaultSize: {
          height: "auto",
          width: "100%",
        },
      },
      remove: { className: "toolbar-button" },
      history: {
        inDropdown: false,
        className: "toolbar-button-group",
        options: ["undo", "redo"],
        undo: { className: "toolbar-button", title: "Undo" },
        redo: { className: "toolbar-button", title: "Redo" },
      },
    }),
    [uploadImageCallBack]
  );

  return {
    toolbar,
    uploadImageCallBack,
 };
};