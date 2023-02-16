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

module.exports.getEntityDetails = getEntityDetails;
module.exports.createRowinEntity = createRowinEntity;
module.exports.getLastRowOfEntity = getLastRowOfEntity;
