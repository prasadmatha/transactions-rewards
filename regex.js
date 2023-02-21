//regex for attributes of user, card entities

export const regex = {
  name: /^[a-zA-Z ]+$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  password:
    /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/,
  mobile: /^[6-9]\d{9}$/,
  username: /^[a-z0-9_\.]+$/,
  expDate: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
  cardNumber: /\d{4}-\d{4}-\d{4}-\d{4}$/,
  nameOnCard: /^[a-zA-Z ]+$/,
  cvv: /^([0-9]{3})$/,
  domainName:
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  cardType: /^[a-zA-Z]+$/,
  transAmount: /^[1-9]/,
};
