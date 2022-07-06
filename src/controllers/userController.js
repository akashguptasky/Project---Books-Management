const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const validation = require('../validator/validation')


const registration = async function (req, res) {
  try {
    let data = req.body;
    const { title, name, phone, email, password } = data;
    if (validation.isBodyEmpty(data)) return res.status(400).send({ status: false, message: "Please provide required data" });

    if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "title tag is required" });
    if (!validation.isValid(name)) return res.status(400).send({ status: false, message: "name tag is required" });
    if (!validation.isValid(phone)) return res.status(400).send({ status: false, message: "phone tag is required" });
    if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email tag is required" });
    if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "password tag is required" });

    if (validation.isVerifyString(title)) return res.status(400).send({ status: false, message: "title doesn't contains any digit or symbols" });
    let arr = ["Mr", "Mrs", "Miss"]
    if (!arr.includes(title)) return res.status(400).send({ status: false, message: "Provide valid value for title [Mr,Mrs,Miss]" });
    if (validation.isVerifyString(name)) return res.status(400).send({ status: false, message: "name doesn't contains any digit or symbols" });
    if (!validation.validateEmail(email)) return res.status(400).send({ status: false, message: "Email is Invalid" });
    if (!validation.isValidMobileNo(phone)) return res.status(400).send({ status: false, message: "Mobile number is Invalid" });
    if (password.length < 8) return res.status(400).send({ status: false, message: "password is too short" });
    if (password.length >= 16) return res.status(400).send({ status: false, message: "password is too Long" });

    let isPresentEmail = await userModel.find({ email: email })
    if (isPresentEmail.length != 0) return res.status(400).send({ status: false, message: "Please provide a unique Email Id" });
    let isPresentNumber = await userModel.find({ phone: phone })
    if (isPresentNumber.length != 0) return res.status(400).send({ status: false, message: "Please provide a unique phone number" });



    let save = await userModel.create(data);
    res.status(201).send({ status: true, message: 'Success', data: save });

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};




const login = async function (req, res) {
  try {
    let data = req.body;
    if(validation.isBodyEmpty(data)) return res.status(400).send({ status: false, message: "Please provide required data" });
    let email = req.body.email;
    if(!validation.validateEmail(email)) return res.status(400).send({ status: false, message: "Email is Invalid" });

    let password = req.body.password;
    if (password.length < 8) return res.status(400).send({ status: false, message: "password is too short" });
    if (password.length >= 16) return res.status(400).send({ status: false, message: "password is too Long" });

    let user = await userModel.findOne({ email: email, password: password });
  
    if(!user) return res.status(400).send({ status: false, message: "Input credentials are Invalid" });

    let token = jwt.sign({
      userId: user._id.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60 

    }, "Project3");

    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, message: 'Success', data: token });
  } catch (error) { res.status(500).send({ status: false, messgae: error.message }) }
}
module.exports = {
  registration, login
}
