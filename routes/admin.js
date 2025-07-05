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
    res.redirect('/admin/usuarios'); // <- redireciona para a rota que busca os dados
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

router.get('/usuarios', async function(req, res) {
  if (!global.adminlogado) {
    return res.redirect('/admin/login');
  }
  const usuarios = await global.banco.buscarTodosUsuarios();
  const grupos = await global.banco.buscarTodosGrupos();
  res.render('admUsersPage', { titulo: 'Administração de Usuários', usuarios, grupos });
});



//Rota para fazer a busca de usuários naquela tabela de gerenciamento, vou tentar adicionar alguns filtros mais tarde.
router.post('/buscar-usuarios', async (req, res) => {
  if (!global.adminlogado) {
    return res.redirect('/admin/login');
  }

  const { grupo, nome, data } = req.body;

  try {
    const usuarios = await global.banco.buscarUsuariosFiltrados(grupo, nome, data);
    const grupos = await global.banco.buscarTodosGrupos(); // necessário para repopular o select
    res.render('admUsersPage', {
      titulo: 'Administração de Usuários',
      usuarios,
      grupos,
    });
  } catch (error) {
    console.error('Erro ao buscar usuários filtrados:', error);
    res.render('error', { mensagem: 'Erro ao buscar usuários filtrados.' });
  }
});

router.post('/usuarios/deletar', async (req, res) => {
  if (!global.adminlogado) {
    return res.redirect('/admin/login');
  }

  const ids = req.body.ids;

  if (!ids || (Array.isArray(ids) && ids.length === 0)) {
    console.error("IDs indefinidos ou ausentes");
    return res.render('error', { message: 'Nenhum usuário selecionado para exclusão.' });
  }

  const idArray = Array.isArray(ids) ? ids : [ids];

  try {
    console.log("Excluindo IDs:", idArray);
    await global.banco.excluirUsuariosPorIds(idArray);
    res.redirect('/admin/usuarios');
  } catch (error) {
    console.error("Erro ao excluir usuários via procedure:", error);
    res.render('error', { message: 'Erro ao excluir usuários.' });
  }
});






module.exports = router;
