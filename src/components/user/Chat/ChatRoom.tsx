import React, { useEffect, useState } from "react";
import SocketService from "../../../services/socketService";
import { getCookie } from "../../../utils/cookieManager";

interface ChatPopupProps {
  token: string;
  courses: { courseId: string; courseTitle: string }[]; // List of courses
  isOpen: boolean;
  onClose: () => void;
}

export interface Message {
  userId: string;
  name: string;
  content?: string;
  image?: string;
  profilePicture?: string;
}


const ChatPopup: React.FC<ChatPopupProps> = ({ token, courses, isOpen, onClose }) => {
  const [currentCourse, setCurrentCourse] = useState<{ courseId: string; courseTitle: string } | null>( null );
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);

  

  useEffect(() => {
    if (currentCourse) {
      const courseId = currentCourse.courseId;
      SocketService.joinRoom(courseId);
      SocketService.loadPreviousMessages("loadPreviousMessages", (previousMessages) => {
        const mappedMessages = previousMessages.map((msg: Message) => ({
          userId: msg.userId,
          userName: msg.name,
          // image: msg.image,
          text: msg.content,
          // profilePicture: msg.profilePicture,
        }));
        setMessages((prevMessages) => ({
          ...prevMessages,
          [courseId]: mappedMessages,
        }));
      });
    }
    return () => {
      if (currentCourse) SocketService.leaveRoom(currentCourse.courseId);
    };
  }, [currentCourse]);











  const sendMessage = () => {
    const userId = getCookie('userId');
    console.log('sending message')
    if (currentCourse && newMessage.trim() && userId) {
        console.log('pote right')
        const sendMessage = {userId , content: newMessage, courseId: currentCourse.courseId};
        SocketService.sendMessage(currentCourse.courseId, sendMessage);
        setNewMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 right-5 bottom-5  bg-opacity-50 flex items-end justify-end z-50">
      <div className="bg-white  rounded-lg shadow-lg p-4 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
        {!currentCourse ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Course</h2>
            <ul className="space-y-2">
              {courses.map((course) => (
                <li key={course.courseId}>
                  <button
                    onClick={() => setCurrentCourse(course)}
                    className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {course.courseTitle}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setCurrentCourse(null)}
              className="text-purple-600 hover:underline mb-4"
            >
              Back to Courses
            </button>
            <h2 className="text-xl font-semibold mb-4">{currentCourse.courseTitle} Chat Room</h2>
            <div className="border border-gray-300 rounded-lg p-2 h-64 overflow-y-auto mb-4">
              {/* {messages.map((msg, index) => (
                <p key={index} className="text-sm text-gray-800">
                  {msg}
                </p>
              ))} */}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow border border-gray-300 rounded-lg p-2"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPopup;
