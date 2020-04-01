const fs = require('fs');
const Intl = require('intl');
const data = require('../data.json');
const { age, date } = require('../utils');
const { graduation } = require('../utils');


// index
exports.index = function (req, res) {
  return res.render('teachers/index', { teachers: data.teachers });
};

// create
exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Please, fill all the fields');
    }
  }
  let {
    avatarUrl, birth, name, escolarity, type, classes,
  } = req.body;
  birth = Date.parse(birth);
  const createdAt = Date.now();
  const id = Number(data.teachers.length + 1);

  data.teachers.push({
    id,
    name,
    avatarUrl,
    birth,
    escolarity,
    type,
    classes,
    createdAt,
  });
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file erro');
    return res.redirect('/teachers');
  });
};

// show
exports.show = function (req, res) {
  const { id } = req.params;
  const foundTeacher = data.teachers.find((teacher) => teacher.id == id);

  if (!foundTeacher) return res.send('Teacher not found');

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    type: '',
    escolarity: graduation(foundTeacher.escolarity),
    classes: foundTeacher.classes.split(','),
    createdAt: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.createdAt),
  };

  return res.render('teachers/show', { teacher });
};

// edit
exports.edit = function (req, res) {
  const { id } = req.params;

  const foundTeacher = data.teachers.find((teacher) => teacher.id == id);

  if (!foundTeacher) return res.send('Teacher not found');
  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth),
  };
  return res.render('teachers/edit', { teacher });
};

// put
exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;

  const foundTeacher = data.teachers.find((teacher, foundIndex) => {
    if (id == teacher.id) {
      index = foundIndex;
      return true;
    }
  });
  if (!foundTeacher) return res.send('Teacher not found');

  const teacher = {
    ...foundTeacher,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth),
  };
  data.teachers[index] = teacher;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write error');
    return res.redirect(`/teachers/${id}`);
  });
};

// delete
exports.delete = function (req, res) {
  const { id } = req.body;
  const filteredTeachers = data.teachers.filter((teacher) => teacher.id != id);

  data.teachers = filteredTeachers;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error');
    return res.redirect('/teachers');
  });
};
