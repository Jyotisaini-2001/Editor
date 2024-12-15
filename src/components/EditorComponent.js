import React from "react";
import { Editor, EditorState, Modifier, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

export default function EditorComponent({ editorState, setEditorState }) {
  // Function to handle the editor state change
  const handleEditorChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const selectionState = newEditorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContentBlock = contentState.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const text = currentContentBlock.getText();

    // Function to apply block style and remove the marker
    const applyMarkerStyle = (newEditorState, marker, blockType) => {
      const markerLength = marker.length;
      const newSelection = selectionState.merge({
        anchorOffset: 0,
        focusOffset: markerLength,
      });

      // Remove the marker and apply the block type
      const contentStateWithRemovedMarker = Modifier.removeRange(
        contentState,
        newSelection,
        "backward"
      );

      const newContentState = Modifier.replaceText(
        contentStateWithRemovedMarker,
        newSelection,
        text.slice(markerLength) // Remove the marker
      );

      const blockContentState = Modifier.setBlockType(
        newContentState,
        newSelection,
        blockType
      );

      return EditorState.push(newEditorState, blockContentState, "change-block-type");
    };

    if (text.startsWith("# ") && start === 2) {
      setEditorState(applyMarkerStyle(newEditorState, "#", "header-one"));
    } else if (text.startsWith("* ") && start === 2) {
      setEditorState(applyMarkerStyle(newEditorState, "*", "bold"));
    } else if (text.startsWith("** ") && start === 3) {
      setEditorState(applyMarkerStyle(newEditorState, "**", "red"));
    } else if (text.startsWith("*** ") && start === 4) {
      setEditorState(applyMarkerStyle(newEditorState, "***", "underline"));
    } else {
      setEditorState(newEditorState);
    }
  };

  const blockStyleFn = (block) => {
    switch (block.getType()) {
      case "header-one":
        return "text-2xl font-bold text-gray-800 capitalize-first-letter";
      case "bold":
        return "font-bold";
      case "red":
        return "text-red-600";
      case "underline":
        return "underline";
      default:
        return "";
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 min-h-[200px] bg-white">
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        placeholder="Type something here..."
        blockStyleFn={blockStyleFn}
      />
    </div>
  );
}
