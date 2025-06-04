export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  joinDate: Date;
  avatar: string;
  bio: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse {
  message: string;
  user: UserProfile;
}