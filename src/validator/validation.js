const mongoose = require('mongoose')
// const objectId = 
const isBodyEmpty = function(data)
{
    if(!Object.keys(data).length==0) return false
    return true 
}


const isValid = function(value)
{
    if(typeof value === 'undefined' || typeof value === null ) return false
    if(typeof value ==='string' && value.trim().length === 0) return false
    return true
}


const isValidOjectId = function(id)
{
    if(mongoose.isValidObjectId(id)) return true;
    return false;
}

const validateEmail = function (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
};

const regex = /[`/\d/!@#$%^&*()_+\=\[\]{};':"\\|.<>\/?~]/
const isVerifyString = function (string) {
    return regex.test(string)
};

const regEx=/^[6-9]\d{9}$/
const isValidMobileNo = function(mobno)
{
    return regEx.test(mobno)
}

// stri -- false ,nu --. true
// const regex1 = /\d/;
// const isVerifyISBN = function (value) {
// return regex1.test(value)
// };
// const checkISBN = function(isbn)  
// {
//     let number = isbn;
//     let enumber= number.replace('-',''); //1234567
//     let bool = isVerifyISBN(enumber)
//     if(bool && enumber.length==13) return true;
//     return false;

// }

// let regexForISBN=/^(?:ISBN(?:-10)?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$)[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
// const checkISBN = function(isbn)
// {
//     return regexForISBN.test(isbn);
// }



module.exports={ isBodyEmpty, isValid,validateEmail,isValidMobileNo, isVerifyString, isValidOjectId}