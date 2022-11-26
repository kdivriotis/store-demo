DROP DATABASE IF EXISTS store;
CREATE SCHEMA store;

USE store;

CREATE TABLE `admin` (
	id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) NOT NULL COMMENT 'Administrator UUID',
    username VARCHAR(100) NOT NULL COMMENT 'Name',
    email VARCHAR(250) NOT NULL UNIQUE COMMENT 'Contact email address',
    password VARCHAR(60) NOT NULL COMMENT 'Hashed password',
    otp CHAR(6) COMMENT 'One time password',
    otp_date DATETIME COMMENT 'Date & time when the one-time-password was created (for expiration)',
    otp_retries INT COMMENT 'One-time-password number of retries (after 3 fails the otp will be reset)',
    CONSTRAINT `check_admin_otp` CHECK (REGEXP_LIKE(`otp`, _utf8mb4 '^[0-9]{6}$')),
    PRIMARY KEY (id)
);

CREATE TABLE `partner` (
	id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) NOT NULL COMMENT 'Partner UUID',
    name VARCHAR(100) NOT NULL COMMENT 'Name',
    surname VARCHAR(100) NOT NULL COMMENT 'Surname',
    store_name VARCHAR(100) NOT NULL COMMENT 'Store''s name',
    is_verified TINYINT DEFAULT 0 NOT NULL COMMENT 'Partner is verified (0=false, 1=true)',
    vat CHAR(9) NOT NULL UNIQUE COMMENT 'VAT number (9 digits)',
    doy VARCHAR(100) NOT NULL COMMENT 'Store''s D.O.Y.',
    email VARCHAR(250) NOT NULL UNIQUE COMMENT 'Contact email address',
    email_verified TINYINT DEFAULT 0 NOT NULL COMMENT 'Email address is verified (0=false, 1=true)',
    phone CHAR(10) NOT NULL COMMENT 'Contact phone number',
    site_url VARCHAR(200) DEFAULT NULL COMMENT 'Partner''s website URL',
    site_url_is_verified TINYINT DEFAULT 0 NOT NULL COMMENT 'Partner''s website URL is verified (0=false, 1=true)',
    password VARCHAR(60) NOT NULL COMMENT 'Hashed password',
    hash VARCHAR(32) NOT NULL UNIQUE COMMENT 'Hash used for email authentication',
    otp CHAR(6) COMMENT 'One time password, used for forgotten password',
    otp_date DATETIME COMMENT 'Date & time when the one-time-password was created (for expiration)',
    otp_retries INT DEFAULT 0 COMMENT 'One-time-password number of retries (after 3 fails the otp will be reset)',
    CONSTRAINT `check_partner_vat` CHECK (REGEXP_LIKE(`vat`, _utf8mb4 '^[0-9]{9}$')),
    CONSTRAINT `check_partner_email` CHECK(REGEXP_LIKE(`email`, _utf8mb4 "^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$")),
    CONSTRAINT `check_partner_phone` CHECK (REGEXP_LIKE(`phone`, _utf8mb4 '^[0-9]{10}$')),
    PRIMARY KEY (id)
);

CREATE TABLE `product` (
	id INT NOT NULL AUTO_INCREMENT COMMENT 'Product''s unique identifier',
    appearance_order INT DEFAULT 0 NOT NULL COMMENT 'Product''s appearance order',
    name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Product''s name',
    description VARCHAR(500) NOT NULL COMMENT 'Product''s full description',
    short_description VARCHAR(200) NOT NULL COMMENT 'Product''s short description',
    price DECIMAL(10, 2) NOT NULL COMMENT 'Product''s price (in euros)',
    is_deleted TINYINT DEFAULT 0 NOT NULL COMMENT 'Product is deleted (0=false, 1=true)',
    CONSTRAINT `check_product_price` CHECK(`price` > 0),
    PRIMARY KEY (id)
);

CREATE TABLE `partner_order` (
	id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) NOT NULL COMMENT 'Order UUID',
	order_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Date/time that the order was placed',
    total DECIMAL(10, 2) NOT NULL COMMENT 'Total amount of the order (in euros)',
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'The last date/time when the order''s status was last changed',
    status INT DEFAULT 0 NOT NULL COMMENT 'The order''s current status: 0=Pending, 1=In Progress, 2=Confirmed, 3=Canceled, 4=Rejected',
    partner_id BINARY(16) NOT NULL COMMENT 'Partner that placed the order',
    order_comment VARCHAR(200) COMMENT 'Extra comments related to the order (optional)',
    CONSTRAINT `ordered_by_partner` FOREIGN KEY (partner_id) REFERENCES `partner` (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `check_partner_order_total` CHECK(`total` > 0),
    CONSTRAINT `check_partner_order_status` CHECK(`status` BETWEEN 0 AND 4),
    PRIMARY KEY (id)
);

CREATE TABLE `partner_order_details` (
	quantity INT DEFAULT 1 NOT NULL COMMENT 'Quantity of the product that was included in order',
	price DECIMAL(10, 2) NOT NULL COMMENT 'Price of the item that is related',
    order_id BINARY(16) NOT NULL COMMENT 'Unique ID of the parent order',
    product_id INT COMMENT 'Unique ID of the related product',
    CONSTRAINT `related_product_partner_order_details` FOREIGN KEY (product_id) REFERENCES `product` (id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `belongs_to_partner_order` FOREIGN KEY (order_id) REFERENCES `partner_order` (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `check_order_quantity` CHECK(`quantity` > 0),
    CONSTRAINT `check_order_price` CHECK(`price` > 0)
);

CREATE TABLE `post` (
	link VARCHAR(50) NOT NULL COMMENT 'Post''s unique link',
    title VARCHAR(100) UNIQUE NOT NULL COMMENT 'Post''s title (unique)',
    subtitle VARCHAR(100) COMMENT 'Subtitle (optional)',
    summary VARCHAR(400) COMMENT 'Post''s short summary',
    content TEXT COMMENT 'Post''s full content',
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'The date/time when the post was created',
    PRIMARY KEY (link)
);

ALTER TABLE `partner`
    ADD INDEX idx_partner_vat (`vat`),
    ADD INDEX idx_partner_email (`email`),
	ADD INDEX idx_partner_phone (`phone`),
    ADD INDEX idx_partner_verified (`is_verified`);
    
ALTER TABLE `product`
	ADD INDEX idx_product_deleted (`is_deleted`),
	ADD INDEX idx_product_appearance_order (`appearance_order`);
    
ALTER TABLE `partner_order`
	ADD INDEX idx_partner_order_date (`order_date`),
    ADD INDEX idx_partner_order_status (`status`);

ALTER TABLE `post`
	ADD INDEX idx_post_title (`title`),
	ADD INDEX idx_post_date (`post_date`);