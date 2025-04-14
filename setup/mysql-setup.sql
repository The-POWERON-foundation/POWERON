-- Structure for table `users`
CREATE TABLE `users` (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `email` varchar(256) NOT NULL,
    `username` varchar(32) NOT NULL,
    `password` varchar(32) NOT NULL,
    `nickname` varchar(32) NOT NULL,
    `bio` varchar(256) DEFAULT NULL,
    `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `auth_token` varchar(32) DEFAULT NULL
);

-- Structure for table `programs`
CREATE TABLE `programs` (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `title` varchar(128) NOT NULL,
    `author_id` int  NULL,
    `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `language` varchar(32) NOT NULL,
    `forked_from_program_id` int DEFAULT NULL,
    `forked_from_author_id` int DEFAULT NULL,
    `url_title` varchar(32) NOT NULL
);