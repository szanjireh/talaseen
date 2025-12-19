'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  isActive: boolean;
  priority: number;
}

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(api.announcements.getActive());
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        // Fallback to mock data
        setAnnouncements([
          {
            id: '1',
            title: '🏆 ۱۰۰ فروشنده برتر این ماه - آنها را بررسی کنید!',
            content: null,
            isActive: true,
            priority: 1,
          },
          {
            id: '2',
            title: '💰 قیمت طلا امروز به‌روزرسانی شد - مجموعه جدید ما را مرور کنید',
            content: null,
            isActive: true,
            priority: 2,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      // Use mock data on error
      setAnnouncements([
        {
          id: '1',
          title: '🏆 Top 100 sellers this month - Check them out!',
          content: null,
          isActive: true,
          priority: 1,
        },
      ]);
    }
  };

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-9">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <p className="text-xs sm:text-sm font-medium animate-in fade-in duration-300">
              {currentAnnouncement?.title}
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-orange-700/50 rounded transition-colors"
              aria-label="Close announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
