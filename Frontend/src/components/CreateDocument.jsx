import React, { useMemo, useRef, useState } from 'react'
import JoditEditor from "jodit-react"

function CreateDocument() {
    const editor=useRef(null);
    const [content,setContent]=useState('<p style="text-align: center;"><img src="https://upload.wikimedia.org/wikipedia/en/b/bf/Msu_baroda_logo.png" alt="MSU LOGO" width="174" height="175" style="display: block; margin-left: auto; margin-right: auto;"><strong>THE MAHARAJA SAYAJIRAO UNIVERSITY OF BARODA</strong></p><p style="text-align: center;"><strong>COMPUTER CENTER</strong></p><p style="text-align: center;"><strong><br></strong></p><p style="text-align: left;">Start writing.....,<br></p>');
    
  return (
    <>
        <div className='w-full h-full'>
        <JoditEditor
            ref={editor}
            value={content}
            onChange={newContent=>setContent(newContent)}
        />
        </div>
    </>
  )
}

export default CreateDocument