# About this project
 - ** LINE MESSAGEの受信 **
 - LINELOGIN 機能
 - LINEBotの送受信メッセージを保存、表示
 - ダミーユーザーを作成してログインするためのテストプロジェクト
 - (LINELOGINを使ったシステムを想定している)

# LINE Message受信対応
## 参考
 - [[Qiita]1時間でLINE BOTを作るハンズオン]([https://qiita.com/n0bisuke/items/ceaa09ef8898bee8369d)
　MessageFormat
 - LINEMessage Format
  - https://developers.line.me/ja/reference/messaging-api/#message-objects
## Nuxt 変更
 nuxt.config.js 

 ```js :nuxt.config.js 
  serverMiddleware:[
    // bodyParser.json(), //delete
    session({
      secret: 'sakaela',
      resave: false,
      saveUninitialized: false,
      cookie            : {
        // maxAge : 1000 * 60 * 60 * 24 * 30, // 30日
        maxAge : 1000 * 60 * 60, // 60min
      }
    }),
    '~/api/webhook', // for Recieve line message ,no bodyparser
    '~/api',         // for Other API , use body parser
  ],
 ```
 - api/index.js で bodyParserを設定 , webhoookではbodyParserを使わない
 ```js :api/index.js
 /** EXPRESS*/
const router = express.Router();
const app = express()
router.use(bodyParser.json());  //move from nuxt.js
 ```
- api/webhook.js 新規、メッセージを受け取る

## dev tool
> ngrok http 3000

## Store DB
 - Model lineMessages

# Project Structure
## Model
  - lineuser : dummy for LINELOGIN user
  - todo     : {_creatotr : _id of lineuser }
## API
[LineMessage webhook]
- Post : /webhook
[ lineuser ]
 - Post: /dummylogin
 [ todo ]
 - post   : /todos
 - get    : /todos
 - get    : /todos/:id
 - delete : /todos:id
 - patch  : /todos/:id
[ test ]
- get     : /test/:id

# Doc for make this project
## Create project
cheoose: vuetify, Universal, axios module ,npm
```
? Project name : mytmp_nuxt_heroku
? Project description : my template for nuxt, vuetify, express, mongodb, mongoose
? Use a custom server framework  :none
? Use a custom UI framework : vuetify
? Choose rendering mode : Universal
? Use axios module : yes
? Use eslint : no
? Author name : testuser
? Choose a package manager :npm
```
## config for Express
- Nuxt.js & Express プロジェクト作成
- https://qiita.com/ta1nakamura/items/417d858d5c93bbf3040e

```
npm install --save express
npm install --save body-parser
npm install cors --save
```
- edit nuxt.config.js
- add /api/index.js , /api/apptest.js

## mongodb, mongoose

```
 npm install mongodb --save
 npm install mongoose --save
```
add fiels
- /api/config/config.js, config.json
- /api/db/mongoose.js
- /api/models/todo.js
- /api/playgournd/mongoose_todo_test.js

test mongoose
> node .\api\playground\mongoose_todo_test.js

## Axios config and Test
```html:index.vue
methods:{
    async onClickTest(context){
      console.log('--onClickTest');
      try{
        let data = await this.$axios.$get('/api/todos');
        console.log(data);
        this.items = data.todos //data()がitemsを返す前提
      }catch(e){
        console.log(e);
      }
    }
  }
```

## API Test
 - mochaによるテスト、mongodb初期化
 - https://qiita.com/ta1nakamura/items/e74e65d0823deb85a054

 ```
 > npm install mocha --save-dev
 > npm install supertest --save-dev
 > npm install expect --save-dev
 ```

edit package.json
追記
```
"scripts": {
    "test-api": "export NODE_ENV=test || SET \"NODE_ENV=test\" && mocha api/**/**.test.js"
  },
```

add files
 - /tests/seed/seed.js
 - /test/server.test.js

run test
```
> npm run test-api
```

## Deploy heroku
- APIを含むNuxt.jsをHerokuへデプロイ
- https://qiita.com/ta1nakamura/items/3d799d1176c15885cc6f


