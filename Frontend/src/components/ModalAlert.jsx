import { useState } from "react";

const ModalAlert = ({modalRef,heading,description,btnText1,btnText2}) => {

  return (
    <div>
      <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()} ref={modalRef} hidden>open modal</button>
<dialog id="my_modal_1" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg text-blue-500">{heading}</h3>
    <p className="py-4">{description}</p>
    <div className="modal-action">
      <form method="dialog" className="flex gap-1">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm bg-blue-500 text-white hover:blue-600">{btnText1}</button>
        <button className="btn btn-sm bg-red-500 text-white hover:red-600">{btnText2}</button>
      </form>
    </div>
  </div>
</dialog>
    </div>
  );
};

export default ModalAlert;
