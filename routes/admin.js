const express = require('express');
const router = express.Router();

// GET - página de login admin
router.get('/login', function (req, res) {
  res.render('adminLogin', { titulo: 'Login Admin - Taskfy' });
});

// POST - login admin
router.post('/login', async function (req, res) {
  const { email, senha } = req.body;

  const admin = await global.banco.buscarAdmin({ email, senha });

  if (admin && admin.id_admin) {
    global.adminlogado = true;
    global.adminemail = admin.email_admin;
    res.render('admUsersPage', { titulo: 'Administração de Usuários' });
  } else {
    res.redirect('/admin/login');
  }
});

// GET - logout admin
router.get('/logout', function (req, res) {
  global.adminlogado = false;
  global.adminemail = null;
  res.redirect('/admin/login');
});

module.exports = router;
