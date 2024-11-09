import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Star } from 'lucide-react';
import './ItineraryDetail.css';

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
      <p key={index} className="itinerary-description-line my-2 text-left">
        {line.split(/(\d{1,2}h\d{2})/).map((part, idx) => {
          if (/^\d{1,2}h\d{2}$/.test(part)) {
            return (
              <span key={idx} className="itinerary-duration text-blue-600 font-semibold mr-2">
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
    <div className="itinerary-detail-container w-full space-y-4">
      {destinations.map((dest) => (
        <div 
          key={dest.destinationId} 
          className="itinerary-destination-card bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
        >
          <div 
            className="itinerary-header p-4 cursor-pointer" 
            onClick={() => toggleDescription(dest.destinationId)}
          >
            <h4 className="itinerary-title font-semibold text-purple-700 text-xl">{dest.name}</h4>
            <div className="itinerary-info flex items-center gap-2 text-lg">
              <span className="text-gray-800 font-bold">{dest.province}</span> 
              <span className="text-gray-400">•</span>
              <span className="text-green-600 font-medium">{dest.duration} giờ</span>
            </div>
          </div>

          <div className={`itinerary-content p-4 text-left ${expandedIds[dest.destinationId] ? 'expanded' : ''}`}>
            {expandedIds[dest.destinationId] && (
              <div className="relative">
                <div>
                  {formatDescription(dest.description)}
                </div>
                {/* Hiển thị hình ảnh */}
                {dest.images && dest.images.length > 0 && (
                  <div className="itinerary-images mt-4">
                    {dest.images.map((image) => (
                      <img 
                        key={image.imageId} 
                        src={image.imageUrl} 
                        alt={dest.name} 
                        className="itinerary-image rounded-lg mt-2"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="itinerary-footer mt-4 pt-3 border-t border-gray-100 flex gap-6">
              <button className="itinerary-footer-button flex items-center gap-2 text-sm">
                <ThumbsUp className="w-4 h-4" />
                Hữu ích
              </button>
              <button className="itinerary-footer-button flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" />
                Bình luận
              </button>
              <button className="itinerary-footer-button flex items-center gap-2 text-sm">
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