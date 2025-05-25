-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/05/2025 às 20:38
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
  `status_equipe` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `numeroTelefone` varchar(11) NOT NULL,
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome_usuario`, `email_usuario`, `senha_usuario`, `dataNascimento`, `numeroTelefone`, `status`) VALUES
(1, 'adolfo', 'minecraftalemao@ww2.bol.com', '123', NULL, '', ''),
(2, 'carlao', 'cal@ao.com', '123', NULL, '', ''),
(3, 'marcos', 'marc@os.com', '123', NULL, '', '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_equipe`
--

CREATE TABLE `usuario_equipe` (
  `id_usr_equipe` int(11) NOT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `fk_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD PRIMARY KEY (`id_equipe`);

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
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `chat`
--
ALTER TABLE `chat`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipes`
--
ALTER TABLE `equipes`
  MODIFY `id_equipe` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tarefas`
--
ALTER TABLE `tarefas`
  MODIFY `id_tarefa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `timeline_tarefa`
--
ALTER TABLE `timeline_tarefa`
  MODIFY `id_timeline` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuario_equipe`
--
ALTER TABLE `usuario_equipe`
  MODIFY `id_usr_equipe` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario_tarefa`
--
ALTER TABLE `usuario_tarefa`
  MODIFY `id_use_taf` int(11) NOT NULL AUTO_INCREMENT;

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
