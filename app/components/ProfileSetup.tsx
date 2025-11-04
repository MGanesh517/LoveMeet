'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  Camera, 
  MapPin, 
  Sliders, 
  ArrowRight, 
  ArrowLeft,
  X,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

interface ProfileData {
  name: string;
  age: string;
  gender: string;
  bio: string;
  relationshipGoal: string;
  hobbies: string[];
  profileImages: File[];
  interestedIn: string;
  ageRange: { min: number; max: number };
  distanceRange: number;
  location: { lat: number; lng: number } | null;
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'About You', icon: Heart },
  { id: 3, title: 'Photos', icon: Camera },
  { id: 4, title: 'Location', icon: MapPin },
  { id: 5, title: 'Preferences', icon: Sliders },
];

interface ProfileSetupProps {
  onComplete?: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    age: '',
    gender: '',
    bio: '',
    relationshipGoal: '',
    hobbies: [],
    profileImages: [],
    interestedIn: '',
    ageRange: { min: 18, max: 35 },
    distanceRange: 50,
    location: null,
  });

  const [tempHobby, setTempHobby] = useState('');

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 6 - profileData.profileImages.length);
    updateProfileData('profileImages', [...profileData.profileImages, ...newFiles]);
    toast.success(`${newFiles.length} photo(s) added!`);
  }, [profileData.profileImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    const newImages = profileData.profileImages.filter((_, i) => i !== index);
    updateProfileData('profileImages', newImages);
  };

  const addHobby = () => {
    if (tempHobby.trim() && !profileData.hobbies.includes(tempHobby.trim())) {
      updateProfileData('hobbies', [...profileData.hobbies, tempHobby.trim()]);
      setTempHobby('');
    }
  };

  const removeHobby = (hobby: string) => {
    updateProfileData('hobbies', profileData.hobbies.filter((h) => h !== hobby));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateProfileData('location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Location captured!');
        },
        () => {
          toast.error('Could not get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!profileData.name.trim() || !profileData.age || !profileData.gender) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (!profileData.bio.trim() || profileData.bio.length < 20) {
          toast.error('Bio must be at least 20 characters');
          return false;
        }
        return true;
      case 3:
        if (profileData.profileImages.length < 1) {
          toast.error('Please upload at least 1 photo');
          return false;
        }
        return true;
      case 4:
        if (!profileData.location) {
          toast.error('Please allow location access');
          return false;
        }
        return true;
      case 5:
        if (!profileData.interestedIn || !profileData.ageRange.min || !profileData.ageRange.max) {
          toast.error('Please fill in all preferences');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      // Get current user from Firebase
      const { getCurrentUser } = await import('@/lib/firebase/auth');
      const user = getCurrentUser();
      
      if (!user) {
        toast.error('Please sign in first');
        setLoading(false);
        return;
      }

      // Upload images to Firebase Storage
      let imageUrls: string[] = [];
      if (profileData.profileImages.length > 0) {
        try {
          const formData = new FormData();
          profileData.profileImages.forEach((file) => {
            formData.append('images', file);
          });
          formData.append('userId', user.uid);

          // Use Render URL or local URL based on environment
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lovemeet-backend.onrender.com';
          console.log('Uploading images to:', `${backendUrl}/api/upload/images`);
          
          const uploadResponse = await fetch(`${backendUrl}/api/upload/images`, {
            method: 'POST',
            body: formData,
            signal: AbortSignal.timeout(60000), // 60 second timeout for Render (free tier is slow)
            // Don't set Content-Type header - let browser set it with boundary
          });

          console.log('Upload response status:', uploadResponse.status);
          console.log('Upload response ok:', uploadResponse.ok);

          if (!uploadResponse.ok) {
            let errorData;
            const contentType = uploadResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              errorData = await uploadResponse.json();
            } else {
              const text = await uploadResponse.text();
              errorData = { error: text || 'Upload failed' };
            }
            console.error('Upload error response:', errorData);
            throw new Error(errorData.error || errorData.details || `Upload failed with status ${uploadResponse.status}`);
          }

          const contentType = uploadResponse.headers.get('content-type');
          let uploadData;
          if (contentType && contentType.includes('application/json')) {
            uploadData = await uploadResponse.json();
          } else {
            const text = await uploadResponse.text();
            console.warn('Non-JSON response:', text);
            throw new Error('Invalid response format from server');
          }

          console.log('Upload success:', uploadData);
          imageUrls = uploadData.imageUrls || [];
          
          if (imageUrls.length === 0) {
            console.warn('No image URLs returned from upload');
          }
        } catch (uploadError: any) {
          console.error('Image upload error:', uploadError);
          
          let errorMessage = 'Failed to upload images. ';
          
          if (uploadError.name === 'AbortError' || uploadError.name === 'TimeoutError') {
            errorMessage += 'Request timed out. Render free tier may be slow. Please try again.';
          } else if (uploadError.message?.includes('Failed to fetch') || uploadError.message?.includes('NetworkError')) {
            errorMessage = `Cannot connect to backend server. If deploying to Render, make sure the backend is deployed and running.`;
          } else if (uploadError.message) {
            errorMessage += uploadError.message;
          } else {
            errorMessage += 'Please check your backend deployment.';
          }
          
          toast.error(errorMessage, { duration: 5000 });
          setLoading(false);
          return;
        }
      }

      // Save profile data to MongoDB
      const profilePayload = {
        firebaseUid: user.uid,
        email: user.email || '',
        name: profileData.name,
        age: parseInt(profileData.age) || undefined,
        gender: profileData.gender || undefined,
        bio: profileData.bio || undefined,
        profileImages: imageUrls,
        interestedIn: profileData.interestedIn || undefined,
        ageRange: profileData.ageRange,
        distanceRange: profileData.distanceRange,
        location: profileData.location,
        relationshipGoal: profileData.relationshipGoal || undefined,
        hobbies: profileData.hobbies,
        isComplete: true,
      };

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      toast.success('Profile created successfully! Welcome to LoveMeet! 💕');
      
      // Navigate to discover page
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Profile submission error:', error);
      toast.error(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      {/* Enhanced Floating Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-rose-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Floating Hearts */}
        {typeof window !== 'undefined' && [...Array(6)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomDelay = Math.random() * 5;
          const randomDuration = 8 + Math.random() * 4;
          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: `${randomX}%`,
                y: '100vh',
                opacity: 0,
              }}
              animate={{
                y: '-100px',
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: 'linear',
              }}
            >
              <Heart className="h-6 w-6 text-rose-300/40 fill-rose-300/40" />
            </motion.div>
          );
        })}
        
        {/* Sparkle Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl max-h-[95vh] overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-8 lg:p-12 border border-white/20 flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 flex-shrink-0">
            <motion.div
              className="flex justify-center mb-3 md:mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div
                className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 10px 25px rgba(236, 72, 153, 0.3)',
                    '0 15px 35px rgba(236, 72, 153, 0.5)',
                    '0 10px 25px rgba(236, 72, 153, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Heart className="h-7 w-7 md:h-8 md:w-8 fill-white text-white" />
                </motion.div>
                {/* Pulse Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-rose-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
            </motion.div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
              Complete Your Profile
            </h1>
            <p className="text-sm md:text-base text-gray-600">Let's find your perfect match</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 md:mb-6 flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm font-medium text-gray-600">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-xs md:text-sm font-medium text-rose-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Step Indicators - Responsive */}
          <div className="flex justify-between mb-4 md:mb-6 relative flex-shrink-0">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10 hidden md:block" />
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                  <motion.div
                    className={clsx(
                      'flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all duration-300',
                      isCompleted
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : isActive
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    )}
                    animate={{
                      scale: isActive ? [1, 1.15, 1] : 1,
                    }}
                    transition={{ 
                      duration: isActive ? 1.5 : 0.3,
                      repeat: isActive ? Infinity : 0,
                      ease: 'easeInOut'
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    ) : (
                      <Icon className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    )}
                  </motion.div>
                  <span
                    className={clsx(
                      'text-[10px] md:text-xs font-medium mt-1 md:mt-2 text-center px-1',
                      isActive ? 'text-rose-600 font-semibold' : 'text-gray-400'
                    )}
                  >
                    {step.title}
                  </span>
            </div>
              );
            })}
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-2 text-rose-500" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => updateProfileData('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={profileData.age}
                        onChange={(e) => updateProfileData('age', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                        placeholder="Age"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => updateProfileData('gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: About You */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Heart className="inline h-4 w-4 mr-2 text-rose-500" />
                      Bio * (At least 20 characters)
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => updateProfileData('bio', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all resize-none"
                      placeholder="Tell us about yourself... What makes you unique?"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {profileData.bio.length}/20 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship Goal
                    </label>
                    <select
                      value={profileData.relationshipGoal}
                      onChange={(e) => updateProfileData('relationshipGoal', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                    >
                      <option value="">Select your goal</option>
                      <option value="casual">Casual Dating</option>
                      <option value="serious">Serious Relationship</option>
                      <option value="friendship">Friendship</option>
                      <option value="not-sure">Not Sure Yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hobbies & Interests
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tempHobby}
                        onChange={(e) => setTempHobby(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                        placeholder="Add a hobby (press Enter)"
                      />
                      <button
                        type="button"
                        onClick={addHobby}
                        className="px-6 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profileData.hobbies.map((hobby) => (
                        <motion.span
                          key={hobby}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm"
                        >
                          {hobby}
                          <button
                            type="button"
                            onClick={() => removeHobby(hobby)}
                            className="hover:text-rose-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Photos */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <Camera className="inline h-4 w-4 mr-2 text-rose-500" />
                      Upload Photos * (At least 1, max 6)
                    </label>

                    {profileData.profileImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {profileData.profileImages.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-48 object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div
                      {...getRootProps()}
                      className={clsx(
                        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                        isDragActive
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50/50'
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      {isDragActive ? (
                        <p className="text-rose-600 font-medium">Drop photos here...</p>
                      ) : (
                        <>
                          <p className="text-gray-600 mb-2">
                            Drag & drop photos here, or click to select
                          </p>
                          <p className="text-sm text-gray-400">
                            Up to 6 photos (5MB max each)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Location */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <MapPin className="inline h-4 w-4 mr-2 text-rose-500" />
                      Your Location *
                    </label>

                    {profileData.location ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center"
                      >
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-green-700 font-medium">Location captured!</p>
                        <p className="text-sm text-green-600 mt-1">
                          Lat: {profileData.location.lat.toFixed(4)}, Lng:{' '}
                          {profileData.location.lng.toFixed(4)}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">
                          We need your location to find matches nearby
                        </p>
                        <button
                          type="button"
                          onClick={getLocation}
                          className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all font-medium"
                        >
                          Get My Location
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Preferences */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested In *
                    </label>
                    <select
                      value={profileData.interestedIn}
                      onChange={(e) => updateProfileData('interestedIn', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                    >
                      <option value="">Select preference</option>
                      <option value="male">Men</option>
                      <option value="female">Women</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Age Range: {profileData.ageRange.min} - {profileData.ageRange.max} years
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Min Age</label>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          value={profileData.ageRange.min}
                          onChange={(e) =>
                            updateProfileData('ageRange', {
                              ...profileData.ageRange,
                              min: parseInt(e.target.value) || 18,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Max Age</label>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          value={profileData.ageRange.max}
                          onChange={(e) =>
                            updateProfileData('ageRange', {
                              ...profileData.ageRange,
                              max: parseInt(e.target.value) || 35,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Distance Range: {profileData.distanceRange} km
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={profileData.distanceRange}
                      onChange={(e) => updateProfileData('distanceRange', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4 md:mt-6 flex-shrink-0">
            <motion.button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
              whileHover={currentStep !== 1 ? { scale: 1.02 } : {}}
              whileTap={currentStep !== 1 ? { scale: 0.98 } : {}}
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </motion.button>

            {currentStep < STEPS.length ? (
              <motion.button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle2 className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

