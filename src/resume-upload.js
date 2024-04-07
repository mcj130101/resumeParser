import React, { useState } from "react";
import axios from "axios";
const downloadURL = "https://flask-backend-wilc.onrender.com/download";
const ResumeUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

 async function downloadFile(url) {
   try {
     const response = await axios.get(url, { responseType: "blob" });

     // Get the filename from the response headers (optional)
     const filename =
       response.headers["content-disposition"]?.split("filename=")[1]?.trim() ||
       "download.xls";

     const blob = new Blob([response.data], {
       type: response.headers["content-type"],
     });

     const link = document.createElement("a");
     link.href = URL.createObjectURL(blob);
     link.download = filename;
     link.click();
   } catch (error) {
     console.error("Error downloading file:", error);
     // Handle error appropriately
   }
 }

  const handleUpload = async () => {
    setUploadStatus("uploading");
    const formData = new FormData();

    for (const file of selectedFiles) {
      formData.append("files[]", file);
    }

    try {
      const response = await axios.post(
        "https://flask-backend-wilc.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus("success");
      console.log(response);
      if(response.status === 200) {
        setIsDownloadable(true);
      }
    } catch (error) {
      setUploadStatus("failed");
      console.error(error); // Log any errors during upload
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-lg-center flex-column"
      style={{ width: "100%", height: "100vh" }}
    >
      <form className="form-group m-3">
        <label className="form-label" htmlFor="input">
          Select Resume Files
        </label>
        <input
          className="form-control"
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </form>
      <button className="btn btn-secondary " onClick={handleUpload} disabled={!selectedFiles.length}>
        Upload Resumes
      </button>
      {isDownloadable && <button className="btn btn-success my-3" onClick={() => downloadFile(downloadURL)}>Download File</button>}
      {uploadStatus === "uploading" && <p>Uploading...</p>}
      {uploadStatus === "success" && <p>Upload successful!</p>}
      {uploadStatus === "failed" && <p>Upload failed! Please try again.</p>}
    </div>
  );
};

export default ResumeUpload;
