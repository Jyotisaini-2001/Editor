/** @format */

import React, { useState, useEffect } from "react";
import TitleComponent from "./components/TitleComponent";
import SaveButton from "./components/SaveButton";
import EditorComponent from "./components/EditorComponent";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    console.log("Saved Content");
  };

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      try {
        const rawContent = JSON.parse(savedContent);
        const contentState = convertFromRaw(rawContent);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error(
          "Failed to load editor content from localStorage:",
          error
        );
      }
    }
  }, []);

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex items-center justify-between">
        <div className="md:flex-1 text-left md:text-center">
          <TitleComponent />
        </div>
        <div className="ml-auto">
          <SaveButton onSave={handleSave} />
        </div>
      </div>

      <EditorComponent
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
}

export default App;
