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

async function buscarGruposDoUsuario(idUsuario) {
    const conexao = await conectarBD();

    const sql = `
        SELECT 
            equipes.id_equipe, 
            nome_equipe, 
            desc_equipe, 
            status_equipe, 
            donoEquipe as criador_id,
            criador.nome_usuario as nome_criador
        FROM equipes 
        INNER JOIN usuario_equipe ON equipes.id_equipe = usuario_equipe.fk_equipe 
        INNER JOIN usuario AS membro ON usuario_equipe.fk_usuario = membro.id_usuario 
        INNER JOIN usuario AS criador ON equipes.donoEquipe = criador.id_usuario
        WHERE membro.id_usuario = ?;
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
        INNER JOIN equipes on equipes.id_equipe = tarefas.fk_equipe
        WHERE tarefas.fk_equipe = ?;
    `;
    const [tarefas] = await conexao.query(sql, [idGrupo]);

    console.log(tarefas);

    return tarefas;
}

async function buscarTarefasPorUsuario(idUsuario) {
    const conexao = await conectarBD();
    const sql = `
        SELECT * 
        FROM tarefas 
        INNER JOIN usuario_tarefa ON usuario_tarefa.fk_tarefa = tarefas.id_tarefa
        INNER JOIN usuario ON usuario.id_usuario = tarefas.fk_dono_tarefa
        WHERE usuario_tarefa.fk_usuario = ?;
    `;
    const [tarefas] = await conexao.query(sql, [idUsuario]);

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
    console.log(grupo);

    const sql = "INSERT INTO equipes(nome_equipe, desc_equipe, status_equipe, donoEquipe) VALUES (?, ?, 'ativo', ?);";
    const [resultado] = await conexao.query(sql, [
        grupo.name_group,
        grupo.desc_group,
        global.usucodigo
    ]);

    const idGrupo = resultado.insertId;

    if (resultado.affectedRows > 0) {
        // Adiciona o dono à equipe
        const sql2 = "INSERT INTO usuario_equipe(fk_equipe, fk_usuario) VALUES (?, ?);";
        await conexao.query(sql2, [idGrupo, global.usucodigo]);

        // Garante que colab_group seja array
        let colabs = [];
        if (grupo.colab_group) {
            if (Array.isArray(grupo.colab_group)) {
                colabs = grupo.colab_group;
            } else {
                colabs = [grupo.colab_group]; // se for string única
            }
        }

        // Adiciona colaboradores (se houver)
        if (colabs.length > 0) {
            console.log("➡️ Adicionando colaboradores:", colabs);
            for (const email of colabs) {
                console.log("🔍 Buscando:", email);
                const [usuarios] = await conexao.query(
                    "SELECT id_usuario FROM usuario WHERE email_usuario = ?",
                    [email]
                );
                
                console.log("🔎 Resultado SQL:", usuarios);

                if (usuarios.length > 0) {
                    const idUsuario = usuarios[0].id_usuario;
                    console.log(`✅ Inserindo ${email} com ID ${idUsuario} na equipe`);

                    await conexao.query(
                        "INSERT INTO usuario_equipe(fk_equipe, fk_usuario) VALUES (?, ?)",
                        [idGrupo, idUsuario]
                    );
                } else {
                    console.warn(`⚠️ Usuário com e-mail ${email} não encontrado.`);
                }
            }
        }

        return { sucesso: true };
    } else {
        return { sucesso: false };
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

    if (retono.affectedRows > 0) {
        // Adiciona o dono da tarefa
        await conexao.query(
            "INSERT INTO usuario_tarefa(fk_tarefa, fk_usuario) VALUES (?, ?);",
            [idTarefa, global.usucodigo]
        );

        // Garante que colab_task seja array
        let colabs = [];
        if (tarefa.colab_task) {
            if (Array.isArray(tarefa.colab_task)) {
                colabs = tarefa.colab_task;
            } else {
                colabs = [tarefa.colab_task]; // se for string única
            }
        }

        // Adiciona colaboradores (se houver)
        if (colabs.length > 0) {
            console.log("➡️ Adicionando colaboradores:", colabs);
            for (const email of colabs) {
                console.log("🔍 Buscando:", email);
                const [usuarios] = await conexao.query(
                    "SELECT id_usuario FROM usuario WHERE email_usuario = ?",
                    [email]
                );
                
                console.log("🔎 Resultado SQL:", usuarios);

                if (usuarios.length > 0) {
                    const idUsuario = usuarios[0].id_usuario;
                    console.log(`✅ Inserindo ${email} com ID ${idUsuario} na tarefa`);

                    await conexao.query(
                        "INSERT INTO usuario_tarefa(fk_tarefa, fk_usuario) VALUES (?, ?)",
                        [idTarefa, idUsuario]
                    );
                } else {
                    console.warn(`⚠️ Usuário com e-mail ${email} não encontrado.`);
                }
            }
        }

        return true;
    } else {
        return false;
    }
}


async function cadastrarusu(usuario) {
    const conexao = await conectarBD();

    const sqlemail = "SELECT COUNT(*) AS veremail FROM usuario WHERE email_usuario = ?;";
    const [verificacao] = await conexao.query(sqlemail, [usuario.email]);

    if (verificacao[0].veremail > 0) {
        console.log("Já existe um usuario com esse email");
        return false;
    }

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

async function verificaremail(email) {
  const conexao = await conectarBD();

  const sql = "SELECT COUNT(*) AS total FROM usuario WHERE email_usuario = ?;";
  const [rows] = await conexao.query(sql, [email.id]);

  const quantidade = rows[0].total;
  console.log(quantidade);

  return quantidade > 0;
}

async function buscarnomeusuario(userid) {
    const conexao = await conectarBD();
    const sql = "SELECT nome_usuario as nome FROM usuario WHERE id_usuario = ?;";

    const [rows] = await conexao.query(sql, [userid]);
    return rows; 
}

async function buscargrupo(userid) {
    const conexao = await conectarBD();
    const sql = "SELECT * FROM equipes INNER JOIN usuario ON usuario.id_usuario = equipes.donoEquipe WHERE id_equipe = ?;";

    const [rows] = await conexao.query(sql, [userid]);
    return rows; 
}

async function pertencegrupo(grupo) {
    const conexao = await conectarBD();
    const sql = "SELECT COUNT(*) AS pertence FROM usuario_equipe WHERE fk_usuario = ? AND fk_equipe = ?;";

    const [rows] = await conexao.query(sql, [global.usucodigo, grupo.idGrupo]);

    return rows; 
}

async function pertencetarefa(grupo) {
    const conexao = await conectarBD();
    const sql = "SELECT COUNT(*) AS pertence FROM usuario_tarefa WHERE fk_usuario = ? AND fk_tarefa = ?;";

    const [rows] = await conexao.query(sql, [global.usucodigo, grupo.id]);

    return rows; 
}

async function buscardadosusr(usr) {
    const conexao = await conectarBD();
    const sql = "SELECT * FROM usuario WHERE usuario.id_usuario = ? ;";


    const [rows] = await conexao.query(sql, [usr.id]);

    return rows[0]; 
}

async function atualizardadosusr(usr) {
    const conexao = await conectarBD();
    const sql = "UPDATE usuario SET nome_usuario = ?, senha_usuario = ? WHERE id_usuario = ?;";

    const [result] = await conexao.query(sql, [usr.nome, usr.senha, usr.id]);

    return result.affectedRows > 0;
}

//Query para buscar os usuários, é utilizada na rota '/buscar-usuarios'
async function buscarUsuariosFiltrados(grupo, nome, dataCriacao) {
  const conexao = await conectarBD();

  let sql = `
    SELECT DISTINCT u.id_usuario, u.nome_usuario, u.email_usuario, u.dataNascimento,
           u.dataCriacao, u.numeroTelefone, u.status
    FROM usuario u
    INNER JOIN usuario_equipe ue ON ue.fk_usuario = u.id_usuario
    INNER JOIN equipes e ON e.id_equipe = ue.fk_equipe
    WHERE 1=1
  `;
  const params = [];

  if (grupo) {
    sql += ` AND e.nome_equipe LIKE ?`;
    params.push(`%${grupo}%`);
  }

  if (nome) {
    sql += ` AND u.nome_usuario LIKE ?`;
    params.push(`%${nome}%`);
  }

  if (dataCriacao) {
    sql += ` AND DATE(u.dataCriacao) = ?`;
    params.push(dataCriacao);
  }

  const [usuarios] = await conexao.query(sql, params);
  return usuarios;
}


//esta sendo utilizada na admUsersPage.ejs para carregar todos os grupos em um select/option
async function buscarTodosGrupos() {
    const conexao = await conectarBD();
    const sql = "SELECT id_equipe, nome_equipe FROM equipes;";
    const [grupos] = await conexao.query(sql);
    return grupos;
}

async function excluirUsuariosPorIds(ids) {
  const conexao = await conectarBD();

  try {
    await conexao.beginTransaction();

    for (const id of ids) {
      await conexao.query('CALL excluir_usuario_cascata(?)', [id]);
    }

    await conexao.commit();
  } catch (error) {
    await conexao.rollback();
    throw error;
  }
}





module.exports = {
  buscarUsuario,
  buscarGruposDoUsuario,
  buscarTarefasPorGrupo,
  buscarTodosGrupos,
  buscarAdmin,
  buscarTodosUsuarios,
  buscarUsuariosFiltrados, // <- adicione esta linha
  createGrupo,
  verficaacessotarefa,
  createtarefa,
  cadastrarusu,
  gettaskcoisas,
  verificaremail,
  buscarnomeusuario,
  buscargrupo,
  pertencegrupo,
  buscarTarefasPorUsuario,
  pertencetarefa,
  buscardadosusr,
  atualizardadosusr,
  excluirUsuariosPorIds
};
