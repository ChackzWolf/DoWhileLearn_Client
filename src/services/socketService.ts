import io, { Socket } from 'socket.io-client';

// Define interfaces for type safety
interface ChatRoom {
  id: string;
  name: string;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: string;
  // Add other relevant properties
}

interface UploadProgressData {
  id:string;
  message:string;
  sessionId: string;
  status: string;
  progress: number;
  type: 'EDIT'| 'CREATE';
  videoUrl?: string;
  lessonIndex?: number;
  moduleIndex?: number;
}

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private baseUrl: string;
  private token: string;

  private constructor(baseUrl: string = 'https://dowhilelearn.space') {
    this.baseUrl = baseUrl;
    this.token = this.getCookie('tutorRefreshToken');
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(baseUrl?: string): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(baseUrl);
    }
    return SocketService.instance;
  }

  // Utility method to get cookie (replace with your actual cookie retrieval method)
  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  }

  // Connect to socket with authentication
  public connect(): Promise<Socket> {
    return new Promise((resolve:any, reject) => {
      // Disconnect existing connection if any
      if (this.socket) {
        this.disconnect();
      }

      // Create new socket connection
      this.socket = io(this.baseUrl, {
        transports: ['websocket', 'polling'],
        auth: {
          token: this.token
        }
      });

      // Connection success handler
      this.socket.on('connect', () => {
        console.log('Socket connected', this.socket?.id);
        resolve(this.socket);
      });

      // Connection error handler
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });
    });
  }

  // Chat-related methods
  public joinCourseChat(courseId: string, userId: string): void {
    this.socket?.emit('join_course_room', { courseId, userId });
  }

  public getChatRooms(userId: string, callback: (chatRooms: ChatRoom[]) => void): void {
    this.socket?.emit("get_chat_rooms", { userId }, (response: any) => {
      const chatRoomsArray = response.chatRooms || [];
      callback(chatRoomsArray);
    });
  }

  public listenToCourseMessages(callback: (messages: Message[]) => void): void {
    this.socket?.on('course_messages', callback);
  }

  public listenToNewMessage(callback: (message: Message) => void): void {
    this.socket?.on('new_message', callback);
  }

  // Video Upload Progress methods
  public trackUpload(tutorId: string): string {
    
    const sessionId = `upload_${tutorId}`;
    this.socket?.emit('track_upload', sessionId);
    return sessionId;
  }

  public listenToUploadProgress(callback: (data: UploadProgressData) => void): void {
    this.socket?.on('upload_progress', callback);
  }

  // General socket event listeners
  public onConnect(callback: () => void): void {
    this.socket?.on('connect', callback);
  }

  public onDisconnect(callback: () => void): void {
    this.socket?.on('disconnect', callback);
  }

  // Disconnect and cleanup
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get current socket instance
  public getSocket(): Socket | null {
    return this.socket;
  }
}

export default SocketService;