import React, { memo } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import '../style/DocumentPreview.css';

import 'react-pdf/dist/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/Page/TextLayer.css';

const DocumentPreview = (props) => {
    console.log("The pdf is rendering again");
    const docs = [
        {uri: props.docpath},
    ];
    
    return (
        <>
            <DocViewer
                pluginRenderers={DocViewerRenderers}
                documents={docs}
            />
        </>
    );
};

export default memo(DocumentPreview);
