const express = require("express");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpValidator = require("../../shared/http-validator");
const User = require('./User');
const {
  postRegisterUserSchema,
  postLoginUserSchema,
  patchMeSchema,
} = require("./_schemas");
const makeAddUser = require("./add-user");
const makeLoginUser = require("./login-user");
const makeEditUser = require("./edit-user");
const makeShowUser = require("./show-user");
const makeRemoveUser = require("./remove-user");

const addUser = makeAddUser({ User, bcryptjs });
const loginUser = makeLoginUser({ User, bcryptjs, jwt });
const editUser = makeEditUser({ User });
const showUser = makeShowUser({ User });
const removeUser = makeRemoveUser({ User });

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const postRegisterUser = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, postRegisterUserSchema);

    const result = await addUser(req.body);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const postLoginUser = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, postLoginUserSchema);

    const result = await loginUser(req.body);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const patchMe = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, patchMeSchema);

    const result = await editUser({ id: req.user.id, ...req.body });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const getMe = async (req, res, next) => {
  try {
    const result = await showUser({ id: req.user.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const deleteMe = async (req, res, next) => {
  try {
    const result = await removeUser({ id: req.user.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  postRegisterUser,
  postLoginUser,
  patchMe,
  getMe,
  deleteMe,
};