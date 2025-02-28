import { useEffect, useState } from "react";

const ModalAlert = ({
  modalRef,
  heading,
  description,
  btnText1,
  btnText2,
  feedbackform,
  onClickBtn,
}) => {
  const [feedback, setFeedback] = useState("");

  // console.log(feedback);
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
          {feedbackform && (
            <textarea
              rows={3}
              className="border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-0 focus:ring-blue-500 p-2 rounded w-full resize-none"
              style={{ outline: "none" }}
              placeholder="write some feebback..."
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          )}
          <div className="modal-action">
            <form method="dialog" className="flex gap-1">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm bg-red-500 text-white hover:blue-600">
                {btnText1}
              </button>
              <button
                className="btn btn-sm bg-blue-500 text-white hover:red-600"
                onClick={() => {
                  onClickBtn(feedback); // Call the function to handle feedback
                  setFeedback(""); // Reset textarea after submission
                }}
              >
                {btnText2}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAlert;
