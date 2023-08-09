const express = require('express');
const Todo = require('./Todo');
const List = require('../lists/List');
const httpValidator = require("../../shared/http-validator");
const {
  postTodoSchema,
  getTodoSchema,
  patchTodoSchema,
  deleteTodoSchema,
} = require("./_schemas");
const makeAddTodo = require("./add-todo");
const makeEditTodo = require("./edit-todo");
const makeListTodos = require("./list-todos");
const makeRemoveTodo = require("./remove-todo");
const makeShowTodo = require("./show-todo");

const addTodo = makeAddTodo({ Todo, List})
const editTodo = makeEditTodo({ Todo, List})
const listTodos = makeListTodos({ Todo });
const removeTodo = makeRemoveTodo({ Todo });
const showTodo = makeShowTodo({ Todo });

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const postTodo = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, postTodoSchema);

    const result = await addTodo({ ...req.body, user: req.user.id });

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
const getTodos = async (req, res, next) => {
  try {
    const result = await listTodos({ filters: { user: req.user.id } });

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
const getTodo = async (req, res, next) => {
  try {
    httpValidator({ params: req.params }, getTodoSchema);

    const result = await showTodo({ id: req.params.id, user: req.user.id });

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
const patchTodo = async (req, res, next) => {
  try {
    httpValidator({ params: req.params, body: req.body }, patchTodoSchema);

    const result = await editTodo({
      id: req.params.id,
      user: req.user.id,
      ...req.body,
    });

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
const deleteTodo = async (req, res, next) => {
  try {
    httpValidator({ params: req.params }, deleteTodoSchema);

    const result = await removeTodo({
      id: req.params.id,
      user: req.user.id,
    });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  postTodo,
  getTodos,
  getTodo,
  patchTodo,
  deleteTodo,
};