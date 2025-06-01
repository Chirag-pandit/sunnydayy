import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
  rating: number;
  reviewCount: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, rating, reviewCount }) => {
  // Generate fake reviews
  const generateReviews = (): Review[] => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const reviews: Review[] = [];
    
    const titles = [
      'Great quality product',
      'Excellent fit and comfort',
      'Love the design',
      'Perfect for training',
      'Exactly as pictured',
      'Impressed with the material',
      'Good value for money',
      'Highly recommended',
    ];
    
    const contents = [
      'This product exceeded my expectations. The quality is top-notch and it looks even better in person.',
      'I\'ve been using this for my MMA training sessions and it holds up really well. Very comfortable and durable.',
      'The fit is perfect and the material feels premium. I\'ve received many compliments when wearing this.',
      'I was skeptical at first, but after trying it out, I\'m very impressed with the quality and comfort.',
      'The design is exactly as shown in the pictures. Very satisfied with my purchase.',
      'Great product for the price. The material is breathable and comfortable for long training sessions.',
      'I bought this for my boyfriend and he absolutely loves it. Will definitely buy more items from this brand.',
      'I\'ve tried many brands but this one is by far the best in terms of quality and fit. Highly recommended.',
    ];
    
    const names = [
      'John D.',
      'Sarah M.',
      'Mike T.',
      'Emma L.',
      'David K.',
      'Jessica R.',
      'Robert S.',
      'Amanda P.',
      'Chris B.',
      'Olivia W.',
    ];
    
    const totalReviews = Math.min(Math.floor(Math.random() * 15) + 3, reviewCount);
    
    for (let i = 0; i < totalReviews; i++) {
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const randomYear = 2023 + Math.floor(Math.random() * 2);
      
      const randomRating = Math.max(3, Math.min(5, Math.floor(Number(rating) + (Math.random() * 2 - 1))));
      
      reviews.push({
        id: i + 1,
        userName: names[Math.floor(Math.random() * names.length)],
        rating: randomRating,
        date: `${randomMonth} ${randomDay}, ${randomYear}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        content: contents[Math.floor(Math.random() * contents.length)],
        verified: Math.random() > 0.3,
      });
    }
    
    return reviews;
  };
  
  const reviews = React.useMemo(() => generateReviews(), [productId, rating, reviewCount]);

  // Generate rating distribution
  const generateRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    
    reviews.forEach((review) => {
      distribution[5 - review.rating]++;
    });
    
    return distribution;
  };
  
  const ratingDistribution = generateRatingDistribution();
  
  // Calculate total rating percentage for the progress bars
  const calculateRatingPercentage = (count: number) => {
    return (count / reviews.length) * 100;
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Overall rating */}
          <div className="flex-1 text-center md:text-left md:border-r md:border-gray-700 md:pr-6 mb-6 md:mb-0">
            <div className="text-5xl font-bold mb-2">{rating}</div>
            <div className="flex justify-center md:justify-start mb-2">
              {renderStars(Math.floor(Number(rating)))}
            </div>
            <p className="text-gray-400">{reviewCount} reviews</p>
          </div>
          
          {/* Rating distribution */}
          <div className="flex-1 md:pl-6">
            <h3 className="text-sm font-medium mb-3 text-center md:text-left">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center mb-2">
                <div className="flex items-center w-12">
                  <span className="text-sm text-gray-400">{star}</span>
                  <Star size={12} className="ml-1 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 h-2 bg-gray-700 rounded-full mx-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full" 
                    style={{ width: `${calculateRatingPercentage(ratingDistribution[5 - star])}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-sm text-gray-400">
                  {ratingDistribution[5 - star]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Individual reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-800 pb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{review.title}</h3>
                <div className="flex items-center mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <span className="text-sm text-gray-400">{review.date}</span>
            </div>
            <div className="mt-3">
              <p className="text-gray-300">{review.content}</p>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-400">By {review.userName}</span>
              {review.verified && (
                <span className="ml-2 px-2 py-0.5 bg-green-900 text-green-300 text-xs rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Write a review button */}
      <div className="mt-8 text-center">
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ProductReviews;