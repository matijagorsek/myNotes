export enum UserGender {
    MALE = 0,
    FEMALE = 1,
    IT = 2,
    UNKNOWN = -1
}

export function UserGenderToString(gender: UserGender): number {
    switch (gender) {
        case UserGender.UNKNOWN: return -1
        case UserGender.MALE: return 0
        case UserGender.FEMALE: return 1
        case UserGender.IT: return 2
    }
}

export function StringToUserGender(number: number): UserGender {
    switch (number) {
        case 0: return UserGender.MALE
        case 1: return UserGender.FEMALE
        case 2: return UserGender.IT
        default: return UserGender.UNKNOWN
    }
}