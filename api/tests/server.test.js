const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { path,app } = require("./../apptest");
const { Todo } = require("./../models/todo");
const { todos, populateTodos} = require("./seed/seed");

beforeEach(populateTodos);

describe('Get Test /test/:id', () => {
    it('should work [it]', (done) => {
        done();
    })
    it('should get id',(done)=>{
        request(app)
            .get(path+'/test/3')
            .expect(200)
            .expect((res)=>{
                console.log(res.body)
                expect(res.body.message).toBeTruthy(); //exsist
            })
            .end(done);
    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get(path + '/todos')
            // .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                // console.log(res.body)
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    })
});

