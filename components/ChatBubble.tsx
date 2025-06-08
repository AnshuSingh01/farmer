import React, { useEffect, useRef, useState } from "react";
import { User, Bot, Pin, RefreshCw, Copy, Volume2, VolumeX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatBubbleProps {
  sender: 'user' | 'ai';
  message: string;
  timestamp?: string | Date;
  pinned?: boolean;
  onPin?: () => void;
  error?: boolean;
  onRetry?: () => void;
  onSpeak?: () => void;
  speaking?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  sender, 
  message, 
  timestamp, 
  pinned, 
  onPin, 
  error, 
  onRetry,
  onSpeak,
  speaking 
}) => {
  const isUser = sender === 'user';
  const [show, setShow] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(true);
  }, []);

  // Relative timestamp
  let relTime = '';
  if (timestamp) {
    let dateObj: Date | null = null;
    if (timestamp instanceof Date) {
      dateObj = timestamp;
    } else if (typeof timestamp === 'string') {
      const parsed = Date.parse(timestamp);
      if (!isNaN(parsed)) {
        dateObj = new Date(parsed);
      }
    }
    if (dateObj) {
      relTime = formatDistanceToNow(dateObj, { addSuffix: true });
    }
  }

  return (
    <div
      ref={bubbleRef}
      className={`flex items-start gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'} transition-opacity duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      role="article"
      aria-label={`${isUser ? 'Your message' : 'AI response'}`}
    >
      {!isUser && <Bot className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" aria-hidden="true" />}
      <div className={`relative max-w-[80%] rounded-xl px-4 py-2 shadow transition-colors
        ${isUser
          ? 'bg-blue-600 text-white dark:bg-blue-500 rounded-br-none'
          : 'bg-white border border-green-200 text-gray-900 dark:bg-slate-800 dark:text-gray-100 dark:border-green-700 rounded-bl-none'}
      `}>
        <div className="whitespace-pre-line break-words">{message}</div>
        <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
          {relTime && <span>{relTime}</span>}
          {pinned && <Pin className="w-4 h-4 text-green-500 inline" aria-label="Pinned message" />}
          {onPin && !pinned && (
            <button 
              onClick={onPin} 
              title="Pin this answer" 
              className="ml-1"
              aria-label="Pin this message"
            >
              <Pin className="w-4 h-4 hover:text-green-600" />
            </button>
          )}
          {error && onRetry && (
            <button 
              onClick={onRetry} 
              title="Retry" 
              className="ml-1"
              aria-label="Retry message"
            >
              <RefreshCw className="w-4 h-4 text-red-500 hover:text-red-700 animate-spin" />
            </button>
          )}
          {onSpeak && !isUser && (
            <button
              onClick={onSpeak}
              title={speaking ? "Stop speaking" : "Read aloud"}
              className="ml-1"
              aria-label={speaking ? "Stop speaking" : "Read message aloud"}
            >
              {speaking ? (
                <VolumeX className="w-4 h-4 text-red-500 hover:text-red-700" />
              ) : (
                <Volume2 className="w-4 h-4 hover:text-green-600" />
              )}
            </button>
          )}
        </div>
      </div>
      {isUser && <User className="w-6 h-6 text-blue-400 dark:text-blue-300 mt-1" aria-hidden="true" />}
    </div>
  );
}; 