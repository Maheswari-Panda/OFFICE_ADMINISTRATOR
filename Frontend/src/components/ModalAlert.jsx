import { useEffect, useState } from "react";

const ModalAlert = ({
  modalRef,
  heading,
  description,
  btnText1,
  btnText2,
  feedbackform,
  onClickBtn,
  extraComponent,
}) => {
  const [feedback, setFeedback] = useState("");

  // Reset feedback when modal opens or closes
  useEffect(() => {
    const modal = document.getElementById("my_modal_1");

    const handleModalClose = () => setFeedback(""); // Reset feedback when modal closes

    modal.addEventListener("close", handleModalClose);
    
    return () => {
      modal.removeEventListener("close", handleModalClose);
    };
  }, []);

  return (
    <div>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_1").showModal()}
        ref={modalRef}
        hidden
      >
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-blue-500">{heading}</h3>
          <p className="py-4">{description}</p>
          {extraComponent}
          {feedbackform && (
            <textarea
              rows={3}
              className="border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-0 focus:ring-blue-500 p-2 rounded w-full resize-none"
              style={{ outline: "none" }}
              placeholder="Write some feedback..."
              value={feedback} // Controlled input
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          )}
          <div className="modal-action">
            <form method="dialog" className="flex gap-1">
              {/* Close button */}
              {btnText1 && <button className="btn btn-sm bg-red-500 text-white hover:blue-600" >
                {btnText1}
              </button>}
              {/* Approve/Return button */}
              {btnText2 && <button
                type="button"
                className="btn btn-sm bg-blue-500 text-white hover:red-600"
                onClick={() => {
                  if(feedbackform){
                    onClickBtn(feedback); // Call the function to handle feedback
                    setFeedback(""); // Reset textarea after submission
                    document.getElementById("my_modal_1").close(); // Manually close the modal
                  }else{
                    document.getElementById("my_modal_1").close();
                  }
                }}
              >
                {btnText2}
              </button>}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAlert;
