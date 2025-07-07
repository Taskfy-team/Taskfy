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


// GET - Listar todas as tarefas
router.get('/tarefas', async (req, res) => {
  if (!global.adminlogado) {
    return res.redirect('/admin/login');
  }

  try {
    const tarefas = await global.banco.buscarTodasTarefas();
    res.render('admTarefasPage', { titulo: 'Administração de Tarefas', tarefas });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.render('error', { mensagem: 'Erro ao carregar tarefas.' });
  }
});

// POST - Buscar tarefas com filtros (nome e data)
router.post('/tarefas/buscar', async (req, res) => {
  if (!global.adminlogado) {
    return res.redirect('/admin/login');
  }

  const { nome, data } = req.body;
  const conexao = await global.banco.conectarBD();

  try {
    let sql = `SELECT * FROM vw_tarefas_por_grupo WHERE 1=1`;
    const params = [];

    if (nome && nome.trim() !== '') {
      sql += ` AND nome_tarefa LIKE ?`;
      params.push(`%${nome}%`);
    }

    if (data && data.trim() !== '') {
      sql += ` AND DATE(dataCriacao) = ?`;
      params.push(data);
    }

    sql += ` ORDER BY dataCriacao DESC`;

    const [tarefas] = await conexao.query(sql, params);

    res.render('admTarefasPage', { titulo: 'Administração de Tarefas', tarefas });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.render('error', { mensagem: 'Erro ao buscar tarefas.' });
  }
});

router.get('/dashboards', async (req, res) => {
    if (!global.adminlogado) {
    return res.redirect('/admin/login');
  }
  try {
    const resultado = await banco.obterQtdMembrosPorEquipe();
    res.render('admDashboardsPage', {
      tipo: 'dashboards',
      dadosGrafico: resultado
    });
  } catch (err) {
    console.error('Erro ao carregar dados do dashboard:', err);
    res.status(500).send('Erro ao carregar dashboard');
  }
});



module.exports = router;
