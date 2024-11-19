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
  const [error, setError] = React.useState<String | null>(null);

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
      const response = await fetch('https://wpzc6au01c.execute-api.us-east-1.amazonaws.com/prod/import?fileName=test.csv', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
      })

      if (!response.ok) {
        console.log(response.status)
        throw new Error(response.status.toString());
      }

      const { url: presignedUrl } = await response.json();

      const result = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          'Content-Type': 'text/csv'
        }
      });

      console.log("Result: ", result);
      
      setFile(undefined);
      setError(null);
    } catch (error: any) {
      console.trace("error message", error)
      if (error.message === "401") {
        setError("Unauthorized, please log in");
      } else if (error.message === "403") {
        setError("Forbidden, you don't have access to this!")
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6" gutterBottom color={"red"}>
        {error}
      </Typography>
      {!file ? (
        <input type="file" accept="text/csv" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
