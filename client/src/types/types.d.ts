interface CollectionStateType {
    notifications: {
        all: any[],
        lastUpdated: Date | null
    },
    transactions: {
        all: any[],
        lastUpdated: Date | null
    },
    documents: {
        all: any[],
        lastUpdated: Date | null
    },
    tasks: {
        all: any[],
        lastUpdated: Date | null
    },
    lastUpdated: Date | null
}

interface SettingStateType {
    baseLink: string,
    originalLink: string,
    schoolAdded: boolean,
    school: string | null,
    defaultProfilePic: string
}

interface UserStateType {
    username: string | null,
    id: string | null,
    password: string | null,
    email: string | null,
    numbers: string | null,
    type: string | null,
    profilePic: string | null,
    isLoggedIn: boolean,
    isAdmin: boolean,
    isParent: boolean,
    parent: any,
    parentStudents: any[]
}