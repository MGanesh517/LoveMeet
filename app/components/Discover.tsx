'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MapPin, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import clsx from 'clsx';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: number;
  bio: string;
  images: string[];
  hobbies: string[];
}

interface Action {
  type: 'liked' | 'passed';
  profile: Profile;
  timestamp: Date;
}

// Mock data for profiles
const generateMockProfiles = (): Profile[] => {
  const names = ['Emma', 'Sophia', 'Olivia', 'Isabella', 'Ava', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn'];
  const hobbies = ['Travel', 'Photography', 'Music', 'Cooking', 'Reading', 'Fitness', 'Art', 'Dancing', 'Movies', 'Gaming'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  
  return names.map((name, index) => ({
    id: `profile-${index}`,
    name,
    age: 22 + Math.floor(Math.random() * 10),
    location: locations[index],
    distance: Math.floor(Math.random() * 50) + 1,
    bio: `Love exploring new places and trying new cuisines. Looking for someone to share adventures with! 💕`,
    images: [
      `https://i.pravatar.cc/400?img=${index + 1}`,
      `https://i.pravatar.cc/400?img=${index + 11}`,
      `https://i.pravatar.cc/400?img=${index + 21}`,
    ],
    hobbies: hobbies.slice(0, 3 + Math.floor(Math.random() * 3)),
  }));
};

export default function Discover() {
  const [profiles, setProfiles] = useState<Profile[]>(generateMockProfiles());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedStack, setLikedStack] = useState<Action[]>([]);
  const [passedStack, setPassedStack] = useState<Action[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const currentProfile = profiles[currentIndex];
  const nextProfiles = profiles.slice(currentIndex + 1, currentIndex + 6);
  const hasMore = currentIndex < profiles.length - 1;

  const handleAction = (type: 'liked' | 'passed') => {
    if (isAnimating || !currentProfile) return;
    
    setIsAnimating(true);
    const action: Action = {
      type,
      profile: currentProfile,
      timestamp: new Date(),
    };

    if (type === 'liked') {
      setLikedStack((prev) => [action, ...prev]);
      // Simulate match (10% chance)
      if (Math.random() < 0.1) {
        setShowConfetti(true);
        toast.success(`It's a Match! 💕 You and ${currentProfile.name} liked each other!`);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        toast.success(`You liked ${currentProfile.name}!`);
      }
    } else {
      setPassedStack((prev) => [action, ...prev]);
      toast(`Passed on ${currentProfile.name}`);
    }

    // Move to next profile after animation (longer delay for smooth blur transition)
    setTimeout(() => {
      if (hasMore) {
        setCurrentIndex(currentIndex + 1);
        setCurrentImageIndex(0);
      }
      setIsAnimating(false);
    }, 600);
  };

  const handleSuperLike = () => {
    if (isAnimating || !currentProfile) return;
    toast.success(`Super Liked ${currentProfile.name}! ⭐`);
    handleAction('liked');
  };

  const undoLastAction = () => {
    if (likedStack.length > 0) {
      const lastAction = likedStack[0];
      setLikedStack((prev) => prev.slice(1));
      setProfiles((prev) => [lastAction.profile, ...prev]);
      setCurrentIndex(0);
      toast.success('Undid last like');
    } else if (passedStack.length > 0) {
      const lastAction = passedStack[0];
      setPassedStack((prev) => prev.slice(1));
      setProfiles((prev) => [lastAction.profile, ...prev]);
      setCurrentIndex(0);
      toast.success('Undid last pass');
    }
  };

  const nextImage = () => {
    if (currentProfile && currentImageIndex < currentProfile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-8">
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Discover</h1>
        <p className="text-gray-600">
          {hasMore ? `${profiles.length - currentIndex - 1} more profiles to explore` : 'No more profiles'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-180px)]">
        {/* Left Column - Next Cards Queue (Blurred) */}
        <div className="lg:col-span-3 bg-white/40 backdrop-blur-md rounded-2xl p-4 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ArrowDown className="h-5 w-5 text-rose-500" />
            Coming Up
          </h2>
          <div className="space-y-3 overflow-y-auto h-full pr-2 custom-scrollbar">
            {nextProfiles.length > 0 ? (
              nextProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                  className={clsx(
                    'bg-white/80 rounded-xl p-3 shadow-md cursor-pointer transition-all blur-sm',
                    index === 0 && 'ring-2 ring-rose-400/50 animate-pulse'
                  )}
                  style={{ filter: 'blur(8px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-200 to-pink-200" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No more profiles</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Main Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentProfile ? (
              <motion.div
                key={currentProfile.id}
                initial={{ opacity: 0, y: -100, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full max-w-md"
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: '60vh' }}>
                  {/* Image Carousel */}
                  <div className="relative h-[60%] bg-gradient-to-br from-rose-100 to-pink-100">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={currentProfile.images[currentImageIndex]}
                        alt={currentProfile.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Image Navigation */}
                    {currentProfile.images.length > 1 && (
                      <>
                        {currentImageIndex > 0 && (
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
                          >
                            <ArrowUp className="h-5 w-5 text-gray-700" />
                          </button>
                        )}
                        {currentImageIndex < currentProfile.images.length - 1 && (
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
                          >
                            <ArrowDown className="h-5 w-5 text-gray-700" />
                          </button>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {currentProfile.images.map((_, idx) => (
                            <div
                              key={idx}
                              className={clsx(
                                'h-2 rounded-full transition-all',
                                idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Profile Info */}
                  <div className="p-4 md:p-6 flex flex-col h-[40%]">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {currentProfile.name}, {currentProfile.age}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{currentProfile.location} • {currentProfile.distance} km away</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed text-sm md:text-base line-clamp-2">{currentProfile.bio}</p>

                    {/* Hobbies */}
                    <div className="flex flex-wrap gap-2 mb-3 flex-1 overflow-y-auto">
                      {currentProfile.hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs md:text-sm font-medium"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-auto">
                      <motion.button
                        onClick={() => handleAction('passed')}
                        disabled={isAnimating}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-lg transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-8 w-8" />
                      </motion.button>

                      <motion.button
                        onClick={handleSuperLike}
                        disabled={isAnimating}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star className="h-8 w-8" />
                      </motion.button>

                      <motion.button
                        onClick={() => handleAction('liked')}
                        disabled={isAnimating}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="h-8 w-8" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="bg-white rounded-3xl p-12 shadow-xl">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-rose-400" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
                  <p className="text-gray-600 mb-6">You've seen all available profiles</p>
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setProfiles(generateMockProfiles());
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Refresh Profiles
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - History Stack (Blurred) */}
        <div className="lg:col-span-3 bg-white/40 backdrop-blur-md rounded-2xl p-4 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-rose-500" />
            Your Activity
          </h2>

          <div className="space-y-4 overflow-y-auto h-full pr-2 custom-scrollbar">
            {/* Liked Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-green-500 fill-green-500" />
                <span className="font-semibold text-gray-700">Liked ({likedStack.length})</span>
              </div>
              <div className="space-y-2">
                {likedStack.slice(0, 5).map((action, index) => (
                  <motion.div
                    key={`liked-${action.profile.id}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(8px)' }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    className="bg-green-50/80 border-2 border-green-200/50 rounded-xl p-3 shadow-sm"
                    style={{ filter: 'blur(8px)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-emerald-200" />
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-12" />
                      </div>
                    </div>
                  </motion.div>
                ))}
                {likedStack.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No likes yet</p>
                )}
              </div>
            </div>

            {/* Passed Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <X className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-700">Passed ({passedStack.length})</span>
              </div>
              <div className="space-y-2">
                {passedStack.slice(0, 5).map((action, index) => (
                  <motion.div
                    key={`passed-${action.profile.id}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(8px)' }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    className="bg-gray-50/80 border-2 border-gray-200/50 rounded-xl p-3 shadow-sm"
                    style={{ filter: 'blur(8px)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-12" />
                      </div>
                    </div>
                  </motion.div>
                ))}
                {passedStack.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No passes yet</p>
                )}
              </div>
            </div>

            {/* Undo Button */}
            {(likedStack.length > 0 || passedStack.length > 0) && (
              <motion.button
                onClick={undoLastAction}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium text-gray-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Undo Last Action
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.5);
        }
      `}</style>
    </div>
  );
}

