export const ROLE = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export const DOCTOR_SPECIALIZATION = {
  ANESTHESIOLOGY: 'ANESTHESIOLOGY',
  CARDIOLOGY: 'CARDIOLOGY',
  DERMATOLOGY: 'DERMATOLOGY',
  EMERGENCY_MEDICINE: 'EMERGENCY_MEDICINE',
  ENT: 'ENT',
  GENERAL_PRACTICE: 'GENERAL_PRACTICE',
  INTERNAL_MEDICINE: 'INTERNAL_MEDICINE',
  NEUROLOGY: 'NEUROLOGY',
  OBSTETRICS_AND_GYNECOLOGY: 'OBSTETRICS_AND_GYNECOLOGY',
  ONCOLOGY: 'ONCOLOGY',
  ORTHOPEDICS: 'ORTHOPEDICS',
  PEDIATRICS: 'PEDIATRICS',
  PSYCHIATRY: 'PSYCHIATRY',
  RADIOLOGY: 'RADIOLOGY',
  SURGERY: 'SURGERY',
  UROLOGY: 'UROLOGY',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const MEDICINE_FORM = {
  TABLET: 'TABLET',
  CAPSULE: 'CAPSULE',
  INJECTION: 'INJECTION',
  SYRUP: 'SYRUP',
  CREAM: 'CREAM',
} as const;

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  CREDIT_CARD: 'CREDIT_CARD',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
  PROMPTPAY: 'PROMPTPAY',
} as const;

export const TIMESCHEDULE = {
  '08:00': '08:00',
  '08.30': '08:30',
  '09:00': '09:00',
  '09.30': '09:30',
  '10:00': '10:00',
  '10.30': '10:30',
  '11:00': '11:00',
  '11.30': '11:30',
  '12:00': '12:00',
  '12.30': '12:30',
  '13:00': '13:00',
  '13.30': '13:30',
  '14:00': '14:00',
  '14.30': '14:30',
  '15:00': '15:00',
  '15.30': '15:30',
  '16:00': '16:00',
  '16.30': '16:30',
  '17:00': '17:00',
  '17.30': '17:30',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type Gender = (typeof GENDER)[keyof typeof GENDER];
export type DoctorSpecialization =
  (typeof DOCTOR_SPECIALIZATION)[keyof typeof DOCTOR_SPECIALIZATION];
export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];
export type MedicineForm = (typeof MEDICINE_FORM)[keyof typeof MEDICINE_FORM];
export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export type TimeSchedule = (typeof TIMESCHEDULE)[keyof typeof TIMESCHEDULE];
