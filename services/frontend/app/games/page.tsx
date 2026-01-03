'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Gift } from 'lucide-react';

interface Cell {
  type: 'gem' | 'bomb' | 'bonus' | 'sparkle';
  revealed: boolean;
  adjacentBombs: number;
}

export default function GamesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gems, setGems] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cells, setCells] = useState<Cell[]>([]);
  const [gameLevel, setGameLevel] = useState(1);
  const GRID_SIZE = 8;
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE; // 64 cells

  // Generate random discount code
  const generateDiscountCode = (gemCount: number) => {
    const codes = [
      { percent: 5, prefix: 'GOLD5' },
      { percent: 10, prefix: 'GOLD10' },
      { percent: 15, prefix: 'GOLD15' },
      { percent: 20, prefix: 'GOLD20' },
      { percent: 25, prefix: 'GOLD25' },
    ];

    const discountLevel = Math.min(Math.floor(gemCount / 100), codes.length - 1);
    const selected = codes[discountLevel];
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${selected.prefix}${randomSuffix}`;
  };

  // Count adjacent bombs for a cell
  const countAdjacentBombs = (index: number, cellsArray: Cell[]) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    let count = 0;

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !(r === row && c === col)) {
          const neighborIndex = r * GRID_SIZE + c;
          if (cellsArray[neighborIndex].type === 'bomb') {
            count++;
          }
        }
      }
    }
    return count;
  };

  // Initialize game
  const initializeGame = () => {
    const newCells: Cell[] = Array(TOTAL_CELLS)
      .fill(null)
      .map(() => {
        const rand = Math.random();
        let type: 'gem' | 'bomb' | 'bonus' | 'sparkle';
        if (rand < 0.25)
          type = 'gem'; // 25% gems
        else if (rand < 0.45)
          type = 'bomb'; // 20% bombs
        else if (rand < 0.65)
          type = 'bonus'; // 20% bonus
        else type = 'sparkle'; // 35% sparkle

        return {
          type,
          revealed: false,
          adjacentBombs: 0,
        };
      });

    // Calculate adjacent bombs for each cell
    newCells.forEach((cell, index) => {
      cell.adjacentBombs = countAdjacentBombs(index, newCells);
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

    const newCells = [...cells];
    const cell = newCells[index];

    if (cell.revealed) return; // Already revealed

    cell.revealed = true;
    let gemsAdded = 0;
    let scoreAdded = 0;

    if (cell.type === 'gem') {
      // Gem collected!
      gemsAdded = 1;
      scoreAdded = 100;
    } else if (cell.type === 'bomb') {
      // Hit bomb
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameOver(true);
        const currentGems = gems + gemsAdded;
        if (currentGems > 0) {
          const code = generateDiscountCode(currentGems);
          setDiscountCode(code);
          const percent = Math.min(5 + Math.floor(currentGems / 100), 25);
          setDiscountPercent(percent);
        }
        setCells(newCells);
        return;
      }
    } else if (cell.type === 'bonus') {
      // Bonus! Extra gems
      gemsAdded = 25;
      scoreAdded = 250;
    } else if (cell.type === 'sparkle') {
      // Sparkle - extra points
      scoreAdded = 50;
    }

    setGems(gems + gemsAdded);
    setScore(score + scoreAdded);
    setCells(newCells);
  };

  const getCellDisplay = (cell: Cell) => {
    if (!cell.revealed) {
      return '?';
    }

    if (cell.type === 'bomb') return '💣';
    if (cell.type === 'gem') return '💎';
    if (cell.type === 'bonus') return '⚡';
    if (cell.type === 'sparkle') {
      if (cell.adjacentBombs === 0) return '✨';
      return cell.adjacentBombs.toString();
    }
    return '';
  };

  const getCellBgColor = (cell: Cell) => {
    if (!cell.revealed) {
      return 'bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 cursor-pointer border-2 border-gray-500 shadow-md hover:shadow-lg';
    }

    if (cell.type === 'bomb') return 'bg-red-500 border-2 border-red-700';
    if (cell.type === 'gem') return 'bg-blue-500 border-2 border-blue-700';
    if (cell.type === 'bonus') return 'bg-yellow-500 border-2 border-yellow-700';
    if (cell.type === 'sparkle') return 'bg-pink-400 border-2 border-pink-600';
    return 'bg-gray-300 border-2 border-gray-400';
  };

  const countRevealedGems = () => {
    return cells.filter((c) => c.revealed && c.type === 'gem').length;
  };

  const totalGems = cells.filter((c) => c.type === 'gem').length;

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
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">💎 جمع‌آوری جواهر</h2>
              <p className="text-gray-600">
                روی خانه‌های پنهان کلیک کنید تا محتوای آن‌ها را کشف کنید. از بمب‌ها احتیاط کنید!
              </p>
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
                  {gems > 200 ? '🎉' : gems > 100 ? '😄' : '😊'}
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900">بازی تمام شد!</p>
                  <p className="text-gray-600">
                    امتیاز شما: <span className="font-bold text-purple-600">{score}</span>
                  </p>
                  <p className="text-gray-600">
                    جواهر جمع‌آوری شده: <span className="font-bold text-blue-600">{gems}</span> /{' '}
                    {totalGems}
                  </p>
                </div>

                {discountCode ? (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300">
                    <p className="text-gray-700 mb-3">🎁 شما برنده شده‌اید!</p>
                    <div className="bg-white rounded-xl p-4 border-2 border-dashed border-green-400 mb-3">
                      <p className="text-sm text-gray-600 mb-1">کد تخفیف:</p>
                      <p className="text-3xl font-black text-green-600 font-mono mb-2">
                        {discountCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        تخفیف: <span className="font-bold text-green-600">{discountPercent}%</span>
                      </p>
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
                    <p className="text-red-700 font-semibold">
                      درایت بیشتری برای برنده شدن! حداقل ۱۰۰ امتیاز لازم است.
                    </p>
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
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">جواهر</p>
                    <p className="text-2xl font-bold text-blue-600">
                      💎 {gems}/{totalGems}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200">
                    <p className="text-xs text-gray-600 mb-1">جان</p>
                    <p className="text-2xl font-bold text-red-600">❤️ {lives}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">امتیاز</p>
                    <p className="text-2xl font-bold text-purple-600">⭐ {score}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center border-2 border-yellow-200">
                    <p className="text-xs text-gray-600 mb-1">سطح</p>
                    <p className="text-2xl font-bold text-yellow-600">📊 {gameLevel}</p>
                  </div>
                </div>

                {/* Game Grid */}
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-2xl border-4 border-gray-400 overflow-x-auto">
                  <div
                    className="inline-block"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                      gap: '6px',
                      width: 'fit-content',
                      margin: '0 auto',
                    }}
                  >
                    {cells.map((cell, index) => (
                      <button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        className={`
                          w-12 h-12 md:w-14 md:h-14 rounded-lg font-bold text-lg md:text-xl transition-all duration-200
                          ${getCellBgColor(cell)}
                          ${!cell.revealed ? 'hover:scale-110 active:scale-95' : ''}
                          flex items-center justify-center
                          ${cell.revealed && cell.type === 'sparkle' && cell.adjacentBombs > 0 ? 'text-gray-900 font-black' : 'text-white'}
                        `}
                        disabled={gameOver || cell.revealed}
                      >
                        {getCellDisplay(cell)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">راهنما:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm text-gray-600">
                    <div>💎 = جواهر (۱۰۰ امتیاز)</div>
                    <div>💣 = بمب (-۱ جان)</div>
                    <div>⚡ = تقویت‌کننده (۲۵۰ امتیاز)</div>
                    <div>✨ = درخشش (۵۰ امتیاز)</div>
                    <div>? = خانه پنهان</div>
                    <div>عدد = بمب‌های مجاور</div>
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
