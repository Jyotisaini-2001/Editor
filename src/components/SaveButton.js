/** @format */

import React from "react";

export default function SaveButton({ onSave }) {
  return (
    <div>
      <button
        onClick={onSave}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Save
      </button>
    </div>
  );
}
