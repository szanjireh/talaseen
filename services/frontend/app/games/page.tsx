'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Gift } from 'lucide-react';

export default function GamesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gems, setGems] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cells, setCells] = useState<string[]>([]);
  const [gameLevel, setGameLevel] = useState(1);

  // Generate random discount code
  const generateDiscountCode = (gemCount: number) => {
    const codes = [
      { percent: 5, prefix: 'GOLD5' },
      { percent: 10, prefix: 'GOLD10' },
      { percent: 15, prefix: 'GOLD15' },
      { percent: 20, prefix: 'GOLD20' },
      { percent: 25, prefix: 'GOLD25' },
    ];

    const discountLevel = Math.min(Math.floor(gemCount / 50), codes.length - 1);
    const selected = codes[discountLevel];
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${selected.prefix}${randomSuffix}`;
  };

  // Initialize game
  const initializeGame = () => {
    const newCells = Array(16)
      .fill('')
      .map(() => {
        const rand = Math.random();
        if (rand < 0.4) return '💎'; // Gem
        if (rand < 0.6) return '💣'; // Bomb
        if (rand < 0.8) return '⚡'; // Bonus
        return '✨'; // Sparkle
      });
    setCells(newCells);
    setGems(0);
    setLives(3);
    setScore(0);
    setGameOver(false);
    setDiscountCode(null);
    setGameStarted(true);
  };

  const handleCellClick = (index: number) => {
    if (gameOver || !gameStarted) return;

    const cell = cells[index];

    if (cell === '💎') {
      // Gem collected!
      setGems(gems + 10);
      setScore(score + 100);
      cells[index] = '✓';
    } else if (cell === '💣') {
      // Hit bomb
      setLives(lives - 1);
      cells[index] = '✗';
      if (lives - 1 === 0) {
        endGame();
        return;
      }
    } else if (cell === '⚡') {
      // Bonus! Extra gems
      setGems(gems + 25);
      setScore(score + 250);
      cells[index] = '⚡✓';
    } else if (cell === '✨') {
      // Sparkle - extra life or points
      setScore(score + 50);
      cells[index] = '✨✓';
    }

    setCells([...cells]);
  };

  const endGame = () => {
    setGameOver(true);
    if (gems > 0) {
      const code = generateDiscountCode(gems);
      setDiscountCode(code);
      const percent = Math.min(5 + Math.floor(gems / 50), 25);
      setDiscountPercent(percent);
    }
  };

  const completeLevel = () => {
    // Check if all gems collected
    const remainingGems = cells.filter(c => c === '💎').length;
    if (remainingGems === 0) {
      setGameLevel(gameLevel + 1);
      initializeGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">🎮 بازی‌های طلاسین</h1>
          <p className="text-xl text-white/90">بازی کنید، جواهر جمع کنید، تخفیف برنده شوید!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Game Info */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">💎 جمع‌آوری جواهر</h2>
              <p className="text-gray-600">روی خانه‌ها کلیک کنید تا جواهر پیدا کنید. از بمب‌ها احتیاط کنید!</p>
            </div>

            {!gameStarted ? (
              <div className="text-center">
                <Button
                  onClick={initializeGame}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-lg transition-all hover:scale-105"
                >
                  <Sparkles className="mr-2" />
                  شروع بازی
                </Button>
              </div>
            ) : gameOver ? (
              <div className="text-center space-y-6">
                <div className="text-6xl animate-bounce">
                  {gems > 100 ? '🎉' : gems > 50 ? '😄' : '😊'}
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900">بازی تمام شد!</p>
                  <p className="text-gray-600">امتیاز شما: <span className="font-bold text-purple-600">{score}</span></p>
                  <p className="text-gray-600">جواهر جمع‌آوری شده: <span className="font-bold text-blue-600">{gems}</span></p>
                </div>

                {discountCode ? (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300">
                    <p className="text-gray-700 mb-3">🎁 شما برنده شده‌اید!</p>
                    <div className="bg-white rounded-xl p-4 border-2 border-dashed border-green-400 mb-3">
                      <p className="text-sm text-gray-600 mb-1">کد تخفیف:</p>
                      <p className="text-3xl font-black text-green-600 font-mono mb-2">{discountCode}</p>
                      <p className="text-sm text-gray-600">تخفیف: <span className="font-bold text-green-600">{discountPercent}%</span></p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">این کد را در صفحه خرید وارد کنید</p>
                    <Button
                      onClick={() => navigator.clipboard.writeText(discountCode)}
                      className="bg-green-600 hover:bg-green-700 text-white w-full font-bold py-2 rounded-lg"
                    >
                      📋 کپی کد
                    </Button>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                    <p className="text-red-700 font-semibold">درایت بیشتری برای برنده شدن!</p>
                  </div>
                )}

                <Button
                  onClick={initializeGame}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold transition-all w-full"
                >
                  🔄 بازی دوباره
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">جواهر</p>
                    <p className="text-3xl font-bold text-blue-600">💎 {gems}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200">
                    <p className="text-sm text-gray-600 mb-1">جان</p>
                    <p className="text-3xl font-bold text-red-600">❤️ {lives}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">امتیاز</p>
                    <p className="text-3xl font-bold text-purple-600">⭐ {score}</p>
                  </div>
                </div>

                {/* Game Grid */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-3 border-purple-300">
                  <div className="grid grid-cols-4 gap-3">
                    {cells.map((cell, index) => (
                      <button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        className={`
                          aspect-square rounded-xl font-bold text-2xl transition-all duration-200
                          ${cell === '' ? 'bg-white border-2 border-gray-300 hover:border-purple-500 hover:scale-105 cursor-pointer' : ''}
                          ${cell === '💎' ? 'bg-blue-400 border-2 border-blue-600 animate-bounce' : ''}
                          ${cell === '✓' ? 'bg-green-400 border-2 border-green-600' : ''}
                          ${cell === '✗' ? 'bg-red-400 border-2 border-red-600' : ''}
                          ${cell === '💣' ? 'bg-gray-500 border-2 border-gray-700' : ''}
                          ${cell === '⚡' ? 'bg-yellow-400 border-2 border-yellow-600 animate-pulse' : ''}
                          ${cell === '⚡✓' ? 'bg-yellow-300 border-2 border-yellow-600' : ''}
                          ${cell === '✨' ? 'bg-pink-300 border-2 border-pink-500' : ''}
                          ${cell === '✨✓' ? 'bg-pink-200 border-2 border-pink-500' : ''}
                          shadow-md hover:shadow-lg flex items-center justify-center
                        `}
                        disabled={gameOver}
                      >
                        {cell}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">راهنما:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>💎 = جواهر (۱۰ امتیاز)</div>
                    <div>💣 = بمب (-۱ جان)</div>
                    <div>⚡ = تقویت‌کننده (۲۵ امتیاز)</div>
                    <div>✨ = درخشش (۵۰ امتیاز)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* More Games Coming */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <p className="text-4xl mb-3">🎯</p>
            <h3 className="font-bold text-gray-900 mb-2">بازی‌های بیشتر</h3>
            <p className="text-sm text-gray-600">بزودی...</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <p className="text-4xl mb-3">🏆</p>
            <h3 className="font-bold text-gray-900 mb-2">رتبه‌بندی</h3>
            <p className="text-sm text-gray-600">بزودی...</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <p className="text-4xl mb-3">🎁</p>
            <h3 className="font-bold text-gray-900 mb-2">جوایز</h3>
            <p className="text-sm text-gray-600">بزودی...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
