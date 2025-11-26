
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female'; // Added for BMR Calc
  weight: number; // kg
  height: number; // cm
  goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'endurance';
  level: 'beginner' | 'intermediate' | 'advanced';
  
  // Body Composition
  bodyFat: number; // %
  waist: number; // cm
  chest: number; // cm
  arms: number; // cm
  thighs: number; // cm
  
  // Enhanced Goal Tracking
  targetWeight: number;
  targetWeeklyWorkouts: number;
  targetDailyCalories: number;
  targetDailyProtein: number;
  targetDailyCarbs: number;
  targetDailyFat: number;
  targetDailyFiber: number; // New
  targetDailySteps: number;
  
  // Economy
  credits: number; // For buying gifts
  earnings: number; // From received gifts
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  avgHeartRate?: number;
  intensity?: 'Low' | 'Moderate' | 'High' | 'Peak';
  volume?: number; // Total weight lifted
  sets?: number;
  reps?: number;
}

export interface DietLog {
  id: string;
  date: string;
  meal: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g (New)
}

export interface SleepData {
  date: string;
  hours: number;
  score: number; // 0-100
  stages: {
    deep: number; // %
    light: number; // %
    rem: number; // %
    awake: number; // %
  };
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model'; // Keep for AI
  user?: string; // For Community
  avatar?: string; // For Community
  text: string;
  timestamp: number | string;
  isMe?: boolean; // For Community
  channelId?: string; // For Community routing
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  videoPlaceholder: string; // URL for image
  equipment: 'Bodyweight' | 'Dumbbell' | 'Barbell' | 'Machine';
  steps: string[];
}

// For Active Workout
export interface RoutineExercise {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: string; // e.g., "8-12"
}

export interface Routine {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // est mins
  exercises: RoutineExercise[];
  muscleGroups: MuscleGroup[];
}

export enum MuscleGroup {
  CHEST = 'Chest',
  BACK = 'Back',
  LEGS = 'Legs',
  ARMS = 'Arms',
  SHOULDERS = 'Shoulders',
  ABS = 'Abs',
}

export interface LeaderboardEntry {
  rank: number;
  user: string;
  points: number;
  streak: number;
  avatar: string;
  badges: string[];
  change: 'up' | 'down' | 'same';
  country: string;
  flag: string;
}

export interface Coach {
  id: string;
  name: string;
  specialty: string[];
  rating: number;
  reviews: number;
  rate: number; // per hour
  image: string;
  bio: string;
  online: boolean;
  experience: string;
}

// --- Chat & Community Types ---

export interface ChatChannel {
  id: string;
  name: string;
  type: 'system' | 'user';
  icon?: string;
  description: string;
  members: number;
  ownerId?: string; // To identify if the current user owns this group
}

export interface ChatFriend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage?: string;
}

export interface FriendRequest {
  id: string;
  fromUser: string;
  fromAvatar: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// --- Courses & Live Types ---

export interface LiveStream {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  thumbnail: string;
  viewers: number;
  category: string;
  status: 'live' | 'ended';
  giftsReceived: number; // Total value of gifts
  hypeLevel: number; // 0-100
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: { title: string; duration: string }[];
}

// --- Admin Types ---

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Coach' | 'Admin';
  status: 'Active' | 'Banned' | 'Pending';
  lastActive: string;
  subscription: 'Free' | 'Pro' | 'Elite';
  avatar: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  module: string; // e.g., 'Auth', 'Database', 'AI-Service'
}

export interface AppStats {
  totalUsers: number;
  activeUsers: number; // Daily Active
  premiumUsers: number;
  revenue: number; // Monthly Recurring Revenue
  churnRate: number; // %
}
