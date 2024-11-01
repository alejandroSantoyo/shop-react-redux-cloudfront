import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError, AxiosResponse } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;
    console.log("uploadFile to", url);

    try {
      // Get the presigned URL
      const response: AxiosResponse<{ url: string }> = await axios({
        method: "GET",
        url,
        params: {
          fileName: encodeURIComponent(file.name),
        },
      });

      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      const { url: presignedUrl } = response.data

      const result = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          'Content-Type': 'text/csv'
        }
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      console.error("Uploading ERROR:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
