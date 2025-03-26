import React, { memo, useMemo, useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../style/DocumentViewer.css";

const DocumentViewer = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  const docs = useMemo(() => {
    const documentArray = [];

    if (props.DocPath) {
      documentArray.push({
        uri: props.DocPath,
        fileType: "pdf",
        fileName: "Uploaded File",
      });
    }

    if (props.attachedDocPath) {
      documentArray.push({
        uri: props.attachedDocPath,
        fileType: "pdf",
        fileName: "Attached Document",
      });
    }

    return documentArray;
  }, [props.DocPath, props.attachedDocPath]);

  useEffect(() => {
    if (docs.length > 0) {
      setIsLoading(false);
    }
  }, [docs]);

  // console.log("Documents:", docs);

  if (isLoading) {
    return <p>Loading documents...</p>; // Show loading text until docs are ready
  }

  return (
    <DocViewer
      pluginRenderers={DocViewerRenderers}
      documents={docs}
      key={JSON.stringify(docs)}
    />
  );
};

export default memo(DocumentViewer);
