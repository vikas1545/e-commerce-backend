const express = require("express");
const {User} = require("../model/User");

// exports.createUser = async (req, res) => {
//   const user = new User(req.body);

//   try {
//     const doc = await user.save();
//     res.staus(200).json(doc);
//   } catch (err) {
//     res.staus(400).json(err);
//   }
// };

exports.fetchUserById = async(req,res)=> {
    const {id}=req.params;
    try{
        const user = await User.findById(id,'name email id').exec();
        res.status(200).json(user);
    }catch(err) {
        res.status(400).json(err);
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  };