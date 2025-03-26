import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";
import userContext from "../context/user/userContext";

const Feedback = ({ documentId }) => {
  const { getFeedBacksByDocumentId} = useContext(DocumentContext);
  const {user} = useContext(userContext);
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
    <div className="p-2 w-full flex flex-col gap-4 max-h-60 overflow-y-scroll">
  {feedbacks.length > 0 ? (
    feedbacks.map((feedback, index) => (
      <div key={index} className={`chat ${feedback.SenderId === user.UserId ? 'chat-end' : 'chat-start'}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User Avatar"
              src={feedback.SenderProfileImageUrl}
            />
          </div>
        </div>
        <div className="chat-header">
          {feedback.SenderName}
          <time className="text-xs opacity-50 ml-1">
            {new Date(feedback.DateTime).toLocaleTimeString()}
          </time>
        </div>
        <div className="chat-bubble">{feedback.FeedbackDescription}</div>
        <div className="chat-footer opacity-50">{new Date(feedback.DateTime).toLocaleDateString()}</div>
      </div>
    ))
  ) : (
    <p className="text-gray-400 text-sm">No feedback available.</p>
  )}
</div>
  

  );
};

export default Feedback;
