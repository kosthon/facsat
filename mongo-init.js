// mongo-init.js
const username = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
const password = process.env.MONGO_INITDB_ROOT_PASSWORD || 'example';
const database = process.env.MONGO_INITDB_DATABASE || 'facsat';
const collection = process.env.MONGO_INITDB_COLLECTION || 'datas';

db.createUser({
  user: username,
  pwd: password,
  roles: [
    {
      role: 'readWrite',
      db: database
    }
  ]
});

db.createCollection(collection);
