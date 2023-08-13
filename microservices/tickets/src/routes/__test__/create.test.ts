import request from 'supertest';
import {app} from "../../app";
import {Ticket} from "../../models/ticket";

describe('New ticket creation', () => {
    it('should have a route handler listening to /api/tickets for post requests', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({})

        expect(response.status).not.toEqual(404);
    });

    it('should return 401 for _not_ authenticated users', async () => {
        await request(app)
            .post('/api/tickets')
            .send({})
            .expect(401);
    });

    it('should not return 401 for authenticated users', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({})

        expect(response.status).not.toEqual(401);
    });

    it('should return an error when an invalid title is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: '', price: 10})
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({price: 10})
            .expect(400);
    });

    it('should return an error when an invalid price is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: 'Valid price title', price: -10})
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: 'Valid price title'})
            .expect(400);
    });

    it('should create a ticker when inputs are valid', async () => {
        let tickets = await Ticket.find({});
        expect(tickets.length).toEqual(0);

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: 'Valid price title', price: 122.4})
            .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);
        expect(tickets[0].title).toEqual('Valid price title');
        expect(tickets[0].price).toEqual(122.4);
        expect(response.body.title).toEqual('Valid price title');
        expect(response.body.price).toEqual(122.4);
    });
});