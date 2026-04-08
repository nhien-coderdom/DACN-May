type ROLE = 'CUSTOMER';
export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: ROLE;
    CREATED_AT: string;
    UPDATED_AT: string;
    address?: string;
}

export interface RegisterDTO {
    email: string;
    name: string;
    password: string;
    phone: string;
    address?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: ROLE;
    address?: string;
}
