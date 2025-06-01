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
        SELECT * 
        FROM tarefas 
        INNER JOIN usuario ON tarefas.fk_dono_tarefa = usuario.id_usuario 
        WHERE tarefas.fk_equipe = ?;
    `;
    const [tarefas] = await conexao.query(sql, [idGrupo]);

    console.log(tarefas);

    return tarefas;
}

//Buscar adm
async function buscarAdmin(admin) {
  const conexao = await conectarBD();
  const sql = "SELECT * FROM admin WHERE email_admin = ? AND senha_admin = ?";
  const [resultado] = await conexao.query(sql, [admin.email, admin.senha]);

  return resultado.length > 0 ? resultado[0] : {};
}

//buscar todos usuários para adm
async function buscarTodosUsuarios() {
  const conexao = await conectarBD();
  const sql = `
    SELECT id_usuario, nome_usuario, email_usuario, dataNascimento, 
           dataCriacao, numeroTelefone, status
    FROM usuario;
  `;
  const [usuarios] = await conexao.query(sql);
  return usuarios;
}

async function createGrupo(grupo) {
    const conexao = await conectarBD();

    const sql = "INSERT INTO equipes(nome_equipe, desc_equipe, status_equipe, donoEquipe) VALUES (?, ?, 'ativo', ?);";

    const [resultado] = await conexao.query(sql, [
        grupo.name_group,
        grupo.desc_group,
        global.usucodigo
    ]);

    const idGrupo =  resultado.insertId;
    
    if (resultado.affectedRows > 0) {
        const sql2 = "INSERT INTO usuario_equipe(fk_equipe, fk_usuario) VALUES (?, ?);";

        const [resultados] = await conexao.query(sql2, [
            idGrupo,
            global.usucodigo
        ]);

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

    const idTarefa = retono.insertId;

    if (retono.affectedRows > 0){
        const sql2 = "INSERT INTO usuario_tarefa(fk_usuario, fk_tarefa) VALUES (?, ?);";

        const [resultados] = await conexao.query(sql2, [
            global.usucodigo,
            idTarefa
        ]);
        return true;
    }else{
        return false;
    }
}

async function cadastrarusu(usuario) {
    const conexao = await conectarBD();

    const sql = "INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?);";
    
    const [retorno] = await conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.senha
    ]);

    if (retorno.affectedRows > 0) {
        console.log("Usuário cadastrado com sucesso. ID:", retorno.insertId);
        return true;
    } else {
        console.log("Erro ao cadastrar usuário.");
        return false;
    }
}

async function gettaskcoisas(task) {
    const conexao = await conectarBD();

    const sql = "SELECT * FROM tarefas WHERE id_tarefa = ?;";

    const [rows] = await conexao.query(sql, [task.id]);
    
    console.log(rows);
    
    return rows; 
}

module.exports = { buscarUsuario, buscarGruposDoUsuario, buscarTarefasPorGrupo, buscarAdmin, buscarTodosUsuarios, createGrupo, verficaacessotarefa, createtarefa, cadastrarusu, gettaskcoisas };