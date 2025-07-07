-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07/07/2025 às 03:16
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `taskfy`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `excluir_usuario_cascata` (IN `pid` INT)   BEGIN
  -- Atualiza tarefas
  UPDATE tarefas SET fk_dono_tarefa = NULL WHERE fk_dono_tarefa = pid;

  -- Atualiza equipes
  UPDATE equipes SET donoEquipe = NULL WHERE donoEquipe = pid;

  -- Remove da associação
  DELETE FROM usuario_equipe WHERE fk_usuario = pid;
  DELETE FROM usuario_tarefa WHERE fk_usuario = pid;

  -- Por fim, remove o usuário
  DELETE FROM usuario WHERE id_usuario = pid;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `nome_admin` varchar(30) DEFAULT NULL,
  `email_admin` varchar(30) DEFAULT NULL,
  `senha_admin` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `admin`
--

INSERT INTO `admin` (`id_admin`, `nome_admin`, `email_admin`, `senha_admin`) VALUES
(1, 'otavio', 'otavio@email.com', '123'),
(2, 'gustavo', 'gustavo@gmail.com', '123'),
(3, 'admin', 'admin@taskfy.com', '1234');

-- --------------------------------------------------------

--
-- Estrutura para tabela `chat`
--

CREATE TABLE `chat` (
  `id_chat` int(11) NOT NULL,
  `mensagem_chat` text DEFAULT NULL,
  `data_mensagem` date DEFAULT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `fk_tarefa` int(11) DEFAULT NULL,
  `fk_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipes`
--

CREATE TABLE `equipes` (
  `id_equipe` int(11) NOT NULL,
  `nome_equipe` varchar(20) DEFAULT NULL,
  `desc_equipe` varchar(40) DEFAULT NULL,
  `status_equipe` varchar(10) DEFAULT NULL,
  `donoEquipe` int(11) DEFAULT NULL,
  `qtd_membros` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `equipes`
--

INSERT INTO `equipes` (`id_equipe`, `nome_equipe`, `desc_equipe`, `status_equipe`, `donoEquipe`, `qtd_membros`) VALUES
(1, 'equipe alfa', 'equipe de teste alfa', 'ativo', 1, 0),
(2, 'equipe testes', 'segunda equipe para testes', 'ativo', NULL, 0),
(3, 'batata', 'equipe batata', 'ativo', NULL, 0),
(4, 'sei la', 'Grupo de tarefa', 'ativo', 6, 0),
(5, 'Equipe Alpha', 'Equipe focada em desenvolvimento backend', 'ativa', NULL, 0),
(6, 'Equipe Beta', 'Equipe de frontend e design', 'ativa', NULL, 0),
(7, 'Marcenaria', 'Grupo de trabalho na madeira', 'ativo', NULL, 0),
(8, 'teste', 'teste', 'teste', NULL, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tarefas`
--

CREATE TABLE `tarefas` (
  `id_tarefa` int(11) NOT NULL,
  `nome_tarefa` varchar(20) DEFAULT NULL,
  `descricao_tarefa` varchar(40) DEFAULT NULL,
  `status_tarefa` varchar(10) DEFAULT NULL,
  `fk_dono_tarefa` int(11) DEFAULT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `dataCriacao` date NOT NULL,
  `prazoTarefa` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tarefas`
--

INSERT INTO `tarefas` (`id_tarefa`, `nome_tarefa`, `descricao_tarefa`, `status_tarefa`, `fk_dono_tarefa`, `fk_equipe`, `dataCriacao`, `prazoTarefa`) VALUES
(1, 'tarefa de teste', 'tarefa criada para teste', 'pendente', 1, 1, '2025-05-06', '2025-07-04'),
(2, '123', 'qwe', 'Aberta', 6, 4, '2025-06-07', '2025-07-07'),
(6, 'Criar API REST', 'Desenvolver endpoints para cadastro e lo', 'Em andamen', 1, 5, '0000-00-00', '2024-07-15'),
(7, 'Design da página ini', 'Criar layout responsivo para a homepage', 'Pendente', 1, 6, '0000-00-00', '2024-07-20'),
(8, 'Testes automatizados', 'Implementar testes unitários no backend', 'Pendente', 6, 5, '0000-00-00', '2024-07-18'),
(9, 'teste', 'teste', 'teste', 6, 1, '2025-07-09', '2025-07-25');

-- --------------------------------------------------------

--
-- Estrutura para tabela `timeline_tarefa`
--

CREATE TABLE `timeline_tarefa` (
  `id_timeline` int(11) NOT NULL,
  `mensagem_timeline` text DEFAULT NULL,
  `data_timline` date DEFAULT NULL,
  `anexo_timeline` mediumblob DEFAULT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `fk_tarefa` int(11) DEFAULT NULL,
  `fk_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome_usuario` varchar(30) DEFAULT NULL,
  `email_usuario` varchar(30) DEFAULT NULL,
  `senha_usuario` varchar(30) DEFAULT NULL,
  `dataNascimento` date DEFAULT NULL,
  `dataCriacao` date DEFAULT NULL,
  `numeroTelefone` varchar(11) NOT NULL,
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome_usuario`, `email_usuario`, `senha_usuario`, `dataNascimento`, `dataCriacao`, `numeroTelefone`, `status`) VALUES
(1, 'adolfo', 'minecraftalemao@ww2.bol.com', '123', '1897-03-28', '2023-10-14', '', ''),
(6, 'Gabriel', 'gabriel@email.com', '123', '2008-01-21', '2024-01-01', '988335544', 'ativo'),
(7, 'Gabriel Silva', 'gabriel@email.com', '123', '2000-05-21', '2024-01-01', '988335544', 'ativo'),
(8, 'Ana Souza', 'ana@email.com', '123', '1998-03-15', '2024-01-02', '977665544', 'ativo'),
(9, 'Carlos Pereira', 'carlos@email.com', '123', '1995-11-10', '2024-01-03', '966554433', 'ativo'),
(10, 'Mariana Lima', 'mariana@email.com', '123', '2002-08-22', '2024-01-04', '955443322', 'inativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_equipe`
--

CREATE TABLE `usuario_equipe` (
  `id_usr_equipe` int(11) NOT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `fk_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario_equipe`
--

INSERT INTO `usuario_equipe` (`id_usr_equipe`, `fk_equipe`, `fk_usuario`) VALUES
(1, 1, 1),
(9, 2, 1),
(10, 3, 1),
(12, 4, 6),
(21, 1, 1),
(25, 5, 6),
(26, 5, 7),
(27, 5, 8),
(28, 6, 9),
(29, 6, 10);

--
-- Acionadores `usuario_equipe`
--
DELIMITER $$
CREATE TRIGGER `trg_atualizar_qtd_membros` AFTER INSERT ON `usuario_equipe` FOR EACH ROW BEGIN
  UPDATE equipes
  SET qtd_membros = (
      SELECT COUNT(*) FROM usuario_equipe WHERE fk_equipe = NEW.fk_equipe
  )
  WHERE id_equipe = NEW.fk_equipe;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_tarefa`
--

CREATE TABLE `usuario_tarefa` (
  `id_use_taf` int(11) NOT NULL,
  `fk_usuario` int(11) NOT NULL,
  `fk_tarefa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario_tarefa`
--

INSERT INTO `usuario_tarefa` (`id_use_taf`, `fk_usuario`, `fk_tarefa`) VALUES
(1, 6, 2);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_resumo_grupos`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_resumo_grupos` (
`id_equipe` int(11)
,`nome_equipe` varchar(20)
,`total_membros` bigint(21)
,`total_tarefas` bigint(21)
,`nome_dono` varchar(30)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_resumo_usuarios`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_resumo_usuarios` (
`nome_usuario` varchar(30)
,`email_usuario` varchar(30)
,`numeroTelefone` varchar(11)
,`total_grupos` bigint(21)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_tarefas_atrasadas`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_tarefas_atrasadas` (
`nome_tarefa` varchar(20)
,`prazoTarefa` date
,`responsavel` varchar(30)
,`grupo` varchar(20)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_tarefas_por_grupo`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_tarefas_por_grupo` (
`nome_equipe` varchar(20)
,`nome_tarefa` varchar(20)
,`status_tarefa` varchar(10)
,`dataCriacao` date
,`prazoTarefa` date
,`descricao_tarefa` varchar(40)
,`nome_dono` varchar(30)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vw_resumo_grupos`
--
DROP TABLE IF EXISTS `vw_resumo_grupos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_resumo_grupos`  AS SELECT `e`.`id_equipe` AS `id_equipe`, `e`.`nome_equipe` AS `nome_equipe`, count(distinct `ue`.`fk_usuario`) AS `total_membros`, count(distinct `t`.`id_tarefa`) AS `total_tarefas`, `u`.`nome_usuario` AS `nome_dono` FROM (((`equipes` `e` left join `usuario_equipe` `ue` on(`ue`.`fk_equipe` = `e`.`id_equipe`)) left join `tarefas` `t` on(`t`.`fk_equipe` = `e`.`id_equipe`)) left join `usuario` `u` on(`u`.`id_usuario` = `e`.`donoEquipe`)) GROUP BY `e`.`id_equipe` ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_resumo_usuarios`
--
DROP TABLE IF EXISTS `vw_resumo_usuarios`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_resumo_usuarios`  AS SELECT `u`.`nome_usuario` AS `nome_usuario`, `u`.`email_usuario` AS `email_usuario`, `u`.`numeroTelefone` AS `numeroTelefone`, count(`ue`.`fk_equipe`) AS `total_grupos` FROM (`usuario` `u` left join `usuario_equipe` `ue` on(`u`.`id_usuario` = `ue`.`fk_usuario`)) GROUP BY `u`.`id_usuario` ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_tarefas_atrasadas`
--
DROP TABLE IF EXISTS `vw_tarefas_atrasadas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tarefas_atrasadas`  AS SELECT `t`.`nome_tarefa` AS `nome_tarefa`, `t`.`prazoTarefa` AS `prazoTarefa`, `u`.`nome_usuario` AS `responsavel`, `e`.`nome_equipe` AS `grupo` FROM ((`tarefas` `t` join `usuario` `u` on(`t`.`fk_dono_tarefa` = `u`.`id_usuario`)) join `equipes` `e` on(`t`.`fk_equipe` = `e`.`id_equipe`)) WHERE `t`.`prazoTarefa` < curdate() AND `t`.`status_tarefa` <> 'concluída' ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_tarefas_por_grupo`
--
DROP TABLE IF EXISTS `vw_tarefas_por_grupo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tarefas_por_grupo`  AS SELECT `equipes`.`nome_equipe` AS `nome_equipe`, `tarefas`.`nome_tarefa` AS `nome_tarefa`, `tarefas`.`status_tarefa` AS `status_tarefa`, `tarefas`.`dataCriacao` AS `dataCriacao`, `tarefas`.`prazoTarefa` AS `prazoTarefa`, `tarefas`.`descricao_tarefa` AS `descricao_tarefa`, `usuario`.`nome_usuario` AS `nome_dono` FROM ((`tarefas` join `equipes` on(`equipes`.`id_equipe` = `tarefas`.`fk_equipe`)) join `usuario` on(`usuario`.`id_usuario` = `tarefas`.`fk_dono_tarefa`)) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Índices de tabela `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `fk_equipe_chat` (`fk_equipe`),
  ADD KEY `fk_tarefa_chat` (`fk_tarefa`),
  ADD KEY `fk_usuario_chat` (`fk_usuario`);

--
-- Índices de tabela `equipes`
--
ALTER TABLE `equipes`
  ADD PRIMARY KEY (`id_equipe`),
  ADD KEY `fk_donoEquipe` (`donoEquipe`);

--
-- Índices de tabela `tarefas`
--
ALTER TABLE `tarefas`
  ADD PRIMARY KEY (`id_tarefa`),
  ADD KEY `fk_dono_tarefa` (`fk_dono_tarefa`),
  ADD KEY `fk_equipe` (`fk_equipe`);

--
-- Índices de tabela `timeline_tarefa`
--
ALTER TABLE `timeline_tarefa`
  ADD PRIMARY KEY (`id_timeline`),
  ADD KEY `fk_equipe_timeline` (`fk_equipe`),
  ADD KEY `fk_tarefa_timeline` (`fk_tarefa`),
  ADD KEY `fk_usuario_timeline` (`fk_usuario`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Índices de tabela `usuario_equipe`
--
ALTER TABLE `usuario_equipe`
  ADD PRIMARY KEY (`id_usr_equipe`),
  ADD KEY `fk_equipe` (`fk_equipe`),
  ADD KEY `fk_usuario` (`fk_usuario`);

--
-- Índices de tabela `usuario_tarefa`
--
ALTER TABLE `usuario_tarefa`
  ADD PRIMARY KEY (`id_use_taf`),
  ADD KEY `fk_usutaf_usuaio` (`fk_usuario`),
  ADD KEY `fk_usutaf_tarefa` (`fk_tarefa`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `chat`
--
ALTER TABLE `chat`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipes`
--
ALTER TABLE `equipes`
  MODIFY `id_equipe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `tarefas`
--
ALTER TABLE `tarefas`
  MODIFY `id_tarefa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `timeline_tarefa`
--
ALTER TABLE `timeline_tarefa`
  MODIFY `id_timeline` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `usuario_equipe`
--
ALTER TABLE `usuario_equipe`
  MODIFY `id_usr_equipe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `usuario_tarefa`
--
ALTER TABLE `usuario_tarefa`
  MODIFY `id_use_taf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `fk_equipe_chat` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`),
  ADD CONSTRAINT `fk_tarefa_chat` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefas` (`id_tarefa`),
  ADD CONSTRAINT `fk_usuario_chat` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `equipes`
--
ALTER TABLE `equipes`
  ADD CONSTRAINT `fk_donoEquipe` FOREIGN KEY (`donoEquipe`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `tarefas`
--
ALTER TABLE `tarefas`
  ADD CONSTRAINT `fk_dono_tarefa` FOREIGN KEY (`fk_dono_tarefa`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_equipe` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`);

--
-- Restrições para tabelas `timeline_tarefa`
--
ALTER TABLE `timeline_tarefa`
  ADD CONSTRAINT `fk_equipe_timeline` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`),
  ADD CONSTRAINT `fk_tarefa_timeline` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefas` (`id_tarefa`),
  ADD CONSTRAINT `fk_usuario_timeline` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `usuario_equipe`
--
ALTER TABLE `usuario_equipe`
  ADD CONSTRAINT `usuario_equipe_ibfk_1` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`),
  ADD CONSTRAINT `usuario_equipe_ibfk_2` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `usuario_tarefa`
--
ALTER TABLE `usuario_tarefa`
  ADD CONSTRAINT `fk_usutaf_tarefa` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefas` (`id_tarefa`),
  ADD CONSTRAINT `fk_usutaf_usuaio` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
