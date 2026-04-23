
export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER'

export interface User {
    id : number
    email : string
    name : string
    phone : string
    address? : string | null
    createdAt : string
    updatedAt : string
    deletedAt? : string | null
    isDeleted : boolean
    isActive : boolean
    role : UserRole
    loyaltyPoint : number
    totalOrders : number
    totalSpent : number

}

export interface CreateUserDTO {
    email : string
    name : string
    phone : string
    password? : string
    role : UserRole
}


export interface UpdateUserDTO {
    name? : string
    phone? : string
    address? : string | null
}

export interface UpdateUserRoleDTO {
    role : UserRole
}



