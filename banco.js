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

async function createGrupo(grupo) {
    const conexao = await conectarBD();

    const sql = "INSERT INTO equipes(nome_equipe, desc_equipe, status_equipe, donoEquipe) VALUES (?, ?, 'ativo', ?);";

    const [resultado] = await conexao.query(sql, [
        grupo.name_group,
        grupo.desc_group,
        global.usucodigo
    ]);

    if (resultado.affectedRows > 0) {
        return {
            sucesso: true
        };
    } else {
        return {
            sucesso: false
        };
    }
   
}

async function verficaacessotarefa(grupo) {
    const conexao = await conectarBD();

    const sql = "SELECT donoEquipe FROM equipes WHERE id_equipe = ?;";

    const [rows] = await conexao.query(sql, [grupo.grupo]);

    console.log(rows);

    if (rows.length > 0 && rows[0].donoEquipe === global.usucodigo) {
        return true;
    } else {
        return false;
    }
}

async function createtarefa(tarefa) {
    const conexao = await conectarBD();

    const agora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = "INSERT INTO tarefas(nome_tarefa, descricao_tarefa, status_tarefa, fk_dono_tarefa, fk_equipe, dataCriacao, prazoTarefa) VALUES (?, ?, ?, ?, ?, ?, ?);";
    
    const [retono] = await conexao.query(sql, [
        tarefa.name_task,
        tarefa.desc_task,
        tarefa.status_task,
        global.usucodigo,
        tarefa.grupo_task,
        agora,
        tarefa.date_task
    ]);

    console.log(retono);
    return retono.affectedRows > 0;
}



module.exports = { buscarUsuario, createGrupo, verficaacessotarefa, createtarefa }