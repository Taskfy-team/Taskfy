var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { titulo: 'Taskfy - Login' });
});

router.get('/mainpage', function (req, res, next) {
  verificarLogin(res);
  res.render('main', { titulo: 'Taskfy - Main', nomeapp: 'Taskfy' });
});

/* POST para login */
router.post('/login', async function (req, res, next) {
  const email = req.body.email;
  const senha = req.body.senha;

  console.log("Dados recebidos em POST /login");
  console.log("email e senha do formulario :", email, senha);

  const usuario = await global.banco.buscarUsuario({ email, senha });

  console.log("Dados retornados de buscarUsuario para POST /login");
  console.log(usuario);

  if (usuario.id_usuario) {
    global.usucodigo = usuario.id_usuario;
    global.usuemail = usuario.email_usuario;
    global.usunome  = usuario.nome_usuario;

    res.redirect('/grupos');

  }
  else {
    res.redirect('/');
  }

});

router.get('/logout', function(req, res) {
  global.usucodigo = null;
  global.usuemail = null;
  res.redirect('/');
});

router.get('/grupos', async function (req, res) {
  if (!verificarLogin(res)) return;

  const grupos = await global.banco.buscarGruposDoUsuario(global.usucodigo);

  res.render('groupsPage', { titulo: 'Taskfy - Grupos', grupos });
});

router.get('/grupo/:id', async function(req, res) {
  if (!verificarLogin(res)) return;

  const idGrupo = req.params.id;

  const acessogrupo = await global.banco.pertencegrupo({ idGrupo });

  if (acessogrupo[0].pertence === 0) {
    return res.send("sem acesso");
  }

  const tarefas = await global.banco.buscarTarefasPorGrupo(idGrupo);
  const [grupo] = await global.banco.buscargrupo(idGrupo);
  const colabs = await global.banco.buscarcolabgrupo(idGrupo);
  let donoGrupo = grupo.nome_usuario;

  if (grupo.nome_usuario === global.usunome) {
    donoGrupo = "Você";
  }
  res.render('tarefasGrupo', {
    titulo: 'Tarefas do Grupo',
    tarefas,
    nomeGrupo: `Grupo ${grupo.nome_equipe}`,
    donoGrupo,
    idDonoGrupo: grupo.id_usuario,
    idGrupo,
    grupo,
    colabs
  });
});

router.get('/tarefas', async function(req, res) {
  if (!verificarLogin(res)) return;

  const tarefas = await global.banco.buscarTarefasPorUsuario(global.usucodigo);

  let nomeDono = "";

  res.render('tarefas', {
    titulo: 'Tarefas do Grupo',
    tarefas,
    nomeDono,
    donoGrupo: global.usunome
  });
});

router.get('/cadastrogrupo', function(req, res, next) {
  if (!verificarLogin(res)) return;
  res.render('creategrupo');
});

router.post('/creategrupo', async function(req, res, next) {
  if (!verificarLogin(res)) return;
  console.log(req.body);
  const name_group = req.body.taskname;
  const desc_group = req.body.taskdesc;
  const colab_group = req.body.taskcolab;

  console.log("Dados recebidos em POST /creategrupo: ", name_group, desc_group, colab_group);

  const insertsucesso = await global.banco.createGrupo({name_group,desc_group,colab_group});

  if (insertsucesso.sucesso){
    res.redirect('/grupos');
  }else{
    res.redirect('/creategrupo');
  }

});

router.get('/createtarefa/:grupo', async function(req, res, next) {
  if (!verificarLogin(res)) return;
  const grupo = req.params.grupo;

  const verificadonotarefa = await global.banco.verficaacessotarefa({ grupo });

  if (!verificadonotarefa) {
    return res.redirect('/grupos');
  }

  res.render('createtarefa', { grupo });
});

router.get('/cadastrarusuario', function(req, res, next) {
  //verificarLogin(res);
  res.render('cadastrouser');
});

router.post('/createuser', async function(req, res, next) {
  //verificarLogin(res);
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  const cadastro =  await global.banco.cadastrarusu({ nome, email, senha});

  if(cadastro){
    res.redirect('/');
  }else{
    res.render('cadastrouser', { erro: "Já existe um usuario com esse email!" });

  }
});

router.post('/cadastraratarefa/:idtarefa', async function(req, res, next){
  if (!verificarLogin(res)) return;
  const id = req.params.idtarefa;

  const [tarefa] = await global.banco.gettaskcoisas({ id });

  res.render('task', { tarefa });
});

router.post('/cadastrartarefa', async function(req, res, next) {
  if (!verificarLogin(res)) return;
  const name_task = req.body.taskname;
  const desc_task = req.body.taskdesc;
  const colab_task = req.body.taskcolab;
  const date_task = req.body.user;
  const status_task = req.body.taskinitstat;
  const grupo_task = req.body.grupo;
  console.log(req.body);
  console.log("Dados recebidos em POST /cadastrartarefa: ", name_task, desc_task, colab_task, date_task, status_task, grupo_task);
  
  const sucesso = await global.banco.createtarefa({ 
    name_task, desc_task, colab_task, date_task, status_task, grupo_task  
  });

  if (sucesso) {
    res.redirect('/grupo/' + grupo_task);
  } else {
    res.redirect('/cadastrartarefa/' + grupo_task);
  }
});

router.get('/tarefa/:idtarefa', async function(req, res, next){
  if (!verificarLogin(res)) return;

  const id = req.params.idtarefa;

  const acessotarefa = await global.banco.pertencetarefa({ id });

  if (acessotarefa[0].pertence === 0) {
    return res.send("sem acesso");
  }

  const [tarefa] = await global.banco.gettaskcoisas({ id });

  res.render('task', { tarefa });
});

router.post('/verificaremail', async function(req, res, next){
  if (!verificarLogin(res)) return;
  const id = req.body.email;
  console.log("recebido:", id);

  const existe = await global.banco.verificaremail({ id });
  console.log("verificação:", existe);

  res.json({ exists: existe });
});

router.get('/perfil', async function(req, res, next){
  if (!verificarLogin(res)) return;
  const id = global.usucodigo;

  const dadosusr = await global.banco.buscardadosusr({ id });

  console.log("AQUI" + dadosusr + "id: " + id);
  res.render('perfilpage', { dadosusr });
});

router.post('/perfil/atualizar', async function(req, res, next){
  if (!verificarLogin(res)) return;

  const id = global.usucodigo;
  const nome = req.body.nome;
  const senha = req.body.senha;

  await global.banco.atualizardadosusr({ nome, senha, id });

  res.redirect('/perfil');
});

router.post('/removercolabgrupo', async function(req, res, next){
  const grupo = req.body.grupo;
  const email = req.body.email;

  const remover = await global.banco.removercolabgrupo({grupo, email});
  res.sendStatus(200);
});

router.post('/adicionarcolabgrupo', async function(req, res, next) {
  const grupo = req.body.grupo;
  const email = req.body.email;

  const adicionar = await global.banco.adicionarcolabgrupo({grupo, email});
  res.sendStatus(200);
});

router.post('/salvarnomegrupo', async function(req,res,next){
  const nomegrupo = req.body.nomegrupo;
  const grupo = req.body.grupo;

  const alterarnome = await global.banco.alterarnomegrupo({nomegrupo, grupo});
  res.sendStatus(200);
});

router.post('/salvardescgrupo', async function(req, res, next){
  const desc = req.body.desc;
  const grupo = req.body.grupo;

  const alterardesc = await global.banco.alterardescgrupo({desc, grupo});
  res.sendStatus(200);
});

router.post('/excluirgrupo', async function(req,res,next){
  const grupo = req.body.grupo;

  const excluirgp = await global.banco.excluirgp({grupo});
  res.sendStatus(200);
});

// Verifica se tem usuario logado
function verificarLogin(res) {
  if (!global.usuemail || global.usuemail == ""){
    res.redirect('/');
    return false;
  }
    return true;
}
module.exports = router;
