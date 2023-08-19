import request from 'supertest';
import {app} from "../../app";

describe('Ticket Sign out', () => {
  it('should sign out user', async () => {
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

    const response = await request(app)
      .post('/api/users/signout')
      .send({}).expect(200);

    expect(response.get('Set-Cookie')[0]).toBe('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');

  })

});