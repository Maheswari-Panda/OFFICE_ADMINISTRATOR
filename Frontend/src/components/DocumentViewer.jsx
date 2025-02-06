import React,{memo} from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import 'react-pdf/dist/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/Page/TextLayer.css';



const DocumentViewer=(props)=> {
    console.log("The pdf is rendering again");
    const docs = [
        {uri: props.DocPath},
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

