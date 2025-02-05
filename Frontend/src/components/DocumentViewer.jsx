import React from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import 'react-pdf/dist/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/Page/TextLayer.css';

function DocumentViewer(props) {
    
    const docs = [
        {uri: props.DocPath},
        // { uri: "http://localhost:3000/uploads/UserProfiles/1738165682318.png"},
        // { uri: "https://pdfobject.com/pdf/sample.pdf"}
      ];
      return (
        <>
      
            <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={docs}
            />
      </>
      );
}

export default DocumentViewer