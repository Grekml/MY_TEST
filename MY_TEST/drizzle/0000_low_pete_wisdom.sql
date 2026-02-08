CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`refresh_token_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`last_used_at` integer
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`original_name` text NOT NULL,
	`stored_path` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`is_image` integer NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);
