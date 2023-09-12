const express = require('express');
const { User } = require('../model/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {sanitizeUser }= require('../services/common');

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
      const user = new User({ ...req.body, password: hashedPassword, salt });

      try {
        const doc = await user.save();
        const token = await jwt.sign(sanitizeUser(doc), 'SECRET_KEY');
        console.log('----------token :',token);
        res.status(201).json(token);
      } catch (err) {
        res.status(400).json(err);
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  res.json(req.user);
};

exports.checkUser = async (req, res) => {
  res.json({ status: 'success', user: req.user });
};
