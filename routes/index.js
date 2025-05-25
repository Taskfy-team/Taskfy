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
