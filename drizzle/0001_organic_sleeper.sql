CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`end_date` text NOT NULL,
	`time` text NOT NULL,
	`end_time` text NOT NULL,
	`all_day` integer NOT NULL,
	`category` text NOT NULL,
	`location` text NOT NULL,
	`note` text NOT NULL,
	`author` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
