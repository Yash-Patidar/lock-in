'use client';

import { useEffect, useState } from 'react';

interface TweetData {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  created_at: string;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

interface TweetCardProps {
  tweetUrl: string;
  className?: string;
}

export default function TweetCard({ tweetUrl, className }: TweetCardProps) {
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract tweet ID from URL
  const getTweetId = (url: string) => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const tweetId = getTweetId(tweetUrl);
    if (tweetId) {
      // For demo purposes, we'll create a mock tweet
      // In a real app, you'd fetch from Twitter API or use a service
      setTweetData({
        id: tweetId,
        text: "The final quarter is where champions are made. Lock in, focus, and make every moment count. 🔥💪 #LockInMode #FinalQuarter #Productivity",
        author: {
          name: "Guillermo Rauch",
          username: "rauchg",
          avatar: "https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg"
        },
        created_at: "2024-01-15T10:30:00Z",
        metrics: {
          likes: 1234,
          retweets: 567,
          replies: 89
        }
      });
      setLoading(false);
    }
  }, [tweetUrl]);

  if (loading) {
    return (
      <div className={`max-w-lg mx-auto p-6 border rounded-xl bg-white dark:bg-gray-900 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tweetData) return null;

  return (
    <div className={`max-w-lg mx-auto p-6 border rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold"
        >
          {tweetData.author.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {tweetData.author.name}
            </h3>
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            @{tweetData.author.username}
          </p>
        </div>
        <div className="ml-auto">
          <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
      </div>

      {/* Tweet Content */}
      <div className="mb-4">
        <p className="text-gray-900 dark:text-white text-base leading-relaxed">
          {tweetData.text}
        </p>
      </div>

      {/* Metrics */}
      <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{tweetData.metrics.replies}</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{tweetData.metrics.retweets}</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{tweetData.metrics.likes}</span>
        </div>
      </div>
    </div>
  );
}