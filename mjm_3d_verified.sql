-- MySQL dump 10.13  Distrib 8.4.10, for Linux (aarch64)
--
-- Host: localhost    Database: mjm_3d
-- ------------------------------------------------------
-- Server version	8.4.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Administrador`
--

DROP TABLE IF EXISTS `Administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Administrador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Administrador`
--

LOCK TABLES `Administrador` WRITE;
/*!40000 ALTER TABLE `Administrador` DISABLE KEYS */;
INSERT INTO `Administrador` VALUES (1,'Admin','Principal','admin@mail.com','$2b$10$gwmnJWQzNTuchUbDBTzLYOGXGDs0Tnm4rTCN8GnjisTGSJ2OQbVsu','2026-10-16 01:10:04','2026-10-16 01:10:04','2026-10-16 01:10:04',NULL);
/*!40000 ALTER TABLE `Administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Carrito`
--

DROP TABLE IF EXISTS `Carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Carrito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `Carrito_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Carrito`
--

LOCK TABLES `Carrito` WRITE;
/*!40000 ALTER TABLE `Carrito` DISABLE KEYS */;
INSERT INTO `Carrito` VALUES (1,1,'2026-10-16 01:10:08','2026-10-16 01:10:08','2026-10-16 01:10:08',NULL),(2,2,'2026-10-16 01:10:09','2026-10-16 01:10:09','2026-10-16 01:10:09',NULL);
/*!40000 ALTER TABLE `Carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categoria`
--

DROP TABLE IF EXISTS `Categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categoria`
--

LOCK TABLES `Categoria` WRITE;
/*!40000 ALTER TABLE `Categoria` DISABLE KEYS */;
INSERT INTO `Categoria` VALUES (1,'Impresión 3D','Objetos impresos en 3D','2026-10-16 01:10:04','2026-10-16 01:10:04',NULL),(2,'Filamento','Rollos de filamento para impresión','2026-10-16 01:10:04','2026-10-16 01:10:04',NULL),(3,'Repuestos','Repuestos y componentes','2026-10-16 01:10:05','2026-10-16 01:10:05',NULL),(4,'Accesorios','Accesorios varios','2026-10-16 01:10:05','2026-10-16 01:10:05',NULL),(5,'Juguetes','Articulos Divertidos','2026-10-16 01:10:05','2026-10-16 01:10:05',NULL);
/*!40000 ALTER TABLE `Categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Domicilio`
--

DROP TABLE IF EXISTS `Domicilio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Domicilio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `calle` varchar(200) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `codigoPostal` varchar(10) NOT NULL,
  `referencia` varchar(250) DEFAULT NULL,
  `favorito` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `Domicilio_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Domicilio`
--

LOCK TABLES `Domicilio` WRITE;
/*!40000 ALTER TABLE `Domicilio` DISABLE KEYS */;
INSERT INTO `Domicilio` VALUES (1,1,'San Martín','123','Mendoza','Mendoza','5500',NULL,0,'2026-10-16 01:10:05','2026-10-16 01:10:05',NULL),(2,2,'Belgrano','456','Mendoza','Mendoza','5501',NULL,0,'2026-10-16 01:10:05','2026-10-16 01:10:05',NULL),(3,3,'Rivadavia','789','Ciudad de Buenos Aires','Buenos Aires','1000',NULL,0,'2026-10-16 01:10:06','2026-10-16 01:10:06',NULL);
/*!40000 ALTER TABLE `Domicilio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Imagenes`
--

DROP TABLE IF EXISTS `Imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Imagenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idProducto` int DEFAULT NULL,
  `orden` int NOT NULL DEFAULT '0',
  `imagen` varchar(200) NOT NULL,
  `hash` varchar(64) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `Imagenes_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `Producto` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Imagenes`
--

LOCK TABLES `Imagenes` WRITE;
/*!40000 ALTER TABLE `Imagenes` DISABLE KEYS */;
INSERT INTO `Imagenes` VALUES (1,1,0,'/archivos/images/assets_productos_1b39e142491fa491da068a27a509a7d9a-1792113149387-907322366.png','1b39e142491fa491da068a27a509a7d9ae36b6cf51e017ad690f99d5eb59df25',NULL,'2026-10-16 01:12:29','2026-10-16 01:12:29',NULL),(2,3,0,'/archivos/images/Chase-1792115408978-192488635.png','769b9a1e767219bf6a7c57217ff97aeccd690388a951df30b9aa1bc42258ed77',NULL,'2026-10-16 01:50:09','2026-10-16 01:50:09',NULL),(3,3,1,'/archivos/images/Fail-1792115409022-547764254.webp','45f8f79b66ba47444adb1a73154681c936c96d2429d53fa8474a67448d28e5b4',NULL,'2026-10-16 01:50:09','2026-10-16 01:50:09',NULL),(4,3,2,'/archivos/images/assets_productos_1b39e142491fa491da068a27a509a7d9a-1792115409035-269526955.png',NULL,NULL,'2026-10-16 01:50:09','2026-10-16 01:50:09',NULL),(5,1,1,'/archivos/images/test1-1792115477793-615767042.png','6b7fa434f92a8b80aab02d9bf1a12e49ffcae424e4013a1c4f68b67e3d2bbcd0',NULL,'2026-10-16 01:51:17','2026-10-16 01:51:17',NULL),(6,1,2,'/archivos/images/test2-1792115477794-167253965.png','c414cd0e204de974f73753c7e28d7638e7b3691bb8b1a2bab6b25bb7fed7ce77',NULL,'2026-10-16 01:51:18','2026-10-16 01:51:18',NULL);
/*!40000 ALTER TABLE `Imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ItemxCarrito`
--

DROP TABLE IF EXISTS `ItemxCarrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ItemxCarrito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCarrito` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ItemxCarrito_idProducto_idCarrito_unique` (`idCarrito`,`idProducto`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `ItemxCarrito_ibfk_1` FOREIGN KEY (`idCarrito`) REFERENCES `Carrito` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ItemxCarrito_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `Producto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ItemxCarrito`
--

LOCK TABLES `ItemxCarrito` WRITE;
/*!40000 ALTER TABLE `ItemxCarrito` DISABLE KEYS */;
INSERT INTO `ItemxCarrito` VALUES (1,1,1,2,2500.00,5000.00,'2026-10-16 01:10:09','2026-10-16 01:10:09',NULL),(2,1,3,1,3200.00,3200.00,'2026-10-16 01:10:09','2026-10-16 01:10:09',NULL),(3,2,2,3,1800.00,5400.00,'2026-10-16 01:10:10','2026-10-16 01:10:10',NULL);
/*!40000 ALTER TABLE `ItemxCarrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ItemxPedido`
--

DROP TABLE IF EXISTS `ItemxPedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ItemxPedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ItemxPedido_idProducto_idPedido_unique` (`idPedido`,`idProducto`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `ItemxPedido_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `Pedido` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ItemxPedido_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `Producto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ItemxPedido`
--

LOCK TABLES `ItemxPedido` WRITE;
/*!40000 ALTER TABLE `ItemxPedido` DISABLE KEYS */;
INSERT INTO `ItemxPedido` VALUES (1,1,1,2,2500.00,5000.00,'2026-10-16 01:10:11','2026-10-16 01:10:11',NULL),(2,1,3,1,3200.00,3200.00,'2026-10-16 01:10:11','2026-10-16 01:10:11',NULL),(3,2,2,3,1800.00,5400.00,'2026-10-16 01:10:11','2026-10-16 01:10:11',NULL),(4,3,4,1,3800.00,3800.00,'2026-10-16 01:10:12','2026-10-16 01:10:12',NULL),(5,5,1,2,2500.00,5000.00,'2026-10-23 23:26:39','2026-10-23 23:26:39',NULL);
/*!40000 ALTER TABLE `ItemxPedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pago`
--

DROP TABLE IF EXISTS `Pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `metodoPago` varchar(50) NOT NULL,
  `estadoPago` varchar(50) DEFAULT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idPedido` (`idPedido`),
  CONSTRAINT `Pago_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `Pedido` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pago`
--

LOCK TABLES `Pago` WRITE;
/*!40000 ALTER TABLE `Pago` DISABLE KEYS */;
INSERT INTO `Pago` VALUES (1,1,'Tarjeta de crédito','Aprobado','2026-10-16 01:10:12',8200.00,'2026-10-16 01:10:12','2026-10-16 01:10:12',NULL),(2,2,'Transferencia','Aprobado','2026-10-16 01:10:12',5400.00,'2026-10-16 01:10:12','2026-10-16 01:10:12',NULL),(3,5,'MercadoPago','Aprobado','2026-10-23 23:26:39',5100.00,'2026-10-23 23:26:39','2026-10-23 23:26:39',NULL);
/*!40000 ALTER TABLE `Pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pedido`
--

DROP TABLE IF EXISTS `Pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `fechaPedido` datetime DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `Pedido_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pedido`
--

LOCK TABLES `Pedido` WRITE;
/*!40000 ALTER TABLE `Pedido` DISABLE KEYS */;
INSERT INTO `Pedido` VALUES (1,1,'2026-10-16 01:10:10',8200.00,'Entregado','2026-10-16 01:10:10','2026-10-16 01:10:10',NULL),(2,2,'2026-10-16 01:10:10',5400.00,'Enviado','2026-10-16 01:10:10','2026-10-16 01:10:10',NULL),(3,3,'2026-10-16 01:10:10',3200.00,'Pendiente','2026-10-16 01:10:10','2026-10-16 01:10:10',NULL),(4,1,'2026-10-20 11:48:47',1900.00,'Entregado','2026-10-20 11:48:47','2026-10-20 11:50:14',NULL),(5,1,'2026-10-23 23:26:39',5100.00,'Pendiente','2026-10-23 23:26:39','2026-10-23 23:26:39',NULL);
/*!40000 ALTER TABLE `Pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Producto`
--

DROP TABLE IF EXISTS `Producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `idCategoria` int NOT NULL,
  `idAdministrador` int NOT NULL,
  `fechaAdmin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idCategoria` (`idCategoria`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `Producto_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `Categoria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Producto_ibfk_2` FOREIGN KEY (`idAdministrador`) REFERENCES `Administrador` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Producto`
--

LOCK TABLES `Producto` WRITE;
/*!40000 ALTER TABLE `Producto` DISABLE KEYS */;
INSERT INTO `Producto` VALUES (1,'Figura de dragón','Figura decorativa de dragón en PLA',2500.00,10,1,1,'2026-10-16 01:12:29','2026-10-16 01:10:06','2026-10-16 01:12:29',NULL),(2,'Estuche para celular','Estuche protector para celular genérico',1800.00,1,1,1,'2026-10-16 01:12:05','2026-10-16 01:10:06','2026-10-16 01:12:05',NULL),(3,'Filamento PLA 1kg','Rollo de PLA 1.75mm color negro',3200.00,50,2,1,'2026-10-16 01:50:08','2026-10-16 01:10:07','2026-10-16 01:50:08',NULL),(4,'Filamento PETG 1kg','Rollo de PETG 1.75mm transparente',3800.00,30,2,1,'2026-10-16 01:10:07','2026-10-16 01:10:07','2026-10-16 01:10:07',NULL),(5,'Boquilla 0.4mm','Boquilla de brass para hotend estándar',800.00,100,3,1,'2026-10-16 01:10:07','2026-10-16 01:10:07','2026-10-16 01:10:07',NULL),(6,'Correa GT2','Correa dentada GT2 6mm',450.00,40,3,1,'2026-10-16 01:10:07','2026-10-16 01:10:08','2026-10-16 01:10:08',NULL),(7,'Base de cama adhesiva','Superficie adhesiva para cama de impresión',1200.00,20,4,1,'2026-10-16 01:10:08','2026-10-16 01:10:08','2026-10-16 01:10:08',NULL),(8,'Pinza de calibración','Pinza metálica para nivelar la cama',600.00,35,4,1,'2026-10-16 01:10:08','2026-10-16 01:10:08','2026-10-16 01:10:08',NULL);
/*!40000 ALTER TABLE `Producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `telefono` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,'Juan','Pérez','juan@mail.com','$2b$10$wdICDhjQUApCti0RSJrcz.rM21VdtZdvsa4kpK2qsHU/XB/rRk49W','2026-10-16 01:10:03',NULL,'2026-10-16 01:10:03','2026-10-16 01:10:03',NULL),(2,'María','López','maria@mail.com','$2b$10$SdT/OcffUmSQ5D19vL4Ehusth.S33LHieS.amFdfzOS0UWPsELT0m','2026-10-16 01:10:03',NULL,'2026-10-16 01:10:03','2026-10-16 01:10:03',NULL),(3,'Carlos','García','carlos@mail.com','$2b$10$cgcxG.Z8cVa77qEVs47cX.NMFXmE5/oaKG79lVTBJ6MjsRJcnyyp6','2026-10-16 01:10:03',NULL,'2026-10-16 01:10:03','2026-10-16 01:10:03',NULL),(4,'Quete','Importa','quete@gmail.com','$2b$10$ximgfyugcEdpMgoqxoGBXeojZheQLHMs5td6h9DT1Ytqo8aHoaEuC','2026-10-24 15:27:57',NULL,'2026-10-24 15:27:57','2026-10-24 15:27:57',NULL),(5,'Juan Carlos','Donoso','jcdonoso@hotmail.com.ar','$2b$10$nWVoYoR847rhzClMPgnIxuXs6G4sn5MVOzv8V4sV2lJRT3cxCcEQq','2026-10-28 01:03:04',NULL,'2026-10-28 01:03:04','2026-10-28 01:03:04',NULL);
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'mjm_3d'
--

--
-- Dumping routines for database 'mjm_3d'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-30 18:11:08
