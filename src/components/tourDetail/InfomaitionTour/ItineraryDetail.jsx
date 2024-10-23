import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Star } from 'lucide-react';

const ItineraryDetail = ({ destinations }) => {
  const [expandedIds, setExpandedIds] = useState({});

  const toggleDescription = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDescription = (description) => {
    return description.split('\n').map((line, index) => (
      <p key={index} className="my-2 text-left">
        {line.split(/(\d{1,2}h\d{2})/).map((part, idx) => {
          if (/^\d{1,2}h\d{2}$/.test(part)) {
            return (
              <span key={idx} className="text-blue-600 font-semibold mr-2">
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <div className="itinerary-container w-full space-y-4">
      {destinations.map((dest) => (
        <div 
          key={dest.destinationId} 
          className="destination-card bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
        >
          <div className="header p-4">
            <div className="flex-grow">
              <h4 className="font-semibold text-green-700 text-lg">{dest.name}</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-800">{dest.province}</span>
                <span className="text-gray-400">•</span>
                <span className="text-green-600 font-medium">{dest.duration} giờ</span>
              </div>
            </div>
          </div>

          <div className="content p-4 text-left"> 
            <div className="relative">
              <div>
                {expandedIds[dest.destinationId] ? formatDescription(dest.description) : `${dest.description.substring(0, 100)}...`}
              </div>
              <button 
                onClick={() => toggleDescription(dest.destinationId)}
                className="toggle-button text-green-600 font-semibold mt-2"
              >
                {expandedIds[dest.destinationId] ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>

            {/* Footer */}
            <div className="footer mt-4 pt-3 border-t border-gray-100 flex gap-6">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors duration-200">
                <ThumbsUp className="w-4 h-4" />
                Hữu ích
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors duration-200">
                <MessageSquare className="w-4 h-4" />
                Bình luận
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors duration-200">
                <Star className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryDetail;