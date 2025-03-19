import React,{memo, useContext, useEffect, useMemo} from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

import 'react-pdf/dist/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/Page/TextLayer.css';
import '../style/DocumentViewer.css'



const DocumentViewer=(props)=> {
    // console.log(props.DocPath);
    const docs = useMemo(() => {
      const documentArray = [
        { 
          uri: props.DocPath,
          fileType: props.DocPath?.split('.').pop().toLowerCase(),
          fileName: "Uploaded File",
        },
      ];
  
      if (props.attachedDocPath) {
        documentArray.push({
          uri: props.attachedDocPath,
          fileType: props.attachedDocPath.split('.').pop().toLowerCase(),
          fileName: "Attached Document",
        });
      }
  
      return documentArray;
    }, [props.DocPath, props.attachedDocPath]);

      return (
        <>
           <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={docs}
            key={docs.length}
            />
      </>
      );
}

export default memo(DocumentViewer);

