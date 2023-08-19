import request from 'supertest';
import {app} from "../../app";

describe('Ticket Sign up', () => {

  it('should create a new user', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201);
    // Add more assertions based on your response structure
  });

  it('should return a 400 with an invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test',
        password: 'Strong_Password1234!',
      }).expect(400);
  })

  it('should return a 400 with an invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: '1',
      }).expect(400);
  })

  it('should return a 400 with an invalid email & password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: '123',
      }).expect(400)

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test',
        password: 'Strong_Password1234!',
      }).expect(400);
  })

  it('should not signups with existing emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201)

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(409)

  })

  it('should not signups with existing emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201)

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(409)

  })

  it('should set cookie after successful sign up', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@example.com',
        password: 'Strong_Password1234!',
      }).expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();

  })

});