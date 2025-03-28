const jwt = require('jsonwebtoken');
const { config } = require('./config/config')

const secret = config.apiKey;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0MzEwODAwM30.lfyzogQ5JivfWgK0qaQxqHEbzAa_2rqVn8oRGNa7XQs';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);

console.log(payload);
