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
  onLikeChange?: () => void;
}

export function LikeButton({
  productId,
  initialLikesCount = 0,
  initialIsLiked = false,
  size = 'md',
  onLikeChange,
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
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(false);
          setLikesCount(data.likesCount);
          onLikeChange?.();
        }
      } else {
        // Like
        const response = await fetch(api.products.like(productId), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(true);
          setLikesCount(data.likesCount);
          onLikeChange?.();
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
    lg: 'w-12 h-12 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const buttonPadding = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-6 py-5',
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg
        ${buttonPadding[size]}
        ${
          isLiked
            ? 'bg-red-500 border-2 border-red-600 text-white shadow-lg'
            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50'
        }
        transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:scale-105'}
        ${size === 'lg' ? 'min-w-[140px]' : ''}
      `}
      title={isLiked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <Heart
        className={`${iconSizes[size]} ${isLiked ? 'fill-white text-white' : 'text-gray-600'}`}
      />
      {size === 'lg' && (
        <div className="flex flex-col items-start gap-0.5">
          <span className={`font-semibold text-sm ${isLiked ? 'text-white' : 'text-gray-700'}`}>
            {isLiked ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          </span>
          {likesCount > 0 && (
            <span className={`text-xs ${isLiked ? 'text-red-100' : 'text-gray-500'}`}>
              {likesCount.toLocaleString('fa-IR')} لایک
            </span>
          )}
        </div>
      )}
      {size !== 'lg' && (
        <>
          <span className="font-semibold text-sm">
            {likesCount > 0 ? likesCount.toLocaleString('fa-IR') : '۰'}
          </span>
          <span className="text-xs text-gray-500">لایک</span>
        </>
      )}
    </button>
  );
}
