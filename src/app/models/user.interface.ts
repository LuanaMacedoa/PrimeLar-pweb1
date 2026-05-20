export interface User {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  senha: string;
  created_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}