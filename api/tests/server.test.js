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
    it('[async] should get id',async()=>{
        let res = await request(app)
            .get(path+'/test/3')
            .expect(200)       
        expect(res.body.message).toBeTruthy(); //exsist
         // throw new Error('--error test in mocha')
           
    })
});

describe('GET /todos', () => {
    it('[async] should get all todos', async () => {
        let res= await request(app)
            .get(path + '/todos')
            // .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            expect(res.body.todos.length).toBe(2);
    })
});

describe('POST /todos', () => {
    // async/await version
    it('[async] should create a new todo', async () => {
        var text = '[async] Test todo text';
        let res = await request(app)
            .post(path + '/todos')
            .send({ text })
            .expect(200)
        expect(res.body.text).toBe(text);
        
        let todos = await Todo.find({ text })
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
    });
});

describe('GET /todos/:id', () => {
    it('[async] should return todo doc',async ()=>{
        let res = await request(app)
            .get(path + `/todos/${todos[0]._id.toHexString()}`).expect(200);
            // .set('x-auth', users[0].tokens[0].token)
        expect(res.body.todo.text).toBe(todos[0].text);
    });
});

describe('DELETE /todos/:id', () => {
    it('[async] should remove a todo', async() => {
        var hexId = todos[1]._id.toHexString();
        let res = await request(app)
            .delete(path + `/todos/${hexId}`)
            // .set('x-auth', users[1].tokens[0].token)
            .expect(200)
        expect(res.body.todo._id).toBe(hexId);
            
        let todo= await Todo.findById(hexId)
        // expect(todo).toNotExist();
        expect(todo).toBeFalsy();
    });
})

describe('PATCH /todos/:id', () => {
    it('[async] should update the todo', async () => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';
        let res = await request(app)
            .patch(path + `/todos/${hexId}`)
            // .set('x-auth', users[0].tokens[0].token)
            .send({ completed: true, text })
            .expect(200)
            
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');    
    });
});