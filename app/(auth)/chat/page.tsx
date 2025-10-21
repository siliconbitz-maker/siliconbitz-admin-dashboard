'use client';

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { FaUsers, FaComments } from 'react-icons/fa';

type Message = {
  id: string;
  content: string;
  senderId: string;
  room?: string;
  sender?: { name: string };
  createdAt: string;
};

let socket: any;

export default function ChatPage() {
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string>('side-talk');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState<{ room: string; count: number }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = [
    { key: 'side-talk', label: 'Side Talk', icon: <FaComments /> },
    { key: 'team-silicon', label: 'Team Silicon', icon: <FaUsers /> },
  ];

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/me');
      const data = await res.json();
      setMe(data.user);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const fetchMessages = async () => {
    if (!me) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?room=${selectedRoom}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoadingMessages(false);
      scrollToBottom();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !me) return;
    setSending(true);

    const msgData = {
      content: newMessage,
      room: selectedRoom,
      senderId: me.id,
    };
    socket.emit('send-message', msgData);
    setNewMessage('');

    // temporary loading simulation
    setTimeout(() => setSending(false), 300);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedRoom, me]);

  useEffect(() => {
    socket = io('http://localhost:3001');

    socket.on('connect', () => console.log('⚡ Connected to Socket.IO'));

    if (me?.id) socket.emit('register-user', me.id);
    socket.emit('join-room', selectedRoom);

    socket.on('new-message', (msg: Message) => {
      if (msg.room === selectedRoom) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      } else {
        setNotifications(prev => {
          const exist = prev.find(n => n.room === msg.room);
          if (exist) {
            return prev.map(n =>
              n.room === msg.room ? { ...n, count: n.count + 1 } : n
            );
          }
          return [...prev, { room: msg.room!, count: 1 }];
        });
      }

      if (Notification.permission === 'granted' && msg.senderId !== me?.id) {
        new Notification(`New message from ${msg.sender?.name || 'Someone'}`, {
          body: msg.content,
        });
      }
    });

    return () => socket.disconnect();
  }, [me, selectedRoom]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join-room', selectedRoom);
  }, [selectedRoom]);

  useEffect(() => {
    if (Notification.permission !== 'granted') Notification.requestPermission();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full border-r border-[#E5E7EB] p-4 flex flex-col">
        <h2 className="text-[#111827] font-bold text-xl mb-4">Rooms</h2>
        <div className="flex flex-col space-y-3">
          {rooms.map(room => {
            const notif = notifications.find(n => n.room === room.key);
            return (
              <button
                key={room.key}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedRoom === room.key
                    ? 'bg-[#4F46E5] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#111827] hover:bg-[#E0E7FF]'
                }`}
                onClick={() => {
                  setSelectedRoom(room.key);
                  setNotifications(prev =>
                    prev.map(n =>
                      n.room === room.key ? { ...n, count: 0 } : n
                    )
                  );
                }}
              >
                <span className="mr-3 relative">
                  {room.icon}
                  {notif?.count ? (
                    <span className="absolute -top-2 -right-2 bg-[#FF3B30] text-[#FFFFFF] text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
                      {notif.count}
                    </span>
                  ) : null}
                </span>
                {room.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#FFFFFF] flex justify-between items-center shadow-sm">
          <h2 className="text-[#111827] font-semibold text-lg">
            {rooms.find(r => r.key === selectedRoom)?.label || 'Chat'}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3 bg-[#F3F4F6]">
          {loadingMessages ? (
            <div className="flex justify-center mt-10">
              <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-[#6B7280] text-center mt-10">No messages yet</div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === me?.id;
              return (
                <div
                  key={msg.id + index}
                  className={`max-w-[70%] px-4 py-2 rounded-2xl flex flex-col shadow-md relative ${
                    isMe
                      ? 'bg-[#4F46E5] text-[#FFFFFF] self-end'
                      : 'bg-[#E5E7EB] text-[#111827] self-start'
                  }`}
                >
                  {!isMe && (
                    <div className="text-[#6B7280] text-xs font-semibold mb-1">
                      {msg.sender?.name || 'Unknown'}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap break-words text-sm">
                    {msg.content}
                  </div>

                  <div className="text-[10px] text-write mt-1 self-end">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  {/* Bubble Tail */}
                  <span
                    className={`absolute bottom-0 w-3 h-3 ${
                      isMe
                        ? 'right-[-6px] rotate-45 bg-[#FF7081]'
                        : 'left-[-6px] rotate-45 bg-[#F43378]'
                    }`}
                  ></span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#E5E7EB] flex bg-[#FFFFFF]">
          <input
            type="text"
            className="flex-1 border border-[#D1D5DB] rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={sending}
          />
          <button
            className={`bg-[#4F46E5] text-[#FFFFFF] px-4 py-2 rounded-lg flex items-center justify-center hover:bg-[#4338CA] ${
              sending ? 'cursor-not-allowed opacity-70' : ''
            }`}
            onClick={sendMessage}
            disabled={sending}
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
