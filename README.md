# Life app
https://travis-ci.org/jimmyqwy/life.svg?branch=master
use MEAN
Angular JS 
express framework
node.js
mongodb

# Heroku
https://jimmy-party.herokuapp.com/

# Mongodb
'mongodb://jimmyqwy:{password}@ds041228.mongolab.com:41228/heroku_app34974984'

# local
supervisor ./bin/www &   -> under project folder
http://localhost:3000/

# API
GET /topics   - get topics  
POST /topics/  - submit a topic  
GET /topics/{topicID} - get detailed info of specific topic  
POST /topics/{topicID}/join/{memberID}  - add an entry (attendance and comments) for specific topic by the current member  
GET /users/ - get all members  
POST /users/ - add a member   
GET /users/{memberID}  - get member Info  
GET /users/{memberID}/entries - get all entries  

