var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { titulo: 'Taskfy - Login' });
});

router.get('/mainpage', function(req, res, next) {
  verificarLogin(res);
  res.render('main', { titulo: 'Taskfy - Main' , nomeapp: 'Taskfy'});
});

router.get('/cadastrogrupo', function(req, res, next) {
  verificarLogin(res);
  res.render('creategrupo');
});

router.post('/creategrupo', async function(req, res, next) {
  verificarLogin(res);
  const name_group = req.body.taskname;
  const desc_group = req.body.taskdesc;
  const colab_group = req.body.taskcolabs;
  const adm_colab_group = req.body.user;

  console.log("Dados recebidos em POST /creategrupo: ", name_group, desc_group, colab_group, adm_colab_group);

  const insertsucesso = await global.banco.createGrupo({name_group,desc_group});

  if (insertsucesso.sucesso){
    res.redirect('/grupos');
  }else{
    res.redirect('/creategrupo');
  }

});

router.get('/createtarefa/:grupo', async function(req, res, next) {
  verificarLogin(res);
  const grupo = req.params.grupo;

  const verificadonotarefa = await global.banco.verficaacessotarefa({ grupo });

  if (!verificadonotarefa) {
    return res.redirect('/grupos');
  }

  res.render('createtarefa', { grupo });
});


router.post('/cadastrartarefa', async function(req, res, next) {
  verificarLogin(res);
  const name_task = req.body.taskname;
  const desc_task = req.body.taskdesc;
  const colab_task = req.body.taskcolabs;
  const date_task = req.body.user;
  const status_task = req.body.taskinitstat;
  const grupo_task = req.body.grupo;

  console.log("Dados recebidos em POST /cadastrartarefa: ", name_task, desc_task, colab_task, date_task, status_task, grupo_task);
  
  const sucesso = await global.banco.createtarefa({ 
    name_task, desc_task, colab_task, date_task, status_task, grupo_task  
  });

  if (sucesso) {
    res.redirect('/task/' + grupo_task);
  } else {
    res.redirect('/cadastrartarefa/' + grupo_task);
  }
});

/* POST para login */
router.post('/login', async function(req, res, next){
  const email = req.body.email;
  const senha = req.body.senha;

  console.log("Dados recebidos em POST /login");
  console.log("email e senha do formulario :", email, senha );

  const usuario = await global.banco.buscarUsuario({email,senha});

  console.log("Dados retornados de buscarUsuario para POST /login");
  console.log(usuario);

  if (usuario.id_usuario)
  {
    global.usucodigo = usuario.id_usuario;
    global.usuemail = usuario.email_usuario;

    res.redirect('/mainpage');
  }
  else
  {
    res.redirect('/');
  }
  
});

router.get('/cadastrarusuario', function(req, res, next) {
  verificarLogin(res);
  res.render('cadastrouser');
});

router.post('/createuser', async function(req, res, next) {
  verificarLogin(res);
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  const cadastro =  await global.banco.cadastrarusu({ nome, email, senha});

  if(cadastro){
    res.redirect('/');
  }else{
    res.redirect('/cadastrousuario');
  }
});

router.get('/task/:idtarefa', async function(req, res, next){
  verificarLogin(res);
  const id = req.params.idtarefa;

  const [tarefa] = await global.banco.gettaskcoisas({ id });

  res.render('task', { tarefa });
});

//
// Funções de segurança
//

// Verifica se tem usuario logado
function verificarLogin(res)
{
  if (!global.usuemail || global.usuemail == "")
    res.redirect('/');
}
module.exports = router;
