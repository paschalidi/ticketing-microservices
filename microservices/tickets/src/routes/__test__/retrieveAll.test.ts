import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";

const createTicket = async () =>
    request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title: 'Valid price title', price: 122.4})
        .expect(201)


describe('Retrieve all tickets', () => {
    it('should return empty array when there are no tickets saved', async () => {
        const response = await request(app)
            .get(`/api/tickets`)
            .send()
            .expect(200);

        expect(response.body.length).toEqual(0)
    })

    it('should return all existing the tickets', async () => {
        await createTicket();
        await createTicket();
        await createTicket();

        const response = await request(app)
            .get('/api/tickets')
            .send()
            .expect(200);

        expect(response.body.length).toEqual(3)
    });
});
