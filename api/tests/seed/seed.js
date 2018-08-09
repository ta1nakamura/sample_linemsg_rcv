const { ObjectID } = require("mongodb");
// const jwt = require("jsonwebtoken")

const { Todo } = require("./../../models/todo")

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [{
    _id: new ObjectID(),
    text: 'First test tod',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test tod',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}



module.exports = {
    todos,
    populateTodos,
}
