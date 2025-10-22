-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-10-2025 a las 02:46:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_eventos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `artistas`
--

CREATE TABLE `artistas` (
  `Id_Artistas` int(5) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Genero_musical` varchar(255) NOT NULL,
  `Ciudad_origen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `artistas`
--

INSERT INTO `artistas` (`Id_Artistas`, `Nombre`, `Genero_musical`, `Ciudad_origen`) VALUES
(1, 'valerin', 'reggae', 'soacha\r\n'),
(2, 'Laura Martínez Gómez', 'ds', 'dsf'),
(3, 'audja', 'wrwsgt', 'erter');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boletas`
--

CREATE TABLE `boletas` (
  `Id_Boletas` int(5) NOT NULL,
  `Valor` decimal(19,0) NOT NULL,
  `Serial` int(10) NOT NULL,
  `Disponibilidad` varchar(255) NOT NULL,
  `Cantidad` decimal(19,0) NOT NULL,
  `eventosId_Eventos` int(5) NOT NULL,
  `compraId_Compra` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `Id_Compra` int(5) NOT NULL,
  `Codigo_facturacion` int(10) NOT NULL,
  `Metodo_pago` varchar(255) NOT NULL,
  `Estado_transaccion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `Id_Departamento` int(11) NOT NULL,
  `Nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entity7`
--

CREATE TABLE `entity7` (
  `usuariosId_Usuarios` int(5) NOT NULL,
  `eventosId_Eventos` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entity8`
--

CREATE TABLE `entity8` (
  `eventosId_Eventos` int(5) NOT NULL,
  `artistasId_Artistas` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `Id_Eventos` int(5) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` varchar(255) NOT NULL,
  `Fecha_inicio` date NOT NULL,
  `Hora_inicio` time NOT NULL,
  `Fecha_fin` date NOT NULL,
  `municipioId_Municipio` int(11) DEFAULT NULL,
  `Hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`Id_Eventos`, `Nombre`, `Descripcion`, `Fecha_inicio`, `Hora_inicio`, `Fecha_fin`, `municipioId_Municipio`, `Hora_fin`) VALUES
(1, 'Concierto Maluma', 'Hermoso', '2025-10-01', '12:30:02', '2025-10-31', NULL, '17:20:02'),
(3, 'sd', 'ddd', '2025-09-30', '19:19:00', '2025-10-21', NULL, '19:20:00'),
(4, 'juliette', 'adujaid', '2025-10-01', '19:34:00', '2025-10-20', NULL, '19:35:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

CREATE TABLE `localidades` (
  `Id_Localidades` int(5) NOT NULL,
  `Tipo_localidad` varchar(255) NOT NULL,
  `Valor_localidad` decimal(19,0) NOT NULL,
  `eventosId_Eventos` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `localidades`
--

INSERT INTO `localidades` (`Id_Localidades`, `Tipo_localidad`, `Valor_localidad`, `eventosId_Eventos`) VALUES
(1, 'hfc', 1000, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `Id_Municipio` int(11) NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `departamentoId_Departamento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `Id_Rol` int(5) NOT NULL,
  `Rol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id_Usuarios` int(5) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Documento` int(15) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `rolId_Rol` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `artistas`
--
ALTER TABLE `artistas`
  ADD PRIMARY KEY (`Id_Artistas`);

--
-- Indices de la tabla `boletas`
--
ALTER TABLE `boletas`
  ADD PRIMARY KEY (`Id_Boletas`),
  ADD KEY `FKboletas906200` (`compraId_Compra`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`Id_Compra`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`Id_Departamento`);

--
-- Indices de la tabla `entity7`
--
ALTER TABLE `entity7`
  ADD PRIMARY KEY (`usuariosId_Usuarios`,`eventosId_Eventos`);

--
-- Indices de la tabla `entity8`
--
ALTER TABLE `entity8`
  ADD PRIMARY KEY (`eventosId_Eventos`,`artistasId_Artistas`),
  ADD KEY `FKEntity87194` (`artistasId_Artistas`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`Id_Eventos`),
  ADD KEY `fk_eventos_municipio` (`municipioId_Municipio`);

--
-- Indices de la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`Id_Localidades`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`Id_Municipio`),
  ADD KEY `departamentoId_Departamento` (`departamentoId_Departamento`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`Id_Rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id_Usuarios`),
  ADD KEY `FKusuarios470309` (`rolId_Rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `artistas`
--
ALTER TABLE `artistas`
  MODIFY `Id_Artistas` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `boletas`
--
ALTER TABLE `boletas`
  MODIFY `Id_Boletas` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `Id_Compra` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `Id_Departamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `Id_Eventos` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `Id_Localidades` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `Id_Municipio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `Id_Rol` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id_Usuarios` int(5) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `boletas`
--
ALTER TABLE `boletas`
  ADD CONSTRAINT `FKboletas906200` FOREIGN KEY (`compraId_Compra`) REFERENCES `compra` (`Id_Compra`);

--
-- Filtros para la tabla `entity7`
--
ALTER TABLE `entity7`
  ADD CONSTRAINT `FKEntity7485599` FOREIGN KEY (`usuariosId_Usuarios`) REFERENCES `usuarios` (`Id_Usuarios`);

--
-- Filtros para la tabla `entity8`
--
ALTER TABLE `entity8`
  ADD CONSTRAINT `FKEntity87194` FOREIGN KEY (`artistasId_Artistas`) REFERENCES `artistas` (`Id_Artistas`),
  ADD CONSTRAINT `entity8_ibfk_1` FOREIGN KEY (`eventosId_Eventos`) REFERENCES `eventos` (`Id_Eventos`);

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `fk_eventos_municipio` FOREIGN KEY (`municipioId_Municipio`) REFERENCES `municipios` (`Id_Municipio`);

--
-- Filtros para la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD CONSTRAINT `municipios_ibfk_1` FOREIGN KEY (`departamentoId_Departamento`) REFERENCES `departamentos` (`Id_Departamento`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `FKusuarios470309` FOREIGN KEY (`rolId_Rol`) REFERENCES `rol` (`Id_Rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
