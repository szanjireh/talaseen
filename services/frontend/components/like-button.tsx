'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

interface LikeButtonProps {
  productId: string;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LikeButton({ 
  productId, 
  initialLikesCount = 0, 
  initialIsLiked = false,
  size = 'md'
}: LikeButtonProps) {
  const { isAuthenticated, token } = useAuth();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch likes count on mount
    fetchLikesCount();
  }, [productId]);

  const fetchLikesCount = async () => {
    try {
      const response = await fetch(api.products.getLikes(productId));
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked) {
        // Unlike
        const response = await fetch(api.products.unlike(productId), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(false);
          setLikesCount(data.likesCount);
        }
      } else {
        // Like
        const response = await fetch(api.products.like(productId), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(true);
          setLikesCount(data.likesCount);
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center gap-1
        rounded-full border-2 
        ${isLiked 
          ? 'bg-red-500 border-red-500 text-white' 
          : 'bg-white border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
        }
        transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-sm hover:shadow-md
      `}
      title={isLiked ? 'برداشتن لایک' : 'لایک کردن'}
    >
      <Heart
        className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''}`}
      />
      {likesCount > 0 && (
        <span className="font-medium">{likesCount.toLocaleString('fa-IR')}</span>
      )}
    </button>
  );
}
