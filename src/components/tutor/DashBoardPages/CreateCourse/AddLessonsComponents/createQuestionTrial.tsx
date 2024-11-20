import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UploadQuestionForm: React.FC = () => {
  const [content, setContent] = useState<string>("");

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Content:", content);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Upload a Coding Question</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            placeholder="Write your question here..."
            theme="snow"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default UploadQuestionForm;
