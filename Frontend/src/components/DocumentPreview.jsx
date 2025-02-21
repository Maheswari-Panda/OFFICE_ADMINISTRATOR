import React, { memo, useMemo } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import '../style/DocumentPreview.css';

// import 'react-pdf/dist/Page/AnnotationLayer.css'; 
// import 'react-pdf/dist/Page/TextLayer.css';

const DocumentPreview = ({ docpath }) => {
    console.log("The pdf is rendering again");

    const docs = useMemo(() => [{ uri: docpath }], [docpath]);

    return (
        <div className="document-preview">
            <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={docs}
        />
        </div>
    );
};

export default memo(DocumentPreview);
