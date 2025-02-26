import React,{memo, useContext, useEffect} from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

import 'react-pdf/dist/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/Page/TextLayer.css';
import '../style/DocumentViewer.css'



const DocumentViewer=(props)=> {
    console.log("The pdf is rendering again");
    const docs = [
        { uri: props.DocPath,
          fileType: props.DocPath.split('.').pop().toLowerCase(),
          fileName: "Uploaded File"
        },
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

export default memo(DocumentViewer);

