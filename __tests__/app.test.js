const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const apiEndpoints = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end());

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
        expect(response.body).toEqual(apiEndpoints);
        });
    });
});

describe('/api/articles/:article_id', () => {
    test('GET:200 sends a single article to the client', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.author).toBe('butter_bridge');
        expect(response.body.article.title).toBe('Living in the shadow of a great man');
        expect(response.body.article.body).toBe('I find this existence challenging');
        expect(response.body.article.topic).toBe('mitch');
        expect(response.body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('NO article found for article_id: 999');
        });
    });
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-an-article')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});

describe('/api/articles', () => {
    test('GET:200 sends an array of article objects to the client', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            console.log(response.body.articles, '<<<< artttytyt')
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
            expect(typeof article.author).toBe('string');
            expect(typeof article.title).toBe('string');
            expect(typeof article.article_id).toBe('number');
            expect(typeof article.topic).toBe('string');
            expect(typeof article.created_at).toBe('string');
            expect(typeof article.votes).toBe('number');
            expect(typeof article.article_img_url).toBe('string');
            expect(typeof article.comment_count).toBe('number');
        });
        });
    });
    test('Articles are sorted in descending order based on created_at date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
        response.body.articles.forEach((article) => {
            const currentCreatedAt = new Date(article.created_at).getTime();
            const nextCreatedAt = new Date(article.created_at).getTime();
            expect(currentCreatedAt).toBeGreaterThanOrEqual(nextCreatedAt);
        });
        });
    });
    test('No articles contain a body property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
        response.body.articles.forEach((article) => {
            expect(article.body).toBeUndefined()
        });
        });
    });
});