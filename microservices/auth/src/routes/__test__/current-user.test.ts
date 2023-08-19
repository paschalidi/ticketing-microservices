import request from 'supertest';
import {app} from "../../app";

describe('Current Ticket', () => {
  it('should have details in the response about the current user', async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toBe('test@example.com');
  })

  it('should not have any details about the current user', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull()
  })
});