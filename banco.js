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

//Função para retornar grupos do usuário
async function buscarGruposDoUsuario(idUsuario) {
    const conexao = await conectarBD();
    const sql = `
        SELECT equipes.id_equipe, nome_equipe, desc_equipe, status_equipe 
        FROM equipes 
        INNER JOIN usuario_equipe ON equipes.id_equipe = usuario_equipe.fk_equipe 
        INNER JOIN usuario ON usuario_equipe.fk_usuario = usuario.id_usuario 
        WHERE usuario.id_usuario = ?;
    `;
    const [grupos] = await conexao.query(sql, [idUsuario]);
    return grupos;
}


async function buscarTarefasPorGrupo(idGrupo) {
    const conexao = await conectarBD();
    const sql = `
        SELECT nome_tarefa, descricao_tarefa, status_tarefa, prazoTarefa, nome_usuario 
        FROM tarefas 
        INNER JOIN usuario ON tarefas.fk_dono_tarefa = usuario.id_usuario 
        WHERE tarefas.fk_equipe = ?;
    `;
    const [tarefas] = await conexao.query(sql, [idGrupo]);
    return tarefas;
}

module.exports = { buscarUsuario, buscarGruposDoUsuario, buscarTarefasPorGrupo};