/**
 * User entity - Core domain model
 * Represents a user/customer in the system
 */

/**
 * User domain entity
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  isEmailVerified: boolean;
}

/**
 * Extended user profile with additional information
 */
export interface UserProfile extends User {
  username: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User roles enum
 */
export enum UserRole {
  Admin = 'Admin',
  Client = 'Client',
  Guest = 'Guest'
}
