import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getCookie } from '../../../utils/cookieManager';
import { RiArrowDownSLine, RiArrowLeftSLine } from 'react-icons/ri';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import  Picker ,{EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { BsEmojiSunglasses } from 'react-icons/bs';

// Course interface
interface ChatRoom {
  courseId: string;
  _id: string;
  name: string;
  instructor: string;
  thumbnail: string;
  updatedAt:string;
  lastMessage?: {
    userId: string;
    username: string;
    content: string;
  };
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
  const [selectedCourse, setSelectedCourse] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [viewChat, setViewChat] = useState<boolean>(false);
  const [chatRoomsList, setChatRoomsList] = useState<ChatRoom[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(chatRoomsList, 'chatroom lists')


  // Socket connection effect
  useEffect(() => {

    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      auth: {
        token: getCookie('userRefreshToken') 
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected', newSocket.id);
    });
    newSocket.on('chat_rooms',(chatRooms:any)=>{
      console.log(chatRooms,'These are chat rooms');
    })
  
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
    socket?.emit('join_course_room', { courseId,userId });
  };

  useEffect(() => {
    if (viewChat) {
      socket?.emit("get_chat_rooms", {userId}, (response: any) => {

        console.log("map 1 chat room 4", response);
  
        // Destructure the `chatRooms` array
        const chatRoomsArray = response.chatRooms;
        console.log(chatRoomsArray, 'hcat rooms array')
  
        // Create a mapping for easy access

        setChatRoomsList(chatRoomsArray);
        console.log("merged courses", chatRoomsList);
      });
    }
  }, [viewChat, messages]);

  
  // Send message handler
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCourse && socket) {
      setShowEmojiPicker(false)
      socket.emit('send_message', {
        courseId: selectedCourse.courseId,
        content: newMessage
      },(response:any)=>{
        console.log('message send response', response);
        if(response.success && selectedCourse.courseId === response.courseId){
          // setMessages(prevMessages => [...prevMessages, response.message]);
        }
      });

      setNewMessage('');
    }
  };

  // Select course handler
  const handleSelectCourse = (course: ChatRoom) => {
    setSelectedCourse(course);
    joinCourseChat(course.courseId);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setNewMessage(prev => prev + emojiObject.emoji);
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

      {chatRoomsList.map(course => (
        <div 
          key={course._id} 
          onClick={() => handleSelectCourse(course)}
          className="flex items-center gap-3 cursor-pointer bg-white shadow-md rounded-lg px-4 py-2 mb-4 hover:bg-purple-100 transition duration-300"
        > 
          <div className='rounded-full h-10 w-10 transition-all duration-300 hover:scale-110 overflow-hidden'>
            <img src={course.thumbnail} alt="" className='h-full w-full object-cover'/>
          </div>
          
          <div className='flex flex-col w-full '>
              <h3 className=" font-semibold">{course.name}</h3>
              <h1 className='text-xs m-1'>{`${course.lastMessage?.userId=== userId ? "You" : course.lastMessage?.username} : ${course.lastMessage?.content}`}</h1>
              <h1 className='text-right text-xs'>{new Date(course.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</h1>
          </div>

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
            <h2 className="text-xl font-bold  h-full">{selectedCourse.name}</h2>
        </div>

          <div className="flex-grow h-80 overflow-y-auto mb-4 flex flex-col">
            
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`inline-block mb-2 p-2 rounded-lg text-sm ${
                  message.userId === userId
                  ? 'bg-purple-600 text-purple-100 self-end' 
                  : 'bg-purple-100 self-start'
                }`}
                style={{
                  maxWidth: '70%', // Limit the maximum width of the bubble
                  wordWrap: 'break-word', // Ensure long text wraps within the bubble
                }}
              >
                {message.userId !== userId && <strong> {message.username}</strong>}
                <p>{message.content}</p>
                <p className='text-xs text-right'>{new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />

          </div>
          <div className="flex border rounded-lg">

            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 rounded-l-lg   focus:outline-none"
              onFocus={()=>setShowEmojiPicker(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button 
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className=" px-2 rounded-r-lg text-xl"
            >
              <BsEmojiSunglasses className='text-purple-600 ' />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12">


                <Picker 
                onEmojiClick={onEmojiClick} 
                searchDisabled
                height="300px"
                emojiStyle={EmojiStyle.FACEBOOK}
                skinTonesDisabled={true}
                />
              </div>
              )}

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