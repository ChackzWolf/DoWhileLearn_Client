declare module "react-quill" {
    import React from "react";
  
    interface ReactQuillProps {
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      theme?: string;
      modules?: Record<string, any>;
      formats?: string[];
    }
  
    class ReactQuill extends React.Component<ReactQuillProps> {}
    export default ReactQuill;
  }
  