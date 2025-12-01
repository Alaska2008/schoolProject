export type Role = "teacher" | "parent" | "admin" | "student" | "superAdmin";

export interface User {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
    // role: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
