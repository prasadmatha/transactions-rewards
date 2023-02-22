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

mysqlConnection();

export async function getData(entity) {
  const [rows] = await pool.query(`select * from ${entity}`);
  return rows;
}

export async function getUserWithCardNumber(body) {
  const [rows] = await pool.query(
    `select * from user inner join card on user.id = card.user_id where email = '${body.email.toLowerCase()}' and card_number = '${
      body.cardNumber
    }' and card_type = '${body.cardType.toLowerCase()}'`
  );
  return rows;
}

export const createRowInTable = async (body, entity) => {
  let query;
  let result;

  if (entity == "user") {
    query = `insert into user (id,name,mobile,email,password,status) values(${
      body.id
    },'${body.name}',
    ${body.mobile},'${body.email.toLowerCase()}','${body.password}','Active')`;
    result = await pool.query(query);
  } else if (entity == "card") {
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
    query = `insert into trans_history (id,user_id,card_id,card_type,trans_amount,cashback,date_time) values(${body.id},${body.user_id},
    ${body.card_id},'${body.cardType}',${body.transAmount},${body.cashback},'${body.dateTime}')`;
    result = await pool.query(query);
  }

  return result[0];
};
