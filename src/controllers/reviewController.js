const validation = require('../validator/validation')
const booksModel = require('../models/booksModel')
const reviewModel = require('../models/reviewModel')
const moment = require('moment')

const createReview = async function(req,res)
{
    try{
    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false, message:"please provide bookId"})
    if(!validation.isValidOjectId(bookId)) return res.status(400).send({status:false, message:"bookId is invalid"})
    
    let idExistOrNot = await booksModel.findOne({_id:bookId, isDeleted:false})
    if(!idExistOrNot) return res.status(404).send({status:false, message:"None of the books exists on this bookId"})
    // here i want to get review count, if i got any object

    let prevReviewCount = idExistOrNot.reviews // when we have to need to know , prevReivewCount then we can use this variable



    // review, rating, reviewer's name

  let data = req.body;
// check all mandetory tags
  if(!validation.isBodyEmpty(data)) return res.status(400).send({status:false, message:"Please provide required data like reviewdBy, rating,..."})
  let {reviewedBy,review,rating,reviewedAt} = data;
  if (!validation.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "reviewdBy tag is required" });
  reviewedBy = reviewedBy.trim().split(" ").filter(word => word).join(" ")

  if (!validation.isValid(rating)) return res.status(400).send({ status: false, message: "Rating tag is required" });
  if (validation.isVerifyString(reviewedBy)) return res.status(400).send({ status: false, message: "ReviewdBy should contains only characters" });
  reviewedBy = reviewedBy.trim().split(" ").filter(word => word).join(" ")

  if (!reviewedAt) return res.status(400).send({ status: false, message: "reviewedAt tag is required" });

  if(!validation.checkRating(rating)) return res.status(400).send({ status: false, message: "please enter a valid rating value : 1 to 5" });


  if (!validation.isValidRelAt(reviewedAt)) return res.status(400).send({ status: false, message: "Date is Invalid" });
   
  if (!moment(data.reviewedAt, "YYYY-MM-DD", true).isValid()) return res.status(400).send({ status: false, message: "Please Provide a valid date formate:'YYYY-MM-DD'" });

  // if old date then it return positive number;
  let date = moment().diff(reviewedAt, 'months')
  console.log(date)
  if (date != 0) return res.status(400).send({ status: false, message: "You can not insert old date and future date. you have to insert current date" });

  let filter = {
    bookId:bookId,
    ...data
  }

  if(review)
  {
    if(!validation.isValid(review)) return res.status(400).send({ status: false, message: "review tag should not be empty" });
    review = review.trim().split(" ").filter(word => word).join(" ")
    filter["review"]=review;
  }

  let incReviewCount = await booksModel.findOneAndUpdate({_id:bookId},{$set:{reviews:prevReviewCount+1}})
  let createReviewData = await reviewModel.create(filter);
  res.status(201).send({status:true, message:'Success', data:createReviewData})
} catch(error){
    res.status(500).send({status:false,message:error.message})
}   
}




// PUT /books/:bookId/review/:reviewId
// Update the review - review, rating, reviewer's name.
// Check if the bookId exists and is not deleted before updating the review. 
// Check if the review exist before updating the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this


// update review 

const updateReivewData = async function(req,res)
{

}


// delete review data 
const deleteReviewData = async function(req,res)
{
  try{
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId

    if(!bookId) return res.status(400).send({status:false, message:"please provide bookId"})
    if(!validation.isValidOjectId(bookId)) return res.status(400).send({status:false, message:"bookId is invalid"})

    if(!reviewId) return res.status(400).send({status:false, message:"please provide reviewID"})
    if(!validation.isValidOjectId(reviewId)) return res.status(400).send({status:false, message:"reviewId is invalid"})

    let bookIdExistOrNot = await booksModel.findById({_id:bookId,isDeleted:false})
    if(!bookIdExistOrNot) return res.status(404).send({status:false, message:`None of the books exists on this [${bookId}] bookId`})
    let prevReviewCount = bookIdExistOrNot.reviews
    let reviewIdExistOrNot = await reviewModel.findById({_id:reviewId,isDeleted:false})
    if(!reviewIdExistOrNot) return res.status(404).send({status:false, message: `None of the review exists on this [${reviewId}] reviewId`})

    let reviewAvailWithThisId = await reviewModel.findOne({_id:reviewId,isDeleted:false,bookId:bookIdExistOrNot._id})
    if(!reviewAvailWithThisId) return res.status(404).send({status:false, message:  `None of the review exists on this [${bookId}] bookId`})

    let decReviewCount = await booksModel.findOneAndUpdate({_id:bookId},{$set:{reviews:prevReviewCount-1}})
    let delReviewData = await reviewModel.findOneAndUpdate({_id:reviewId},{$set:{isDeleted:true}})

    res.status(200).send({status:false, message:"Review Deleted Successfully"});

  }catch(error){
    res.status(500).send({status:false,message:error.message})
  }   
    
}



module.exports = {createReview,updateReivewData,deleteReviewData}