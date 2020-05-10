import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '../CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12346544564',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12346544564');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12346544564',
    });

    // rejects: espera que a promise seja rejeitada
    // toBeInstanceOf: seja uma instacia de AppError
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12346544564',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
