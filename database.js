import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

let pool;
const mysqlConnection = async () => {
  pool = mysql
    .createPool({
      host: process.env.host,
      user: process.env.username,
      password: process.env.password,
      database: process.env.database,
    })
    .promise();
};

//initializing connection to mysql
mysqlConnection();

//get data of an entity
export async function getData(entity) {
  const [rows] = await pool.query(`select * from ${entity}`);
  return rows;
}

//getUserWithEmailAndCardNumber
export const checkEmailAndCardNumberValid = async (body) => {
  let query = `select * from user inner join card on user.id = card.user_id where email = '${body.email.toLowerCase()}' and card_number = '${
    body.cardNumber
  }'`;
  let [rows] = await pool.query(query);
  return rows[0];
};

//get reward rule
export const getRewardRule = async (data) => {
  let query = `select * from card_types inner join reward_rules on card_types.id = reward_rules.card_type_id where 
  card_type = '${data.card_type}' and ${data.trans_amount} >= min_trans_amount and ((${data.trans_amount} between from_amount and to_amount) or (${data.trans_amount} > to_amount and reward_type = 'sum'))`;
  let [rows] = await pool.query(query);
  return rows[0];
};

//creating a row in a table
export const createRowInTable = async (body, entity) => {
  let query;
  let result;

  if (entity == "user") {
    //if entity is user
    query = `insert into user (id,name,mobile,email,password,status) values(${
      body.id
    },'${body.name}',
    ${body.mobile},'${body.email.toLowerCase()}','${body.password}','Active')`;
    result = await pool.query(query);
  } else if (entity == "card") {
    //if entity is card
    query = `insert into card (id,user_id,card_number,name_on_card,card_type,exp_date,cvv,status) values(${
      body.id
    },${body.userID},
    '${body.cardNumber}','${
      body.nameOnCard
    }','${body.cardType.toLowerCase()}','${body.expDate}',${
      body.cvv
    },'Active')`;
    result = await pool.query(query);
  } else if (entity == "trans_history") {
    //if entity is trans_history
    query = `insert into trans_history (id,user_id,card_id,trans_amount,cashback) values(${body.trans_id},${body.user_id},
    ${body.id},${body.trans_amount},${body.cashback})`;
    result = await pool.query(query);
  }
  return result[0];
};
