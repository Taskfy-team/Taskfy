const mysql = require('mysql2/promise');


async function conectarBD()
{
    if (global.conexao && global.conexao.state !== 'disconnected')
    {
        return global.conexao;
    }

    // caso não exista uma conexao, deve-se cria-la
    const conexao = mysql.createConnection(
        {
            host     : 'localhost',
            port     : 3306,
            user     : 'root',
            password : '',
            database : 'taskfy'
        }
    );

    // guarda a nova conexao no objeto GLOBAL
    global.conexao = conexao;
    
    // retorna a conexao criada
    return global.conexao;
}


async function buscarUsuario(usuario) 
{
    //console.log("Dados recebidos na função buscarUsuario");
    //console.log("email e senha : ", usuario);

    // primeiro, conecta com o banco de dados
    const conexao = await conectarBD();

    // prepara o comando SQL para ser executado
    /*
    const sqlerrado = 
    "select * from usuarios where usuemail='"+usuario.email+
    "' and ususenha='"+usuario.senha+"';";
    */
    const sql = "select * from usuario where email_usuario=? and senha_usuario=?;";

    // executa o SQL através da conexao e armazena o resultado na variavel
    // usuarioEncontrado
    const [usuarioEncontrado] = 
        await conexao.query(sql, [usuario.email, usuario.senha]);

    //console.log("Dados retornados do BD para buscarUsuario");
    //console.log(usuarioEncontrado);

    // verifica se usuarioEncontrado possui ao menos 1 usuario 
    // encontrado no banco de dados        
    if (usuarioEncontrado && usuarioEncontrado.length > 0)
    {
        // devolve o usuarioEncontrado para o controle de rotas
        return usuarioEncontrado[0];
    }
    else
    {
        // se não existe um usuarioEncontrado retorna um json vazio
        return {};
    }
}

module.exports = { buscarUsuario }