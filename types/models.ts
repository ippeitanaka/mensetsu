export interface Teacher {
  id: string
  name: string
  email: string
  created_at: string
}

export interface AvailableSlot {
  id: string
  teacher_id: string
  date: string
  start_time: string
  end_time: string
  is_full: boolean
  created_at: string
  teacher?: Teacher
}

export interface TimeSlot {
  start: string
  end: string
}
