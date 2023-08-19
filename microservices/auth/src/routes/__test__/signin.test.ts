import request from 'supertest';
import {app} from "../../app";

describe('Ticket Sign in', () => {

  it('should allow user to sign in', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(200);
  });

  it('should return a 400 when user isnt sign up', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'i_dont_exist@test.com',
        password: 'i_dont_exist',
      }).expect(400);
  })

  it('should return a 400 when user exists but credentials are invalid', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'i_am_wrong',
      }).expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'i_am_wrong@example.com',
        password: 'I_am_correct123',
      }).expect(400);
  })

  it('should set cookie after successful sign up', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();

  })

});