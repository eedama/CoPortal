import mongoose from "mongoose";
import { ObjectId } from "bson";
interface ModuleType extends mongoose.Document {
    name: string,
    code: string,
    description: string,
    date: Date,
    removed: Boolean,
    notes: Array<any>,
    questionaires: Array<any>,
    students: Array<string | StudentType>,
    lecturers: Array<string | LecturerType>
}

interface StudentType extends mongoose.Document {
    firstname: string,
    lastname: string,
    gender: string,
    username: string,
    password: string,
    email: string,
    role: string,
    numbers: number,
    profilePic: string,
    active: Boolean,
    date: Date,
    removed: Boolean,
    dob: Date,
    isSouthAfrican: Boolean,
    contactNumbers: string,
    idNumber: string,
    parents: Array<StudentParentType>,
    transactions: Array<any>,
    notifications: Array<any>,
    solutions: Array<SolutionType>,
    documents: Array<any>,
    modules: Array<string | ModuleType>,
    deviceTokens: Array<DeviceTokenType>
}

interface StudentParentType {
    _id?: ObjectId,
    surname?: string,
    name?: string,
    contactNumbers?: string,
    email?: string,
    relationship?: string,
    password?: string,
    status?: string
}

interface LecturerType extends mongoose.Document {
    firstname: string,
    lastname: string,
    gender: string,
    username: string,
    password: string,
    email: string,
    role: string,
    active: Boolean,
    numbers: number,
    profilePic: string,
    date: Date,
    removed: Boolean,
    dob: Date,
    isSouthAfrican: Boolean,
    contactnumbers: string,
    idNumber: string,
    transactions: Array<any>,
    notifications: Array<any>,
    questionaires: Array<string | QuestionaireType>,
    documents: Array<any>,
    modules: Array<string | ModuleType>,
    deviceTokens: Array<DeviceTokenType>
}

interface AdminType extends mongoose.Document {
    username: string,
    password: string,
    email: string,
    role: string,
    numbers: number,
    profilePic: string,
    date: Date,
    removed: Boolean,
    transactions: Array<any>,
    notifications: Array<any>,
    documents: Array<any>,
    deviceTokens: Array<DeviceTokenType>
}

interface NotificationType extends mongoose.Document {
    fromId: AdminType,
    toId: AdminType,
    businessID: any,
    topic: string,
    title: string,
    body: string,
    data: Object,
    icon: string,
    type: string,
    status: string,
    viewedDates: Array<Date>,
    date: Date,
    scheduled: Boolean,
    scheduleInterval: string, // cron format e.g. * * * * * (seconds{optional} minute hour day month year )
    expiryDate: Date,
    removed: Boolean
}

interface SolutionType extends mongoose.Document {
    questionaireId: string | QuestionaireType,
    studentId: StudentType,
    answers: Array<{
        question: {
            id: string
        },
        answer: String,
        correctAnswer: String
    }>,
    mark: number,
    feedbacks: Array<any>,
    isMemo: Boolean,
    date: Date,
    removed: Boolean
}

interface QuestionaireType extends mongoose.Document {
    title: string,
    lecturerID: string | LecturerType,
    moduleID: string | ModuleType,
    questions: Array<any>
}

interface MarksheetType extends mongoose.Document {
    title: string,
    lecturerID: string | LecturerType,
    date: Date,
    type: string,
    total: number,
    moduleID: string | ModuleType,
    studentMarks: Array<{
        studentID: string | StudentType,
        mark: number
    }>
}


interface LecturerNoteType extends mongoose.Document {
    title: string,
    file: {
        base64StringFile: string,
        fileName: string
    }
}

interface ReportType extends mongoose.Document {
    title: string,
    studentId: string | StudentType,
    lecturerId: string | LecturerType,
    method: string,
    subject: string,
    message: string,
    html: string,
    parents: Array<string | StudentParentType>,
    status?: string
}

interface AnnouncementType extends mongoose.Document {
    lecturerId: LecturerType | string,
    studentId: StudentType | string,
    moduleId: ModuleType | string,
    title: string,
    message: string,
    type: string,
    done: Boolean,
    seenBy: Array<string | StudentType>,
    deletedBy: Array<string | StudentType>,
    date: Date,
    dueDate: Date | null,
    removed: Boolean
}

interface SurveyType extends mongoose.Document {
    surveyTemplateId: SurveyTemplateType | string,
    attendanceId: AttendanceType | string,
    moduleId: ModuleType | string,
    students: Array<{
        studentId: StudentType | string,
        date: Date,
        answers: Array<{
            questionId: String,
            question: String,
            answer: String
        }>
    }>,
    date: Date,
}

interface AttendanceType extends mongoose.Document {
    lecturerId: LecturerType | string,
    students: Array<{
        date: Date,
        studentId: StudentType | string
    }>,
    code: string,
    moduleId: ModuleType | string,
    date: Date,
    expireDate: Date | null,
    removed: Boolean
}

interface SurveyTemplateType extends mongoose.Document {
    title: string,
    lecturerId: LecturerType | string,
    questions: Array<{
        question: string,
        type: string,
        options: Array<any>,
        optional: Object,
        maxLength: number
    }>,
    code: string,
    moduleId: ModuleType | string,
    date: Date,
    expireDate: Date | null,
    removed: Boolean
}

// Sub classes
interface NotificationPayloadType {
    notification: {
        title: string,
        body: string
    },
    data: {
        link: string,
        props: string
    }
}

interface DeviceTokenType {
    date: Date,
    lastActiveDate?: Date,
    token: string,
    deviceInfo?: {
        deviceType: string,
        screen: {
            width: string,
            height: string,
            scale: string,
            widthPixels: string,
            heightPixels: string
        },
        model: string,
        manufacturer: string,
        os: string,
        osVersion: string,
        sdkVersion: string,
        language: string,
    },
    dateRemoved?: Date,
    removed?: Boolean
}