CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hearts` (
	`id` text PRIMARY KEY NOT NULL,
	`post` text NOT NULL,
	`owner` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author` text NOT NULL,
	`owner` text NOT NULL,
	`body` text NOT NULL,
	`category` text NOT NULL,
	`photo` text,
	`created` integer NOT NULL
);
