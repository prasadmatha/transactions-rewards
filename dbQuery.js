const datahash = require("./datahash");

//getting specific row of an entity with the given constraint
async function getEntityDetails(db, body, entity) {
  let dbQuery;
  try {
    if (entity == "user") {
      if (!body.mobile) {
        dbQuery = `select * from ${entity} where email = '${body.email.toLowerCase()}'`;
      } else {
        dbQuery = `select * from ${entity} where email = '${body.email.toLowerCase()}' or mobile = ${
          body.mobile
        }`;
      }
    }
    if (entity == "card") {
      dbQuery = `select * from ${entity}`;
    }

    if (entity == "reward_rules") {
      dbQuery = `select * from ${entity} where card_type = '${body.cardType.toLowerCase()}'`;
    }

    return new Promise((resolve, reject) => {
      db.query(dbQuery, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  } catch (e) {
    console.log(e.message);
  }
}

//creating row in an entity
async function createRowinEntity(db, body, entity) {
  try {
    let dbQuery;
    if (entity == "user") {
      dbQuery = `insert into ${entity} (id,name,mobile,email,password,status) values(
        ${body.id},'${body.name}',${body.mobile},'${body.email}','${body.password}','Active'
    )`;
    }
    if (entity == "card") {
      dbQuery = `insert into ${entity} (id,user_id,card_number,name_on_card,card_type,exp_date,cvv,status) values(
            ${body.id},'${body.userID}','${body.cardNumber}','${body.nameOnCard}','${body.cardType}','${body.expDate}',${body.cvv},'Active'
        )`;
    }
    if (entity == "trans_history") {
      dbQuery = `insert into trans_history(id,user_id,card_id,card_type,trans_amount,cashback,date_time) values(
        ${body.id},${body.user_id},${body.card_id},'${body.cardType}',${body.transAmount},${body.cashback},'${body.dateTime}'
      )`;
    }

    return new Promise((resolve, reject) => {
      db.query(dbQuery, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  } catch (e) {
    console.log(e.message);
  }
}

//getting last row of an entity
async function getLastRowOfEntity(db, entity) {
  try {
    let dbQuery = `select * from ${entity} order by id desc limit 1 offset 0`;
    return new Promise((resolve, reject) => {
      db.query(dbQuery, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  } catch (e) {
    console.log(e.message);
  }
}

//getting last row of an entity
async function getUserAndCardDetails(db, body) {
  try {
    let dbQuery = `select * from user inner join card on user.id = card.user_id where email = '${body.email.toLowerCase()}' and card_number = '${
      body.cardNumber
    }' and card_type = '${body.cardType}'`;
    return new Promise((resolve, reject) => {
      db.query(dbQuery, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  } catch (e) {
    console.log(e.message);
  }
}

//getting last row of an entity
async function getTransHistoryDetails(db, body) {
  try {
    let dbQuery = `select * from trans_history order by id desc limit 1 offset 0`;
    return new Promise((resolve, reject) => {
      db.query(dbQuery, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  } catch (e) {
    console.log(e.message);
  }
}

module.exports.getEntityDetails = getEntityDetails;
module.exports.createRowinEntity = createRowinEntity;
module.exports.getLastRowOfEntity = getLastRowOfEntity;
module.exports.getUserAndCardDetails = getUserAndCardDetails;
