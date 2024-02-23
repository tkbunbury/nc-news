const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const apiEndpoints = require('../endpoints.json');
const { toBeSortedBy } = require('jest-sorted');
const comments = require('../db/data/test-data/comments');

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
            expect(response.body.msg).toBe('Not Found');
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
            const articles = response.body.articles;
            expect(articles).toBeSortedBy('created_at', { 
                descending: true,
                coerce: true,
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

describe('/api/articles/:article_id/comments', () => {
    test('GET:200 sends an array of comment objects for the given article_id to the client', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            expect(response.body.length).toBe(11);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[1]).toMatchObject({
                comment_id: 2,
                votes: 14,
                created_at: "2020-10-31T03:03:00.000Z",
                author: "butter_bridge",
                body:"The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                article_id: 1,
            })
        })
    })
    test('Comments are sorted with the most recent comments first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const commentsArray = response.body;
            expect(commentsArray).toBeSortedBy('created_at', {
                descending: true,
                coerce: true,
            });
        });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    });
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-an-article/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    test('GET:200 sends an empty array if there are no comments for a particular article_id', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual([]);
        });
    });
});

describe('/api/articles/:article_id/comments', () => {
    test('Status 201: Responds with object containing the newly posted comment', () => {
        const newComment = {
            username: "icellusedkars",
            body: "NEW COMMENT"
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(typeof response.body.comment).toBe("object");
            expect(response.body.comment).toMatchObject({
                comment_id: 19,
                votes: 0,
                author: "icellusedkars",
                body:"NEW COMMENT",
                article_id: 2,
            })
            expect(typeof response.body.comment.created_at).toBe("string");
        })
    })
    test('POST:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const newComment = {
            username: "icellusedkars",
            body: "NEW COMMENT"
        }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    });
    test('POST:400 sends an appropriate status and error message when given an invalid id', () => {
        const newComment = {
            username: "icellusedkars",
            body: "NEW COMMENT"
        }
        return request(app)
        .post('/api/articles/not-an-article/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    test('POST:400 sends an appropriate error response for missing username property', () => {
        const newComment = {
            body: "NEW COMMENT"
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });

    test('POST:400 sends an appropriate error response for missing body property', () => {
        const newComment = {
            username: "icellusedkars"
        };
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});

describe('/api/articles/:article_id', () => {
    test('Status 200: Responds with object containing the article, with updated votes total', () => {
        const updatedVotes = {
            inc_votes: 10
        }
        return request(app)
        .patch('/api/articles/3')
        .send(updatedVotes)
        .expect(200)
        .then((response) => {
            expect(typeof response.body.updatedArticle).toBe("object");
            expect(response.body.updatedArticle).toMatchObject({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                votes: 10,
                author: "icellusedkars",
                body:"some gifs",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
            expect(typeof response.body.updatedArticle.created_at).toBe("string");
        })
    })
    test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .patch('/api/articles/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .patch('/api/articles/not-an-article')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    test('PATCH:400 sends an appropriate error response for non-integer vote value', () => {
        const newComment = {
            inc_votes: 'A LOT OF VOTES'
            
        };
        return request(app)
        .patch('/api/articles/3')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});

describe('/api/comments/:comment_id', () => {
    test('DELETE 204: Deletes the specified comment and sends no body back', () => {
        return request(app)
        .delete('/api/comments/4')
        .expect(204)
    })
    test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    });
    test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/not-a-comment')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});

describe('/api/users', () => {
    test('GET:200 sends an array of user objects to the client', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
            expect(typeof user.username).toBe('string');
            expect(typeof user.name).toBe('string');
            expect(typeof user.avatar_url).toBe('string');
        });
        });
    });
});


describe('/api/articles?topic=${topic}', () => {
    test('GET:200 sends an array of article objects filtered by topic to the client', () => {
        const topic = 'mitch';
        return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then((response) => {
        expect(response.body.articles.length).toBeGreaterThan(0);
        expect(Array.isArray(response.body.articles)).toBe(true);
        response.body.articles.forEach((article) => {
            expect(article.topic).toBe(topic);
        });
        });
    });
});