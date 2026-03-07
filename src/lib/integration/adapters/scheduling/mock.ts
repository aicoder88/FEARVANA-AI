/**
 * Mock Scheduling Adapter
 *
 * Provides mock scheduling functionality for development and testing.
 * Simulates realistic scheduling behavior with in-memory appointments.
 */

import type {
  SchedulingAdapter,
  SchedulingContext,
  Appointment,
  TimeSlot,
  DateRange,
  AppointmentType,
  AppointmentStatus
} from '../../types'
import { getLogger } from '../../utils/logger'
import { ValidationError } from '../../errors'

const logger = getLogger('MockScheduling')

/**
 * Mock Scheduling Adapter
 */
export class MockSchedulingAdapter implements SchedulingAdapter {
  private static instance: MockSchedulingAdapter
  private appointments: Map<string, Appointment[]> = new Map()

  private constructor() {
    logger.info('Mock Scheduling Adapter initialized')
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MockSchedulingAdapter {
    if (!MockSchedulingAdapter.instance) {
      MockSchedulingAdapter.instance = new MockSchedulingAdapter()
    }
    return MockSchedulingAdapter.instance
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return true
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    await this.simulateLatency(30, 80)
    return true
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(customerId: string, days: number = 14): Promise<Appointment[]> {
    await this.simulateLatency(80, 150)

    const customerAppointments = this.getOrCreateAppointments(customerId)
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    const upcoming = customerAppointments.filter(
      (apt) =>
        apt.status === 'scheduled' &&
        apt.startTime >= now &&
        apt.startTime <= futureDate
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

    logger.debug(`Retrieved ${upcoming.length} upcoming appointments for ${customerId}`)

    return upcoming
  }

  /**
   * Get past appointments
   */
  async getPastAppointments(customerId: string, limit: number = 5): Promise<Appointment[]> {
    await this.simulateLatency(80, 150)

    const customerAppointments = this.getOrCreateAppointments(customerId)
    const now = new Date()

    const past = customerAppointments
      .filter((apt) => apt.endTime < now && apt.status === 'completed')
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit)

    logger.debug(`Retrieved ${past.length} past appointments for ${customerId}`)

    return past
  }

  /**
   * Get available time slots
   */
  async getAvailability(dateRange: DateRange): Promise<TimeSlot[]> {
    await this.simulateLatency(100, 200)

    const slots: TimeSlot[] = []
    const currentDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)

    // Generate slots for business hours (9 AM - 5 PM)
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Morning slots (9 AM - 12 PM)
        for (let hour = 9; hour < 12; hour++) {
          const slotStart = new Date(currentDate)
          slotStart.setHours(hour, 0, 0, 0)

          const slotEnd = new Date(slotStart)
          slotEnd.setHours(hour + 1, 0, 0, 0)

          // Randomly make some slots unavailable (70% available)
          const available = Math.random() > 0.3

          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
            available,
            duration: 60
          })
        }

        // Afternoon slots (2 PM - 5 PM)
        for (let hour = 14; hour < 17; hour++) {
          const slotStart = new Date(currentDate)
          slotStart.setHours(hour, 0, 0, 0)

          const slotEnd = new Date(slotStart)
          slotEnd.setHours(hour + 1, 0, 0, 0)

          const available = Math.random() > 0.3

          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
            available,
            duration: 60
          })
        }
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    logger.debug(`Generated ${slots.length} time slots (${slots.filter(s => s.available).length} available)`)

    return slots
  }

  /**
   * Book an appointment
   */
  async bookAppointment(
    customerId: string,
    slot: TimeSlot,
    type: AppointmentType
  ): Promise<Appointment> {
    await this.simulateLatency(100, 200)

    // Validate slot is available
    if (!slot.available) {
      throw new ValidationError('Scheduling', 'Time slot is not available', {
        field: 'slot',
        validationErrors: ['Selected time slot is already booked']
      })
    }

    // Check for conflicts
    const existingAppointments = this.getOrCreateAppointments(customerId)
    const hasConflict = existingAppointments.some(
      (apt) =>
        apt.status === 'scheduled' &&
        ((slot.startTime >= apt.startTime && slot.startTime < apt.endTime) ||
          (slot.endTime > apt.startTime && slot.endTime <= apt.endTime))
    )

    if (hasConflict) {
      throw new ValidationError('Scheduling', 'Appointment conflicts with existing booking', {
        field: 'slot',
        validationErrors: ['Time slot conflicts with another appointment']
      })
    }

    const appointment: Appointment = {
      id: this.generateId(),
      customerId,
      type,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      status: 'scheduled',
      notes: 'Booked via AI Integration Layer'
    }

    existingAppointments.push(appointment)

    logger.info(`Booked ${type} appointment for ${customerId} at ${slot.startTime.toISOString()}`)

    return appointment
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string): Promise<void> {
    await this.simulateLatency(80, 150)

    let found = false

    for (const appointments of this.appointments.values()) {
      const appointment = appointments.find((apt) => apt.id === appointmentId)
      if (appointment) {
        appointment.status = 'cancelled'
        found = true
        logger.info(`Cancelled appointment ${appointmentId}`)
        break
      }
    }

    if (!found) {
      throw new ValidationError('Scheduling', 'Appointment not found', {
        field: 'appointmentId',
        validationErrors: [`Appointment ${appointmentId} does not exist`]
      })
    }
  }

  /**
   * Get scheduling context
   */
  async getSchedulingContext(customerId: string): Promise<SchedulingContext> {
    await this.simulateLatency(150, 250)

    const upcoming = await this.getUpcomingAppointments(customerId, 30)
    const past = await this.getPastAppointments(customerId, 1)

    const context: SchedulingContext = {
      nextAppointment: upcoming.length > 0 ? upcoming[0] : null,
      upcomingAppointments: upcoming.slice(0, 5),
      lastSession: past.length > 0 ? past[0] : null,
      sessionCount: this.getOrCreateAppointments(customerId).filter(
        (apt) => apt.status === 'completed'
      ).length
    }

    logger.debug(`Retrieved scheduling context for ${customerId}`)

    return context
  }

  /**
   * Get or create appointments for customer
   */
  private getOrCreateAppointments(customerId: string): Appointment[] {
    if (!this.appointments.has(customerId)) {
      this.appointments.set(customerId, this.generateInitialAppointments(customerId))
    }

    return this.appointments.get(customerId)!
  }

  /**
   * Generate initial appointments for new customers
   */
  private generateInitialAppointments(customerId: string): Appointment[] {
    const appointments: Appointment[] = []

    // Add a past "completed" session (1 week ago)
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    lastWeek.setHours(10, 0, 0, 0)

    appointments.push({
      id: this.generateId(),
      customerId,
      type: 'coaching-session',
      startTime: lastWeek,
      endTime: new Date(lastWeek.getTime() + 60 * 60 * 1000),
      duration: 60,
      status: 'completed',
      notes: 'Initial coaching session',
      outcome: 'Discussed Sacred Edge philosophy and set initial goals'
    })

    // Add an upcoming session (1 week from now) 30% of the time
    if (Math.random() > 0.7) {
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      nextWeek.setHours(14, 0, 0, 0)

      appointments.push({
        id: this.generateId(),
        customerId,
        type: 'check-in',
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 30 * 60 * 1000),
        duration: 30,
        status: 'scheduled',
        notes: 'Progress check-in'
      })
    }

    return appointments
  }

  /**
   * Simulate network latency
   */
  private async simulateLatency(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `mock_apt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Clear all mock data (useful for testing)
   */
  clearAllData(): void {
    this.appointments.clear()
    logger.info('Cleared all mock scheduling data')
  }

  /**
   * Set appointments for customer (useful for testing)
   */
  setAppointments(customerId: string, appointments: Appointment[]): void {
    this.appointments.set(customerId, appointments)
  }
}
