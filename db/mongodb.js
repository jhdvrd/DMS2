import { MongoClient } from 'mongodb';


import { db } from './dbPool.js'; 

const logonUsers = new Map();


const findUser = async (username) => 
  db.collection('users').findOne({ username });


const getAllData = async () => 
  db.collection('data').find({}).toArray();


const getDataById = async (id) => 
  db.collection('data').findOne({ id });

const addData = async ({ id, Firstname, Surname, userid }) =>
  db.collection('data').insertOne({ id, Firstname, Surname, userid });


const getUsersRecords = async () => {

  return db.collection('users').find({}).toArray();
};


const updateData = async (id, { Firstname, Surname, userid }) =>
  db.collection('data').updateOne(
    { id },
    { $set: { Firstname, Surname, userid } }
  );


const deleteData = async (id) =>
  db.collection('data').deleteOne({ id });


const executeWithTransaction = async (operation) => {
  const session = db.client.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await operation(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
};


const addDataTransactional = async ({ id, Firstname, Surname, userid }) =>
  executeWithTransaction(async (session) =>
    db.collection('data').insertOne({ id, Firstname, Surname, userid }, { session })
  );


export {
  addData,
  findUser,
  getAllData,
  getDataById,
  logonUsers,
  deleteData,
  updateData,
  getUsersRecords,
};