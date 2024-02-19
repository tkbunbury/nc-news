const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const apiEndpoints = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end());


describe('404 handler', () => {
    test('responds with 404 status code for non-existent routes', () => {
        return request(app)
        .get('/non-existent-route')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('Route not found');
        });
    });
});

describe('/api/topics', () => {
    test('GET:200 sends an array of topic objects to the client', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe('string');
            expect(typeof topic.slug).toBe('string');
        });
        });
    });
});

describe('/api', () => {
    test('GET:200 sends an object containing all available endpoints to the client', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
        expect(response.type).toBe('application/json');
        Object.keys(apiEndpoints).forEach(endpoint => {
            expect(response.body[endpoint]).toEqual(apiEndpoints[endpoint]);
        })
        });
    });
});