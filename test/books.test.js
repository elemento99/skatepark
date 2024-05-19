import { app } from '../index.js'
import request from 'supertest'

describe("GET /api/v1/books", () => {

    it("Comprobar que la solicitud me devuelva un código 200", (done) => {
        request(app)
            .get('/api/v1/books')
            .expect(200)
        done()
    })

    it("Comprobar que la respuesta sea un JSON", (done) => {
        request(app)
            .get('/api/v1/books')
            .expect("Content-Type", /json/)
        done()
    })

    it("responds with json containing a list of books", (done) => {
        request(app)
            .get("/api/v1/books")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                // verificar si la respuesta es un array
                if (!Array.isArray(res.body)) {
                    return done(new Error("Expected an array"));
                }

                // verificar si la respuesta tiene al menos un elemento
                if (res.body.length === 0) {
                    return done(new Error("Expected at least one element"));
                }

                // verificar si el primer elemento tiene las propiedades esperadas
                const book = res.body[0];

                if (!book.hasOwnProperty("id")) {
                    return done(new Error("Expected an id property"));
                }

                if (!book.hasOwnProperty("name")) {
                    return done(new Error("Expected a name property"));
                }

                if (!book.hasOwnProperty("author")) {
                    return done(new Error("Expected an author property"));
                }

                if (!book.hasOwnProperty("price")) {
                    return done(new Error("Expected an price property"));
                }

                done();
            });
    });

})