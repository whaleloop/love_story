import React, { useState } from 'react';
import { diaryEntries, type DiaryEntry } from '../data/diaryEntries';

const COVER_WIDTH = 600;
const OPEN_WIDTH = 1200;
const HEIGHT = 800;
const TURN_DURATION = 600; // ms, a bit slower for realism

const Book: React.FC = () => {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turning, setTurning] = useState<'none' | 'forward' | 'backward'>('none');

  const totalSpreads = diaryEntries.length;

  // Helper to get entries for current spread
  const getSpreadEntries = (index: number): [DiaryEntry | null, DiaryEntry | null] => {
    const left = diaryEntries[(index - 1)] || null;
    const right = diaryEntries[(index - 1)] || null;
    return [left, right];
  };

  // Animation handlers
  const goToNextSpread = () => {
    if (turning !== 'none') return;
    if (spreadIndex === 0) {
      setTurning('forward');
      setTimeout(() => {
        setTurning('none');
        setSpreadIndex(1);
      }, TURN_DURATION);
    } else if (spreadIndex < totalSpreads) {
      setTurning('forward');
      setTimeout(() => {
        setTurning('none');
        setSpreadIndex(spreadIndex + 1);
      }, TURN_DURATION);
    }
  };

  const goToPreviousSpread = () => {
    if (turning !== 'none') return;
    if (spreadIndex === 1) {
      setTurning('backward');
      setTimeout(() => {
        setTurning('none');
        setSpreadIndex(0);
      }, TURN_DURATION);
    } else if (spreadIndex > 1) {
      setTurning('backward');
      setTimeout(() => {
        setTurning('none');
        setSpreadIndex(spreadIndex - 1);
      }, TURN_DURATION);
    }
  };

  // Animation classes for page turn
  const getPageTurnClass = () => {
    if (turning === 'forward') return 'animate-page-turn-forward';
    if (turning === 'backward') return 'animate-page-turn-backward';
    return '';
  };

  return (
    <div
      className="relative"
      style={{
        width: spreadIndex === 0 && turning === 'none' ? COVER_WIDTH : OPEN_WIDTH,
        height: HEIGHT,
        perspective: 2000,
        transition: `width 0.35s cubic-bezier(.77,0,.18,1)`,
      }}
    >
      {/* Book Cover */}
      <div
        className={`absolute inset-0 bg-red-700 shadow-lg`}
        style={{
          width: COVER_WIDTH,
          height: HEIGHT,
          zIndex: (spreadIndex === 0 || turning === 'backward') ? 10 : 1,
          pointerEvents: (spreadIndex === 0 && turning === 'none') ? 'auto' : 'none',
          transform: turning === 'forward'
            ? 'rotateY(-180deg)'
            : turning === 'backward'
            ? 'rotateY(0deg)'
            : 'rotateY(0deg)',
          transformOrigin: 'left',
          transition: `transform ${TURN_DURATION}ms cubic-bezier(.77,0,.18,1)`,
          backfaceVisibility: 'hidden',
          display: spreadIndex === 0 ? 'block' : 'none',
        }}
        onClick={goToNextSpread}
      >
        <div className="absolute inset-0 bg-[url('/assets/cover.png')] bg-cover bg-center flex flex-col p-8 text-center text-white">
          <h1 className="text-6xl font-script-title tracking-wide text-red-500 [text-shadow:_0_2px_0_rgb(255_255_255_/_40%)]">
            Sparks of Love:
          </h1>
          <h2 className="text-3xl text-black font-serif mt-2 tracking-wider">
            THE UNUSUAL TALE OF
          </h2>
          <h2 className="text-4xl text-black font-serif mt-2">
            <span className="px-2 py-1">Chris</span> AND <span className="px-2 py-1">Pikachu</span>
          </h2>
          <h3 className="text-3xl text-right text-red-500 font-serif mt-4 italic">
            A Love Story
          </h3>
          <div className="absolute bottom-8 text-2xl font-serif text-white">
            Diary By <span className="underline">Chris</span>
          </div>
        </div>
      </div>

      {/* Animated Page Turn */}
      {turning !== 'none' && spreadIndex > 0 && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 ${getPageTurnClass()}`}
          style={{
            width: OPEN_WIDTH / 2,
            height: HEIGHT,
            left: turning === 'forward' ? OPEN_WIDTH / 2 : 0,
            background: '#fff',
            boxShadow: '0 0 40px 0 rgba(0,0,0,0.15)',
            borderLeft: '1px solid #e5e7eb',
            borderRight: '1px solid #e5e7eb',
            transformOrigin: turning === 'forward' ? 'left' : 'right',
          }}
        >
          {/* Optionally, you could render the next/prev page content here for realism */}
        </div>
      )}

      {/* Open Book Spreads */}
      {(spreadIndex > 0) && (
        <div
          className="absolute inset-0 flex bg-white border border-gray-300 shadow-2xl"
          style={{
            width: OPEN_WIDTH,
            height: HEIGHT,
            zIndex: 5,
            opacity: turning === 'backward' && spreadIndex === 1 ? 0.7 : 1,
            pointerEvents: turning !== 'none' ? 'none' : 'auto',
            transition: 'opacity 0.3s',
          }}
        >
          {/* Left Page (Image) */}
          <div className="w-1/2 h-full flex items-center justify-center border-r border-gray-200 bg-white">
            {getSpreadEntries(spreadIndex === 0 ? 1 : spreadIndex)[0] ? (
              <img
                src={getSpreadEntries(spreadIndex === 0 ? 1 : spreadIndex)[0]!.image}
                alt={`Page ${getSpreadEntries(spreadIndex === 0 ? 1 : spreadIndex)[0]!.id}`}
                className="max-h-[90%] max-w-[90%] object-contain"
              />
            ) : null}
          </div>
          {/* Right Page (Text) */}
          <div
            className="w-1/2 h-full p-8 bg-gray-50 overflow-y-auto"
            style={{
              maxHeight: HEIGHT,
            }}
          >
            {getSpreadEntries(spreadIndex === 0 ? 1 : spreadIndex)[1] ? (
              <div className="text-lg text-gray-800 whitespace-pre-line">
                {getSpreadEntries(spreadIndex === 0 ? 1 : spreadIndex)[1]!.text}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                (Blank Page)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Overlays */}
      {/* Left (Prev) */}
      {spreadIndex > 0 && turning === 'none' && (
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: OPEN_WIDTH / 2,
            cursor: spreadIndex > 0 ? 'pointer' : 'default',
            zIndex: 50,
          }}
          onClick={goToPreviousSpread}
        />
      )}
      {/* Right (Next) */}
      {spreadIndex > 0 && turning === 'none' && (
        <div
          className="absolute inset-y-0 right-0"
          style={{
            width: OPEN_WIDTH / 2,
            cursor: spreadIndex < totalSpreads ? 'pointer' : 'default',
            zIndex: 50,
          }}
          onClick={goToNextSpread}
        />
      )}
    </div>
  );
};

export default Book;
