"use client";

import { Star, Music, Book, Calendar, Clock, MessageCircle, Heart, Share2, MoreHorizontal, User } from 'lucide-react';

const LivePostCard = () => {
  const post = {
    title: 'BurgerVilla',
    rating: 4.5,
    tiktokUser: 'Kingsyleyyj1009',
    imageUrl: '/placeholder-post.jpg',
    duration: '75 min',
    uploadedBy: 'James Madueke',
    uploadTime: 'Today at 3pm',
    tags: ['Funny', 'Comedy', 'Learn', 'Explore'],
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-white max-w-sm mx-auto">
      <div className="relative">
        <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover" />
        
        {/* Video Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-between text-white">
          {/* Top right icons */}
          <div className="absolute top-4 right-4 flex flex-col items-center gap-4 text-white">
              <div className="text-center">
                  <Heart size={28} />
                  <span className="text-xs font-bold">2k</span>
              </div>
              <div className="text-center">
                  <MessageCircle size={28} />
                  <span className="text-xs font-bold">23</span>
              </div>
              <div className="text-center">
                  <Share2 size={28} />
                  <span className="text-xs font-bold">5</span>
              </div>
              <div className="text-center">
                  <MoreHorizontal size={28} />
                  <span className="text-xs font-bold">More</span>
              </div>
          </div>

          {/* Bottom content */}
          <div>
            <div className="mb-2">
              <h3 className="text-xl font-bold flex items-center">
                {post.title} <Star size={16} className="ml-2 text-yellow-400 fill-current" /> <span className="text-sm ml-1">{post.rating}</span>
              </h3>
              <p className="text-sm flex items-center gap-1"><Music size={14} /> {post.tiktokUser}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="bg-purple-600/80 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1"><Clock size={14} /> {post.duration}</button>
              <button className="bg-purple-600/80 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1"><Book size={14} /> Menu</button>
              <button className="bg-purple-600/80 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1"><Calendar size={14} /> Book</button>
              <button className="bg-purple-600/80 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1"><Clock size={14} /> 12:00pm - 2:00pm</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags and Uploader Info */}
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <User size={20} className="mr-2"/>
          <span>Uploaded by: {post.uploadedBy}</span>
          <span className="ml-auto">{post.uploadTime}</span>
        </div>
      </div>
    </div>
  );
};

export default LivePostCard;
