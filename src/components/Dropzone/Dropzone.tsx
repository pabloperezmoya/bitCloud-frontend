import React from "react";
import { useDropzone } from "react-dropzone";
import { handleFileSelected } from "../NewButton/NewButton";

const Dropzone = ({ children, ctxt, state, dispatch, toast }) => {
  const onDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      handleFileSelected(acceptedFiles[0], ctxt, state, dispatch, toast);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive
          ? {
              border: "10px dashed #bee3f8",
              borderRadius: "20px",
              padding: "10px",
            }
          : {}
      }
    >
      {isDragActive && (
        <input {...getInputProps()} style={{ display: "none" }} />
      )}
      {children}
    </div>
  );
};

export default Dropzone;
