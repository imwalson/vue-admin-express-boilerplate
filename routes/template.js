const express = require('express');
const router = express.Router();
const Mock = require('mockjs');

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

router.post('/user/login', function (req, res) {
  const { username } = req.body;
  const token = tokens[username];
  let data = {};
  // mock error
  if (!token) {
    data = {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  } else {
    data = {
      code: 20000,
      data: token
    }
  }
  res.status(200).json(data);
})

router.get('/user/info', function (req, res) {
  const { token } = req.query;
  const info = users[token];
  let data = {};

  // mock error
  if (!info) {
    data = {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  } else {
    data = {
      code: 20000,
      data: info
    }
  }

  res.status(200).json(data);
})

router.post('/user/logout', function (req, res) {
  let data = {
    code: 20000,
    data: 'success'
  };
  res.status(200).json(data);
})


router.get('/table/list', function (req, res) {
  const data = Mock.mock({
    'items|30': [{
      id: '@id',
      title: '@sentence(10, 20)',
      'status|1': ['published', 'draft', 'deleted'],
      author: 'name',
      display_time: '@datetime',
      pageviews: '@integer(300, 5000)'
    }]
  });
  const items = data.items;

  res.status(200).json({
    code: 20000,
    data: {
      total: items.length,
      items: items
    }
  });
})


module.exports = router;
