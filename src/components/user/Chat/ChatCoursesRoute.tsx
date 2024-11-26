import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import userAxios from '../../../utils/axios/userAxios.config';
import { userEndpoint } from '../../../constraints/userEndpoints';
import { getCookie } from '../../../utils/cookieManager';
import { RiArrowDownSLine, RiArrowLeftSLine } from 'react-icons/ri';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

// Course interface
interface Course {
  _id: string;
  courseTitle: string;
  description: string;
  coursePrice: number;
  instructor: string;
  thumbnail: string;
}

// Message interface
interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

// CourseListAndChat Component
const CourseListAndChat: React.FC = () => {
  const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);
  const userId = getCookie('userId');
  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [viewChat, setViewChat] = useState<boolean>(false);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch courses effect
  useEffect(() => {
    const userId = getCookie('userId');
    const fetchCourses = async () => {
      try {
        const response = await userAxios.get(userEndpoint.fetchPurchasedCourses, {params:{userId}})
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);
  console.log(courses, 'purchased courses')
  // Socket connection effect
  useEffect(() => {
    // Connect to socket

    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      auth: {
        token: getCookie('userRefreshToken') 
      }
    });

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected', newSocket.id);
    });
  
    newSocket.on('course_messages', (courseMessages: Message[]) => {
      setMessages(courseMessages);
    });
  
    newSocket.on('new_message', (message: Message) => {
      console.log('triggered emit new_message', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });
  
    setSocket(newSocket);
  
    // Cleanup socket on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleChat = ()=> {
    setViewChat(!viewChat);
  }
  // Join course chat room
  const joinCourseChat = (courseId: string) => {
    socket?.emit('join_course_room', { courseId });
  };

  // Send message handler
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCourse && socket) {
      socket.emit('send_message', {
        courseId: selectedCourse._id,
        content: newMessage
      });
      setNewMessage('');
    }
  };

  // Select course handler
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    joinCourseChat(course._id);
  };
console.log(viewChat, 'view chat')
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
    {isLogin && 
          <button className='fixed bg-purple-600 right-11 bottom-9 text-3xl text-white rounded-full p-3 pointer-events-auto opacity-100 scale-100' onClick={toggleChat}>
          <HiChatBubbleLeftRight />
          </button>
    
    }

  
      {/* Course List Section */}
      {!selectedCourse? (
        <div 
          className={`pointer-events-auto fixed w-96 h-96 right-5 bottom-5 bg-purple-100 p-4 overflow-y-auto rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
            viewChat ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
          }`}
        >
          <div className='flex justify-between'>
            <h2 className="text-xl font-bold mb-4">Descussions</h2>
            <button onClick={()=>{toggleChat()}} className='text-2xl mb-4'> 
            <RiArrowDownSLine />
            </button>
          </div>

      {courses.map(course => (
        <div 
          key={course._id} 
          onClick={() => handleSelectCourse(course)}
          className="flex items-center gap-3 cursor-pointer bg-white shadow-md rounded-lg px-4 py-2 mb-4 hover:bg-purple-100 transition duration-300"
        > 
          <div className='rounded-full h-10 w-10 transition-all duration-300 hover:scale-110 overflow-hidden'>
            <img src={course.thumbnail} alt="" className='h-full w-full object-cover'/>
          </div>
          
          
          <h3 className=" font-semibold">{course.courseTitle}</h3>
        </div>
      ))}
    </div>
      ):
        <>

              {/* Chat Section */}
      <div className=" pointer-events-auto fixed w-96 h-96 right-5 bottom-5 duration-300 ease-in-out bg-white p-4 flex flex-col rounded-lg">
      {selectedCourse ? (
        <>
        <div className='flex items-center mb-4 gap-2 duration-300 ease-in-out'>
            <button onClick={()=> setSelectedCourse(null)} className='h-full'>
              <RiArrowLeftSLine />
            </button>
            <h2 className="text-xl font-bold  h-full">{selectedCourse.courseTitle}</h2>
        </div>

          <div className="flex-grow h-80 overflow-y-auto mb-4 flex flex-col">
            
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`w-3/5 mb-2 p-2 rounded-lg text-sm ${
                  message.userId === userId
                  ? 'bg-purple-600 text-purple-100 self-end' 
                  : 'bg-purple-100 self-start'
                }`}
              >
                <strong>{message.userId === userId ? "You": message.username}</strong>
                <p>{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />

          </div>
          <div className="flex">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l-lg"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a course to start chatting
        </div>
      )}
    </div>

    </>


      }
    </div>
  );
};

export default CourseListAndChat;