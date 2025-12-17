-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 17.12.2025 klo 09:48
-- Palvelimen versio: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trackfin`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `type` enum('income','expense') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `category`
--

INSERT INTO `category` (`id`, `user_id`, `category_name`, `type`) VALUES
(13, 1, 'UPDATED', 'expense'),
(8, 3, 'expense', 'expense'),
(9, 3, 'Salary', 'income'),
(6, 3, 'test income', 'income'),
(15, 4, 'Test expense', 'expense'),
(14, 4, 'Test income', 'income'),
(17, 4, 'TESTING', 'income');

-- --------------------------------------------------------

--
-- Rakenne taululle `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `transaction`
--

INSERT INTO `transaction` (`id`, `user_id`, `category_id`, `description`, `amount`, `created_at`) VALUES
(7, 3, 8, 'Updated 2', 999.00, '2025-12-09 06:35:34'),
(8, 3, 6, 'income', 1000.90, '2025-12-09 06:17:06'),
(9, 4, 14, 'Unknown income', 5000.00, '2025-12-10 09:29:42'),
(10, 4, 15, 'UPDATED expense', 2500.00, '2025-12-10 09:41:15');

-- --------------------------------------------------------

--
-- Rakenne taululle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `user`
--

INSERT INTO `user` (`id`, `username`, `password_hash`) VALUES
(1, 's', '$2y$10$VzEjqrlSFfUZ9/HMUm9izeHEc6qmsZ/HIb2C0YXF0KcM.swk5jJka'),
(2, 'sd', '$2y$10$MXw71ndzKSIo.x5ixUy0q.AJV5xrpgyw9lTjOr9NLBTZynkLcY4Tq'),
(3, '1', '$2y$10$pBfBvt9CEsXcgq3/AWlUueyRLqvbjcBCetCBs7hAwCeqzL2/eQ4AW'),
(4, 'test', '$2y$10$8rmGB9uWWIZKSdFuSTDALeehiryPOtmxyBkoDQ./WohNck7JjyEU6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`category_name`,`type`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_transaction` (`user_id`,`category_id`,`description`,`created_at`),
  ADD KEY `transaction_ibfk_2` (`category_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Rajoitteet taululle `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
