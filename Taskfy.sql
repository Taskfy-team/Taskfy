-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: taskfy
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `nome_admin` varchar(30) DEFAULT NULL,
  `email_admin` varchar(30) DEFAULT NULL,
  `senha_admin` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `id_chat` int(11) NOT NULL AUTO_INCREMENT,
  `mensagem_chat` text DEFAULT NULL,
  `data_mensagem` date DEFAULT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `fk_tarefa` int(11) DEFAULT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_chat`),
  KEY `fk_equipe_chat` (`fk_equipe`),
  KEY `fk_tarefa_chat` (`fk_tarefa`),
  KEY `fk_usuario_chat` (`fk_usuario`),
  CONSTRAINT `fk_equipe_chat` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`),
  CONSTRAINT `fk_tarefa_chat` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefas` (`id_tarefa`),
  CONSTRAINT `fk_usuario_chat` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipes`
--

DROP TABLE IF EXISTS `equipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipes` (
  `id_equipe` int(11) NOT NULL AUTO_INCREMENT,
  `nome_equipe` varchar(20) DEFAULT NULL,
  `desc_equipe` varchar(40) DEFAULT NULL,
  `status_equipe` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_equipe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipes`
--

LOCK TABLES `equipes` WRITE;
/*!40000 ALTER TABLE `equipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarefas`
--

DROP TABLE IF EXISTS `tarefas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tarefas` (
  `id_tarefa` int(11) NOT NULL AUTO_INCREMENT,
  `nome_tarefa` varchar(20) DEFAULT NULL,
  `descricao_tarefa` varchar(40) DEFAULT NULL,
  `status_tarefa` varchar(10) DEFAULT NULL,
  `fk_dono_tarefa` int(11) DEFAULT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tarefa`),
  KEY `fk_dono_tarefa` (`fk_dono_tarefa`),
  KEY `fk_equipe` (`fk_equipe`),
  CONSTRAINT `fk_dono_tarefa` FOREIGN KEY (`fk_dono_tarefa`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_equipe` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas`
--

LOCK TABLES `tarefas` WRITE;
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarefas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_tarefa`
--

DROP TABLE IF EXISTS `timeline_tarefa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeline_tarefa` (
  `id_timeline` int(11) NOT NULL AUTO_INCREMENT,
  `mensagem_timeline` text DEFAULT NULL,
  `data_timline` date DEFAULT NULL,
  `anexo_timeline` mediumblob DEFAULT NULL,
  `fk_equipe` int(11) DEFAULT NULL,
  `fk_tarefa` int(11) DEFAULT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_timeline`),
  KEY `fk_equipe_timeline` (`fk_equipe`),
  KEY `fk_tarefa_timeline` (`fk_tarefa`),
  KEY `fk_usuario_timeline` (`fk_usuario`),
  CONSTRAINT `fk_equipe_timeline` FOREIGN KEY (`fk_equipe`) REFERENCES `equipes` (`id_equipe`),
  CONSTRAINT `fk_tarefa_timeline` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefas` (`id_tarefa`),
  CONSTRAINT `fk_usuario_timeline` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_tarefa`
--

LOCK TABLES `timeline_tarefa` WRITE;
/*!40000 ALTER TABLE `timeline_tarefa` DISABLE KEYS */;
/*!40000 ALTER TABLE `timeline_tarefa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome_usuario` varchar(30) DEFAULT NULL,
  `email_usuario` varchar(30) DEFAULT NULL,
  `senha_usuario` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'adolfo','minecraftalemao@ww2.bol.com','123'),(2,'carlao','cal@ao.com','123'),(3,'marcos','marc@os.com','123');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_tarefa`
--

DROP TABLE IF EXISTS `usuario_tarefa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_tarefa` (
  `id_use_taf` int(11) NOT NULL AUTO_INCREMENT,
  `fk_usuario` int(11) NOT NULL,
  `fk_tarefa` int(11) NOT NULL,
  PRIMARY KEY (`id_use_taf`),
  KEY `fk_usutaf_usuaio` (`fk_usuario`),
  KEY `fk_usutaf_tarefa` (`fk_tarefa`),
  CONSTRAINT `fk_usutaf_tarefa` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefas` (`id_tarefa`),
  CONSTRAINT `fk_usutaf_usuaio` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_tarefa`
--

LOCK TABLES `usuario_tarefa` WRITE;
/*!40000 ALTER TABLE `usuario_tarefa` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_tarefa` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-09 21:56:54
