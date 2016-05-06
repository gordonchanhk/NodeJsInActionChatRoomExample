# NodeJsChatRoomExample

### Introduction

I am reading the book *NodeJS In Action(https://www.manning.com/books/node-js-in-action)*. When I follow the chat room example, I find the version of the Socket.io the example is using is < 1.0, while Socket.io 1.0 has been rewritten so the example no longer work.
I find people raise related question in Stack Overflow without other people really answer, therefore I try to come up a workable solution for that.

### Remark
Reason for the example no longer work with newer Socket.io because of 1.x Socket.io has different member function. For this exmaple I am using `"socket.io": "^1.4.5"`

I also get the code to work with [Heroku](https://heroku.com) and here is the [Demo](gcnodejschat.herokuapp.com)

### Step for you to run it local
1. `git clont https://github.com/gordonchanhk/NodeJsInActionChatRoomExample`
1. `npm install` to run the dependency
1. `node server.js` to launch the NodeJS Application
1. Open browser and go to `http://localhost:8000` as I defult the port as 8000

### Optional work to get the example work in Heroku / work better
- Create the Procfile with defining `web: node server.js`
- Define the `start` script in package.json so you only need to launch the app with `npm start` instead of `node server.js`

### Reference
1. NodeJS In Action https://www.manning.com/books/node-js-in-action
1. Stack Overflow: [Nodejs -socket.io TypeError: Cannot call method 'on' of undefined]( http://stackoverflow.com/questions/31128882/nodejs-socket-io-typeerror-cannot-call-method-on-of-undefined)
