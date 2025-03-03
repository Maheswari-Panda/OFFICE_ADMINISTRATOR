import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";

const Feedback = ({ documentId }) => {
  const { getFeedBacksByDocumentId } = useContext(DocumentContext);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchDocumentFeedbacks = async () => {
      const docFeedbacks = await getFeedBacksByDocumentId(documentId);
      if (docFeedbacks) {
        setFeedbacks(docFeedbacks);
      }
    };
    fetchDocumentFeedbacks();
  }, [documentId]);

  return (
    <div className="p-2 w-full flex justify-start items-start"> {/* Align content to the left */}
    <ul className="timeline timeline-vertical w-fit !ml-0"> {/* Ensure no left margin */}
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <li key={index} className="items-start">
            <div className="timeline-start text-xs text-gray-500 w-fit"> {/* Prevent expansion */}
              {new Date(feedback.DateTime).toLocaleDateString()}
              <br />
              {new Date(feedback.DateTime).toLocaleTimeString()}
            </div>
            <div className="timeline-middle">
              <i className="fas fa-circle-check text-blue-500"></i>
            </div>
            <div className="timeline-end timeline-box rounded hover:bg-gray-200 transition duration-300">
              <p className="text-sm">{feedback.FeedbackDescription}</p>
            </div>
            <hr />
          </li>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No feedback available.</p>
      )}
    </ul>
  </div>
  

  );
};

export default Feedback;
