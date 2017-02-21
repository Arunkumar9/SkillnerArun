-- phpMyAdmin SQL Dump
-- version 2.11.4
-- http://www.phpmyadmin.net
--
-- Počítač: localhost
-- Vygenerováno: Úterý 22. července 2008, 02:59
-- Verze MySQL: 5.0.51
-- Verze PHP: 5.2.5

SET FOREIGN_KEY_CHECKS=0;

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

SET AUTOCOMMIT=0;
START TRANSACTION;

--
-- Databáze: `mrems`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `attributes`
--

DROP TABLE IF EXISTS `attributes`;
CREATE TABLE `attributes` (
  `uid` int(11) NOT NULL auto_increment,
  `object_uid` varchar(128) character set utf8 collate utf8_bin NOT NULL,
  `value` text,
  `definition_uid` int(11) default NULL,
  PRIMARY KEY  (`uid`),
  KEY `fk_attributes_object` (`object_uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Vypisuji data pro tabulku `attributes`
--


-- --------------------------------------------------------

--
-- Struktura tabulky `attribute_definitions`
--

DROP TABLE IF EXISTS `attribute_definitions`;
CREATE TABLE `attribute_definitions` (
  `uid` int(11) NOT NULL auto_increment,
  `name` text,
  `type` tinyint(4) unsigned default NULL,
  `primary` tinyint(1) unsigned NOT NULL default '0',
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Vypisuji data pro tabulku `attribute_definitions`
--


-- --------------------------------------------------------

--
-- Struktura tabulky `attribute_types`
--

DROP TABLE IF EXISTS `attribute_types`;
CREATE TABLE `attribute_types` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `name` text,
  `editor` text,
  `renderer` text,
  `i18n` tinyint(4) NOT NULL default '1',
  `formater` text,
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Vypisuji data pro tabulku `attribute_types`
--

INSERT INTO `attribute_types` (`uid`, `name`, `editor`, `renderer`, `i18n`, `formater`) VALUES
(1, 'a:2:{s:2:"Cs";s:4:"text";s:2:"De";s:4:"text";}', '{ xtype: ''textfield'' }', NULL, 1, NULL),
(2, 'a:2:{s:2:"Cs";s:7:"ÄÃ­slo";s:2:"De";s:6:"nummer";}', '{ xtype: ''numberfield'' }', NULL, 0, NULL),
(3, 'a:2:{s:2:"Cs";s:8:"ano / ne";s:2:"De";s:9:"ja / nein";}', '{ xtype: ''checkbox'' }', 'Fresh.GridRender.CheckBoxRenderer', 0, 'booleanFormat'),
(4, 'a:2:{s:2:"Cs";s:5:"datum";s:2:"De";s:4:"date";}', '{ xtype: ''datefield'' }', 'Fresh.util.dateRendererU()', 0, 'dateFormatShort'),
(6, 'a:2:{s:2:"Cs";s:8:"textarea";s:2:"De";s:8:"textarea";}', '{ xtype: ''textarea'' }', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `be_users`
--

DROP TABLE IF EXISTS `be_users`;
CREATE TABLE `be_users` (
  `Uid` int(10) unsigned NOT NULL auto_increment,
  `Username` varchar(128) NOT NULL,
  `Email` varchar(128) NOT NULL,
  `Password` varchar(128) NOT NULL,
  `Role` int(11) default NULL,
  `Name` varchar(128) default NULL,
  `Created` int(10) unsigned NOT NULL default '0',
  `Updated` int(10) unsigned NOT NULL default '0',
  `Level` smallint(4) unsigned default NULL,
  `ReadLevel` smallint(4) unsigned default NULL,
  `LastIP` varchar(15) default NULL,
  `LastDate` int(11) default NULL,
  `Password1` varchar(128) default NULL,
  `Password2` varchar(128) default NULL,
  `Password3` varchar(128) default NULL,
  `LastPasswordChange` int(11) default NULL,
  `DesktopConfig` mediumblob,
  PRIMARY KEY  (`Uid`),
  KEY `Username` (`Username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Vypisuji data pro tabulku `be_users`
--

INSERT INTO `be_users` (`Uid`, `Username`, `Email`, `Password`, `Role`, `Name`, `Created`, `Updated`, `Level`, `ReadLevel`, `LastIP`, `LastDate`, `Password1`, `Password2`, `Password3`, `LastPasswordChange`, `DesktopConfig`) VALUES
(1, 'SuperAdmins', '', '', NULL, 'Super Admins', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Admins', '', '', NULL, 'Admins', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'super', 'super@seidel.com', 'dc724af18fbdd4e59189f5fe768a5f8311527050', 1, 'Peter Superior', 0, 0, 400, NULL, '127.0.0.1', 1216678068, 'dc724af18fbdd4e59189f5fe768a5f8311527050', NULL, NULL, NULL, NULL),
(8, 'contractor', '', 'dc724af18fbdd4e59189f5fe768a5f8311527050', 2, 'Contractor', 0, 0, 50, NULL, '127.0.0.1', 1216678052, 'dc724af18fbdd4e59189f5fe768a5f8311527050', NULL, NULL, 1216656714, NULL),
(9, 'bourne', '', 'c374976c8651137b71243c5c53b175a88629c476', 1, 'Mitch Bourne', 0, 0, 200, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `catalogue`
--

DROP TABLE IF EXISTS `catalogue`;
CREATE TABLE `catalogue` (
  `cat_id` int(11) NOT NULL auto_increment,
  `name` varchar(100) character set utf8 NOT NULL,
  `source_lang` varchar(100) character set utf8 NOT NULL,
  `target_lang` varchar(100) character set utf8 NOT NULL,
  `date_created` int(11) NOT NULL default '0',
  `date_modified` int(11) NOT NULL default '0',
  `author` varchar(255) character set utf8 NOT NULL,
  PRIMARY KEY  (`cat_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Vypisuji data pro tabulku `catalogue`
--

INSERT INTO `catalogue` (`cat_id`, `name`, `source_lang`, `target_lang`, `date_created`, `date_modified`, `author`) VALUES
(1, 'messages', '', '', 0, 0, ''),
(2, 'messages.en', '', '', 0, 1216687671, ''),
(3, 'messages.cs', '', '', 0, 1216193915, '');

-- --------------------------------------------------------

--
-- Struktura tabulky `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `user_id` int(10) unsigned default NULL,
  `key` varchar(45) default NULL,
  `data` longtext,
  `created` int(10) unsigned default NULL,
  `updated` int(10) unsigned default NULL,
  `name` varchar(128) NOT NULL,
  `description` text,
  `read_level` tinyint(3) unsigned default NULL,
  `write_level` tinyint(3) unsigned default NULL,
  `parent_id` int(10) unsigned NOT NULL,
  `is_folder` tinyint(1) default NULL,
  `deleted` tinyint(1) default NULL,
  `ordering` int(11) default NULL,
  PRIMARY KEY  USING BTREE (`uid`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=140 ;

--
-- Vypisuji data pro tabulku `categories`
--

INSERT INTO `categories` (`uid`, `user_id`, `key`, `data`, `created`, `updated`, `name`, `description`, `read_level`, `write_level`, `parent_id`, `is_folder`, `deleted`, `ordering`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, 'Recycle Bin', NULL, 200, NULL, 0, 1, NULL, NULL),
(73, NULL, NULL, NULL, NULL, NULL, 'ACT', NULL, NULL, NULL, 0, 1, NULL, NULL),
(75, NULL, NULL, NULL, NULL, NULL, 'NSW', NULL, NULL, NULL, 0, 1, NULL, NULL),
(134, NULL, NULL, NULL, NULL, NULL, 'Erindale Shopping Center, Wanniassa', NULL, NULL, NULL, 73, 0, NULL, NULL),
(135, NULL, NULL, NULL, NULL, NULL, 'Dickson, Canberra', NULL, NULL, NULL, 73, 0, NULL, NULL),
(136, NULL, NULL, NULL, NULL, NULL, 'Erindale - Lots 30,31 & 32', NULL, NULL, NULL, 73, 0, NULL, NULL),
(137, NULL, NULL, NULL, NULL, NULL, 'Balo Square Shopping Centre, Balo', NULL, NULL, NULL, 75, 0, NULL, NULL),
(138, NULL, NULL, NULL, NULL, NULL, '__New folder', NULL, NULL, NULL, 1, 1, NULL, NULL),
(139, NULL, NULL, NULL, NULL, NULL, 'VIC', NULL, NULL, NULL, 0, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `cms_containers`
--

DROP TABLE IF EXISTS `cms_containers`;
CREATE TABLE `cms_containers` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `code` varchar(45) collate utf8_czech_ci default NULL,
  `description` tinytext collate utf8_czech_ci,
  `parent_id` int(10) unsigned default NULL,
  `type_id` varchar(64) collate utf8_czech_ci NOT NULL default 'NormalPage',
  `orderable` tinyint(3) unsigned default '0',
  `created` int(10) unsigned default NULL,
  `changed` int(10) unsigned default NULL,
  `ordering` int(10) unsigned default NULL,
  `name` varchar(255) collate utf8_czech_ci NOT NULL default '',
  `t` enum('content','container') collate utf8_czech_ci NOT NULL default 'container',
  `read_level` tinyint(3) unsigned default NULL,
  `write_level` tinyint(3) unsigned default NULL,
  `hidden` tinyint(1) unsigned default NULL,
  `hidden_parent` tinyint(1) unsigned default NULL,
  PRIMARY KEY  (`uid`),
  KEY `parent_id` (`parent_id`),
  KEY `index_2` (`type_id`,`t`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci ROW_FORMAT=DYNAMIC AUTO_INCREMENT=39 ;

--
-- Vypisuji data pro tabulku `cms_containers`
--

INSERT INTO `cms_containers` (`uid`, `code`, `description`, `parent_id`, `type_id`, `orderable`, `created`, `changed`, `ordering`, `name`, `t`, `read_level`, `write_level`, `hidden`, `hidden_parent`) VALUES
(1, NULL, NULL, 4, 'NormalPage', 0, NULL, NULL, 20, 'template 2', 'container', NULL, NULL, NULL, NULL),
(2, NULL, NULL, 0, 'MenuRoot', 0, NULL, NULL, 30, 'HORIZONTAL 1', 'container', NULL, NULL, NULL, NULL),
(3, NULL, NULL, 26, 'NormalPage', 0, NULL, NULL, 0, 'nÃ¡kup', 'container', NULL, NULL, NULL, NULL),
(4, NULL, NULL, 0, 'Templates', 0, NULL, NULL, 60, 'Templates', 'container', NULL, NULL, NULL, NULL),
(5, NULL, NULL, 0, 'MenuRoot', 0, NULL, NULL, 40, 'HORIZONTAL 2', 'container', NULL, NULL, NULL, NULL),
(22, NULL, NULL, 5, 'NormalPage', 0, NULL, NULL, 10, 'Popular', 'container', NULL, NULL, NULL, NULL),
(23, NULL, NULL, 4, '5', 0, NULL, NULL, NULL, 'template 1', 'container', NULL, NULL, NULL, NULL),
(24, NULL, NULL, 0, 'RecycleBin', 0, NULL, NULL, 70, 'Recycle Bin', 'container', NULL, NULL, NULL, NULL),
(25, NULL, NULL, 1, 'ContentColumn', 0, NULL, NULL, 10, 'column', 'container', NULL, NULL, NULL, NULL),
(26, NULL, NULL, 0, 'MenuRoot', 0, NULL, NULL, 20, 'TOPMOST', 'container', NULL, NULL, NULL, NULL),
(27, NULL, NULL, 5, 'NormalPage', 0, NULL, NULL, 20, 'Upcoming', 'container', NULL, NULL, NULL, NULL),
(28, NULL, NULL, 0, 'HomePage', 0, NULL, NULL, 10, 'home', 'container', NULL, NULL, NULL, NULL),
(29, NULL, NULL, 28, 'ContentColumn', 0, NULL, NULL, 10, 'side', 'container', NULL, NULL, NULL, NULL),
(30, NULL, NULL, 2, 'NormalPage', 0, NULL, NULL, 5, 'artists', 'container', NULL, NULL, NULL, NULL),
(31, NULL, NULL, 2, 'NormalPage', 0, NULL, NULL, NULL, 'tracks', 'container', NULL, NULL, NULL, NULL),
(32, NULL, NULL, 2, 'NormalPage', 0, NULL, NULL, 5, 'concerts', 'container', NULL, NULL, NULL, NULL),
(33, NULL, NULL, 2, 'NormalPage', 0, NULL, NULL, 5, 'labels', 'container', NULL, NULL, NULL, NULL),
(34, NULL, NULL, 26, 'NormalPage', 0, NULL, NULL, 0, 'faq', 'container', NULL, NULL, NULL, NULL),
(35, NULL, NULL, 26, 'NormalPage', 0, NULL, NULL, 10, 'obchodnÃ­ podmÃ­nky', 'container', NULL, NULL, NULL, NULL),
(36, NULL, NULL, 0, 'MenuRoot', 0, NULL, NULL, 50, 'GENGRES', 'container', NULL, NULL, NULL, NULL),
(37, NULL, NULL, 36, 'NormalPage', 0, NULL, NULL, 20, 'More', 'container', NULL, NULL, NULL, NULL),
(38, NULL, NULL, 36, 'NormalPage', 0, NULL, NULL, 10, 'Classical', 'container', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `cms_contents`
--

DROP TABLE IF EXISTS `cms_contents`;
CREATE TABLE `cms_contents` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `code` varchar(45) collate utf8_czech_ci default NULL,
  `data` blob,
  `type_id` varchar(64) collate utf8_czech_ci NOT NULL default 'text',
  `orderable` tinyint(3) unsigned zerofill default NULL,
  `created` int(10) unsigned default NULL,
  `changed` int(10) unsigned default NULL,
  `name` varchar(255) collate utf8_czech_ci NOT NULL default '',
  `parent_id` int(10) unsigned NOT NULL default '0',
  `ordering` int(10) unsigned default NULL,
  `t` enum('content') collate utf8_czech_ci NOT NULL default 'content',
  `read_level` tinyint(3) unsigned default NULL,
  `write_level` tinyint(3) unsigned default NULL,
  `hidden` tinyint(3) unsigned default NULL,
  PRIMARY KEY  (`uid`),
  KEY `FK_cms_contents_2` (`type_id`,`t`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci COMMENT='InnoDB free: 12288 kB;' AUTO_INCREMENT=14 ;

--
-- Vypisuji data pro tabulku `cms_contents`
--

INSERT INTO `cms_contents` (`uid`, `code`, `data`, `type_id`, `orderable`, `created`, `changed`, `name`, `parent_id`, `ordering`, `t`, `read_level`, `write_level`, `hidden`) VALUES
(2, NULL, NULL, 'boxedText', NULL, NULL, NULL, 'text', 3, 10, 'content', NULL, NULL, NULL),
(3, NULL, NULL, '1', NULL, NULL, NULL, 'other text', 24, 0, 'content', NULL, NULL, NULL),
(4, NULL, NULL, 'text', NULL, NULL, NULL, '__New content', 30, 0, 'content', NULL, NULL, NULL),
(5, NULL, NULL, 'text', NULL, NULL, NULL, 'text', 23, 20, 'content', NULL, NULL, NULL),
(6, NULL, NULL, 'image', NULL, NULL, NULL, 'picture', 23, 10, 'content', NULL, NULL, NULL),
(7, NULL, NULL, 'text', NULL, NULL, NULL, 'text', 1, 20, 'content', NULL, NULL, NULL),
(8, NULL, NULL, 'image', NULL, NULL, NULL, 'image', 1, 10, 'content', NULL, NULL, NULL),
(9, NULL, NULL, 'text', NULL, NULL, NULL, 'text', 25, 20, 'content', NULL, NULL, NULL),
(10, NULL, NULL, 'text', NULL, NULL, NULL, 'text2', 25, 10, 'content', NULL, NULL, NULL),
(11, NULL, 0x4c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747565722061646970697363696e6720656c69742e2041656e65616e20616c69717565742c206c6f72656d20657420706f72746120616363756d73616e2c206d6175726973206a7573746f20636f6e67756520616e74652c20696e206c6163696e696120697073756d20656c6974206163206c656f2e20467573636520697073756d2e20446f6e65632074726973746971756520636f6e76616c6c6973206c6f72656d2e204d616563656e61732076756c7075746174652074696e636964756e742066656c69732e20446f6e6563206c616f726565742c2065726f732075742072757472756d206d6f6c6c69732c206a7573746f2070656465207472697374697175652073617069656e2c2073697420616d657420636f6e736571756174206d6574757320647569206964207175616d2e20557420636f6e6775652e205072616573656e742061756775652e204e756c6c6120666163696c6973692e20416c697175616d20616c697175616d2074696e636964756e742066656c69732e2041656e65616e2074757270697320616e74652c206c756374757320612c206c6f626f7274697320626c616e6469742c2073656d7065722076656c2c2065726f732e204e616d207363656c6572697371756520657569736d6f64206c65637475732e20496e206d61676e612e20446f6e656320636f6e736571756174206e756e63207574206c6967756c6120656765737461732066617563696275732e0a3c62722f3e3c62722f3e0a566976616d75732061726375206f64696f2c20706f72747469746f7220612c20736f6c6c696369747564696e2061632c20636f6e73656374657475657220717569732c20656e696d2e2050656c6c656e74657371756520757420656c6974206575206c6f72656d2074656d706f7220706f7274612e2053656420717569732065726f732061206469616d207068617265747261206c6163696e69612e204e756c6c61207574206c6967756c612e20566573746962756c756d20616e746520697073756d207072696d697320696e206661756369627573206f726369206c756374757320657420756c74726963657320706f737565726520637562696c69612043757261653b20436c61737320617074656e742074616369746920736f63696f737175206164206c69746f726120746f727175656e742070657220636f6e75626961206e6f737472612c2070657220696e636570746f732068696d656e61656f732e20447569732061756775652e2053757370656e646973736520706f74656e74692e204d617572697320656c656d656e74756d2c2065726174206964206d617474697320636f6e76616c6c69732c206c616375732061726375207361676974746973206c616375732c20612072757472756d206d6920656e696d207574206c616375732e204d6f72626920616320656c69742e20446f6e65632061756775652e204d61757269732071756973206c656f20612066656c697320616c69717565742076656e656e617469732e2050656c6c656e746573717565206661756369627573206e756e63206d617474697320646f6c6f722e2041656e65616e2074696e636964756e742c20616e7465207669746165207665686963756c61206672696e67696c6c612c2066656c6973206172637520756c6c616d636f72706572206d617373612c2073697420616d657420616c6971756574206e756e63206d617373612076656c2061756775652e204d617572697320696420657261742e2043726173206174206572617420717569732073656d2076656e656e617469732070756c76696e61722e, 'boxedText', NULL, NULL, 1215125431, 'boxed text example', 28, 5, 'content', NULL, NULL, NULL),
(12, NULL, 0x3c696d67207374796c653d2277696474683a2032303070783b206865696768743a2031353070783b2220616c743d224672616e676970616e6920466c6f776572732e6a706722207372633d22696d616765732f4672616e676970616e69253230466c6f776572732e6a7067223e3c62723e, 'boxedText', NULL, NULL, 1215125431, 'picture in boxed text type', 28, 10, 'content', NULL, NULL, NULL),
(13, NULL, 0x416b7475616c6974793c62723e, 'Heading1', NULL, NULL, 1215441573, 'Aktuality', 24, 0, 'content', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabulky `cms_languages`
--

DROP TABLE IF EXISTS `cms_languages`;
CREATE TABLE `cms_languages` (
  `lang` varchar(5) NOT NULL default '',
  `name` varchar(128) NOT NULL default '',
  `uid` int(10) unsigned NOT NULL auto_increment,
  PRIMARY KEY  (`uid`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `lang` (`lang`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Vypisuji data pro tabulku `cms_languages`
--

INSERT INTO `cms_languages` (`lang`, `name`, `uid`) VALUES
('cs', 'ÄŒeÅ¡tina', 1),
('de', 'Deutch', 2),
('en', 'English', 3);

-- --------------------------------------------------------

--
-- Struktura tabulky `cms_news`
--

DROP TABLE IF EXISTS `cms_news`;
CREATE TABLE `cms_news` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL default '',
  `text` text,
  `fromDate` int(10) unsigned default NULL,
  `toDate` int(10) unsigned default NULL,
  `published` int(10) unsigned default NULL,
  `category` varchar(50) default NULL,
  `created` int(10) unsigned default NULL,
  `lang` varchar(5) NOT NULL,
  `images` longtext NOT NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='InnoDB free: 10240 kB' AUTO_INCREMENT=2 ;

--
-- Vypisuji data pro tabulku `cms_news`
--

INSERT INTO `cms_news` (`uid`, `name`, `text`, `fromDate`, `toDate`, `published`, `category`, `created`, `lang`, `images`) VALUES
(1, 'testovacÃ­ novÃ­nka', '&nbsp;test lorem ipsum <br>', 1215381600, 1215986400, NULL, '', NULL, 'cs', '');

-- --------------------------------------------------------

--
-- Struktura tabulky `cms_news_categories`
--

DROP TABLE IF EXISTS `cms_news_categories`;
CREATE TABLE `cms_news_categories` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `name` text,
  PRIMARY KEY  (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- Vypisuji data pro tabulku `cms_news_categories`
--

INSERT INTO `cms_news_categories` (`uid`, `name`) VALUES
(15, 'a:2:{s:2:"Cs";s:9:"pro Å¾eny";s:2:"De";s:8:"fur frau";}'),
(16, 'a:2:{s:2:"Cs";s:7:"obecnÃ¡";s:2:"De";s:7:"general";}');

-- --------------------------------------------------------

--
-- Struktura tabulky `news_images`
--

DROP TABLE IF EXISTS `news_images`;
CREATE TABLE `news_images` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `news_uid` int(10) unsigned NOT NULL default '0',
  `objects_uid` varchar(128) NOT NULL default '',
  `text` text,
  `order` int(10) unsigned default NULL,
  PRIMARY KEY  (`uid`),
  KEY `news_uid` (`news_uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Vypisuji data pro tabulku `news_images`
--


-- --------------------------------------------------------

--
-- Struktura tabulky `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `type` int(11) NOT NULL default '1',
  `quantity` float NOT NULL default '0',
  `model` varchar(32) default NULL,
  `image` varchar(64) default NULL,
  `price` decimal(15,4) NOT NULL default '0.0000',
  `virtual` tinyint(1) NOT NULL default '0',
  `created` int(10) unsigned default NULL,
  `changed` int(10) unsigned default NULL,
  `available` int(10) unsigned default NULL,
  `weight` float NOT NULL default '0',
  `status` tinyint(1) NOT NULL default '0',
  `tax_class_id` int(11) NOT NULL default '0',
  `manufacturers_id` int(11) default NULL,
  `ordered` float NOT NULL default '0',
  `quantity_order_min` float NOT NULL default '1',
  `quantity_order_units` float NOT NULL default '1',
  `priced_by_attribute` tinyint(1) NOT NULL default '0',
  `product_is_free` tinyint(1) NOT NULL default '0',
  `product_is_call` tinyint(1) NOT NULL default '0',
  `quantity_mixed` tinyint(1) NOT NULL default '0',
  `product_is_always_free_shipping` tinyint(1) NOT NULL default '0',
  `qty_box_status` tinyint(1) NOT NULL default '1',
  `quantity_order_max` float NOT NULL default '0',
  `sort_order` int(11) NOT NULL default '0',
  `discount_type` tinyint(1) NOT NULL default '0',
  `discount_type_from` tinyint(1) NOT NULL default '0',
  `price_sorter` decimal(15,4) NOT NULL default '0.0000',
  `master_categories_id` int(11) NOT NULL default '0',
  `mixed_discount_quantity` tinyint(1) NOT NULL default '1',
  `metatags_title_status` tinyint(1) NOT NULL default '0',
  `metatags_name_status` tinyint(1) NOT NULL default '0',
  `metatags_model_status` tinyint(1) NOT NULL default '0',
  `metatags_price_status` tinyint(1) NOT NULL default '0',
  `metatags_title_tagline_status` tinyint(1) NOT NULL default '0',
  `name` text,
  `images` longblob,
  `description` longblob,
  PRIMARY KEY  (`uid`),
  UNIQUE KEY `Index_11` USING BTREE (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC AUTO_INCREMENT=4 ;

--
-- Vypisuji data pro tabulku `products`
--

INSERT INTO `products` (`uid`, `type`, `quantity`, `model`, `image`, `price`, `virtual`, `created`, `changed`, `available`, `weight`, `status`, `tax_class_id`, `manufacturers_id`, `ordered`, `quantity_order_min`, `quantity_order_units`, `priced_by_attribute`, `product_is_free`, `product_is_call`, `quantity_mixed`, `product_is_always_free_shipping`, `qty_box_status`, `quantity_order_max`, `sort_order`, `discount_type`, `discount_type_from`, `price_sorter`, `master_categories_id`, `mixed_discount_quantity`, `metatags_title_status`, `metatags_name_status`, `metatags_model_status`, `metatags_price_status`, `metatags_title_tagline_status`, `name`, `images`, `description`) VALUES
(1, 1, 0, 'aaass', NULL, 0.0000, 0, NULL, NULL, 1, 0, 0, 0, NULL, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0.0000, 0, 1, 0, 0, 0, 0, 0, '', 0x5b5d, ''),
(2, 1, 0, 'bbb1f', NULL, 0.0000, 0, NULL, NULL, 0, 0, 0, 0, NULL, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0.0000, 0, 1, 0, 0, 0, 0, 0, '', 0x5b7b22756964223a22696d616765732f417574756d6e204c65617665732e6a7067222c226e6577735f756964223a22222c226f626a656374735f756964223a22222c226f626a656374735f75696441735468756d6231303078313030223a22222c2274657874223a22417574756d6e204c65617665732e6a7067227d5d, ''),
(3, 1, 10, 'tes neew prodauct ', NULL, 3400.0000, 0, NULL, NULL, 1216159200, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0000, 0, 0, 0, 0, 0, 0, 0, NULL, 0x5b7b2274657874223a22417574756d6e204c65617665732e6a7067222c22756964223a22696d616765732f417574756d6e204c65617665732e6a7067227d2c7b2274657874223a224672616e676970616e6920466c6f776572732e6a7067222c22756964223a22696d616765732f4672616e676970616e6920466c6f776572732e6a7067227d5d, '');

-- --------------------------------------------------------

--
-- Struktura tabulky `products_categories`
--

DROP TABLE IF EXISTS `products_categories`;
CREATE TABLE `products_categories` (
  `product_id` int(10) unsigned NOT NULL default '0',
  `category_id` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`product_id`,`category_id`),
  UNIQUE KEY `idx_category_product` USING BTREE (`category_id`,`product_id`),
  UNIQUE KEY `idx_product_category` USING BTREE (`product_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `products_categories`
--

INSERT INTO `products_categories` (`product_id`, `category_id`) VALUES
(1, 2),
(1, 73),
(2, 2),
(2, 73),
(2, 75),
(3, 60);

-- --------------------------------------------------------

--
-- Struktura tabulky `properties`
--

DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
  `Uid` int(10) unsigned NOT NULL auto_increment,
  `PropertyId` varchar(16) collate utf8_czech_ci NOT NULL,
  `Name` varchar(128) collate utf8_czech_ci NOT NULL,
  `Suburb` varchar(64) collate utf8_czech_ci NOT NULL,
  `State` varchar(45) collate utf8_czech_ci NOT NULL,
  PRIMARY KEY  (`Uid`),
  UNIQUE KEY `PropertyId` (`PropertyId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=91 ;

--
-- Vypisuji data pro tabulku `properties`
--

INSERT INTO `properties` (`Uid`, `PropertyId`, `Name`, `Suburb`, `State`) VALUES
(1, 'MCW0101', 'Erindale Shopping Centre', 'Wanniassa', 'ACT'),
(2, 'MCW0102', 'Dickson', 'Canberra', 'ACT'),
(3, 'MCW0103', 'Erindale- Lots 30, 31 & 32 ', 'Wanniassa', 'ACT'),
(4, 'MCW0201', 'Balo Square Shopping Centre', 'Moree', 'NSW'),
(5, 'MCW0202', 'Bathurst Central', 'Bathurst', 'NSW'),
(6, 'MCW0203', 'Cardiff', 'Cardiff', 'NSW'),
(7, 'MCW0204', 'Caringbah', 'Caringbah', 'NSW'),
(8, 'MCW0205', 'Cooma', 'Cooma', 'NSW'),
(9, 'MCW0208', 'Earlwood', 'Earlwood', 'NSW'),
(10, 'MCW0209', 'Goonellabah Village', 'Lismore', 'NSW'),
(11, 'MCW0210', 'Gowrie Street Mall', 'Singleton', 'NSW'),
(12, 'MCW0213', 'Kings Langley Shopping Centre', 'Kings Langley', 'NSW'),
(13, 'MCW0214', 'Mackenzie Mall - Glen Innes', 'Glen Innes', 'NSW'),
(14, 'MCW0215', 'Morisset - Bi Lo', 'Morisset', 'NSW'),
(15, 'MCW0216', 'Mudgee', 'Mudgee', 'NSW'),
(16, 'MCW0217', 'Narrabri', 'Narrabri', 'NSW'),
(17, 'MCW0218', 'Orange Metro Plaza', 'Orange', 'NSW'),
(18, 'MCW0219', 'Parkes', 'Parkes', 'NSW'),
(19, 'MCW0220', 'Sunnyside Shopping Centre', 'Murwillumbah', 'NSW'),
(20, 'MCW0221', 'Tumut', 'Tumut', 'NSW'),
(21, 'MCW0222', 'Wellington', 'Wellington', 'NSW'),
(22, 'MCW0223', 'Young', 'Young', 'NSW'),
(23, 'MCW0224', 'Jerrabomberra Village', 'Jerrabomberra', 'NSW'),
(24, 'MCW0225', 'Rosehill', 'Rosehill', 'NSW'),
(25, 'MCW0226', 'Cootamundra', 'Cootamundra', 'NSW'),
(26, 'MCW0227', 'Camden', 'Camden', 'NSW'),
(27, 'MCW0229', 'Narromine', 'Narromine', 'NSW'),
(28, 'MCW0230', 'Morisset Square', 'Morisset', 'NSW'),
(29, 'MCW0231', 'Morisset Shopping Centre', 'Morisset', 'NSW'),
(30, 'MCW0232', 'Singleton Plaza', 'Singleton', 'NSW'),
(31, 'MCW0301', 'Bairnsdale', 'Bairnsdale', 'VIC'),
(32, 'MCW0303', 'Horsham', 'Horsham', 'VIC'),
(33, 'MCW0304', 'Kerang', 'Kerang', 'VIC'),
(34, 'MCW0305', 'Kyneton', 'Kyneton', 'VIC'),
(35, 'MCW0306', 'Moe - Coles', 'Moe', 'VIC'),
(36, 'MCW0307', 'Moe - Kmart', 'Moe', 'VIC'),
(37, 'MCW0308', 'Monbulk', 'Monbulk', 'VIC'),
(38, 'MCW0310', 'Olive Tree Shopping Centre', 'Lilydale', 'VIC'),
(39, 'MCW0311', 'South Preston', 'South Preston', 'VIC'),
(40, 'MCW0501', 'Wharflands Plaza', 'Port Augusta', 'SA'),
(41, 'MCW0502', 'Oaklands', 'Warradale', 'SA'),
(42, 'MCW0503', 'Plympton', 'Plympton', 'SA'),
(43, 'MCW0504', 'Seaford Shopping Centre', 'Seaford Rise', 'SA'),
(44, 'MCW0505', 'Renmark Plaza', 'Renmark', 'SA'),
(45, 'MCW0401', 'Allenstown Plaza', 'Rockhampton', 'QLD'),
(46, 'MCW0402', 'Ascot Plaza', 'Ascot', 'QLD'),
(47, 'MCW0403', 'Bribie Island Shopping Centre', 'Bribie Island', 'QLD'),
(48, 'MCW0404', 'Coorparoo', 'Coorparoo', 'QLD'),
(49, 'MCW0405', 'Currimundi Marketplace', 'Currimundi', 'QLD'),
(50, 'MCW0406', 'Gatton Plaza', 'Gatton', 'QLD'),
(51, 'MCW0407', 'Hervey Bay Plaza', 'Hervey Bay', 'QLD'),
(52, 'MCW0408', 'Kallangur Fair', 'Kallangur', 'QLD'),
(53, 'MCW0409', 'Mackay', 'Mackay', 'QLD'),
(54, 'MCW0410', 'Mooloolaba Central', 'Mooloolaba', 'QLD'),
(55, 'MCW0411', 'Moranbah Fair', 'Moranbah', 'QLD'),
(56, 'MCW0412', 'Nambour Central', 'Nambour', 'QLD'),
(57, 'MCW0413', 'Nambour Plaza', 'Nambour', 'QLD'),
(58, 'MCW0414', 'Redcliffe', 'Redcliffe', 'QLD'),
(59, 'MCW0416', 'Springfield Fair', 'Springfield', 'QLD'),
(60, 'MCW0417', 'Tablelands Village Shopping Centre', 'Atherton', 'QLD'),
(61, 'MCW0419', 'Logan Central', 'Logan Central', 'QLD'),
(62, 'MCW0420', 'Caboolture Park Shopping Centre', 'Caboolture', 'QLD'),
(63, 'MCW0421', 'Gatton Target', 'Gatton', 'QLD'),
(64, 'MCW0422', 'Mareeba Plaza', 'Mareeba', 'QLD'),
(65, 'MCW0423', 'Sydney Street Markets Mackay', 'Mackay', 'QLD'),
(66, 'MCW0601', 'Albany Plaza', 'Albany', 'WA'),
(67, 'MCW0602', 'Carnarvon Boulevard Shopping Centre', 'Carnarvon', 'WA'),
(68, 'MCW0603', 'Collie Central', 'Collie', 'WA'),
(69, 'MCW0604', 'Esperance Boulevard Shopping Centre', 'Esperance', 'WA'),
(70, 'MCW0605', 'Kalgoorlie Plaza Shopping Centre', 'Kalgoorlie', 'WA'),
(71, 'MCW0606', 'Maylands', 'Maylands', 'WA'),
(72, 'MCW0607', 'Margaret River', 'Margaret River', 'WA'),
(73, 'MCW0608', 'Narrogin', 'Narrogin', 'WA'),
(74, 'MCW0609', 'Swan View Shopping Centre', 'Swan View', 'WA'),
(75, 'MCW0611', 'Carnarvon Boulevard Sinking Fu', 'Carnarvon', 'WA'),
(76, 'MCW0612', 'Collie Central Sinking Fund', 'Collie', 'WA'),
(77, 'MCW0613', 'Esperance Boulevard Sinking Fu', 'Esperance', 'WA'),
(78, 'MCW0614', 'Kalgoorlie Plaza Sinking Fund', 'Kalgoorlie', 'WA'),
(79, 'MCW0615', 'Glenview Marketplace', 'Ballajura', 'WA'),
(80, 'MCW0616', 'South Hedland Shopping Centre', 'South Hedland', 'WA'),
(81, 'MCW0617', 'South Hedland Sinking Fund', 'South Hedland', 'WA'),
(82, 'MCW0618', 'Albany Plaza Ps', 'Albany', 'WA'),
(83, 'MCW0619', 'Manjimup Shopping Centre ', 'Manjimup', 'WA'),
(84, 'MCW0702', 'Georgetown', 'George Town', 'TAS'),
(85, 'MCW0703', 'Launceston', 'Launceston', 'TAS'),
(86, 'MCW0705', 'Newstead', 'Newstead', 'TAS'),
(87, 'MCW0706', 'Riverside Shopping Centre', 'Riverside', 'TAS'),
(88, 'MCW0707', 'Sandy Bay', 'Sandy Bay', 'TAS'),
(89, 'MCW0708', 'Smithton', 'Smithton', 'TAS'),
(90, 'MCW0709', 'Wynyard -Woolworths', 'Wynyard', 'TAS');

-- --------------------------------------------------------

--
-- Struktura tabulky `trans_unit`
--

DROP TABLE IF EXISTS `trans_unit`;
CREATE TABLE `trans_unit` (
  `msg_id` int(11) NOT NULL auto_increment,
  `cat_id` int(11) NOT NULL default '1',
  `id` varchar(255) NOT NULL,
  `source` text NOT NULL,
  `target` text NOT NULL,
  `comments` text NOT NULL,
  `date_added` int(11) NOT NULL default '0',
  `date_modified` int(11) NOT NULL default '0',
  `author` varchar(255) NOT NULL,
  `translated` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`msg_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=181 ;

--
-- Vypisuji data pro tabulku `trans_unit`
--

INSERT INTO `trans_unit` (`msg_id`, `cat_id`, `id`, `source`, `target`, `comments`, `date_added`, `date_modified`, `author`, `translated`) VALUES
(1, 1, '1', 'xxxx', 'Struktura', '', 0, 0, '', 1),
(2, 2, '', 'Hello', 'Hello :)', '', 0, 0, '', 0),
(3, 1, '1', 'Welcome', 'Welcome', '', 0, 0, '', 0),
(4, 3, '', 'Hello', 'G''day Mate!', '', 0, 0, '', 0),
(5, 3, '', 'Welcome', 'Welcome Mate!', '', 0, 0, '', 0),
(101, 3, '98', 'Structure management', 'Struktura', '', 1216193915, 0, '', 1),
(6, 3, '3', 'Pages and Content', '', '', 1215438403, 0, '', 0),
(7, 3, '4', 'New folder', 'NovÃ¡ sloÅ¾ka', '', 1215438403, 0, '', 1),
(8, 3, '5', 'News Management', '', '', 1215438403, 0, '', 0),
(9, 3, '6', 'New News', '', '', 1215438403, 0, '', 0),
(10, 3, '7', 'News List', '', '', 1215438403, 0, '', 0),
(11, 3, '8', 'Count {2}', '', '', 1215438403, 0, '', 0),
(12, 3, '9', 'No news to display', '', '', 1215438403, 0, '', 0),
(13, 3, '10', 'Edit News', '', '', 1215438403, 0, '', 0),
(14, 3, '11', 'Loading news {name}', '', '', 1215438403, 0, '', 0),
(15, 3, '12', 'Data', '', '', 1215438403, 0, '', 0),
(16, 3, '13', 'News Name', '', '', 1215438403, 0, '', 0),
(17, 3, '14', 'From', '', '', 1215438403, 0, '', 0),
(18, 3, '15', 'To', '', '', 1215438403, 0, '', 0),
(19, 3, '16', 'Language', '', '', 1215438403, 0, '', 0),
(20, 3, '17', 'Category', '', '', 1215438403, 0, '', 0),
(21, 3, '18', 'News Text', '', '', 1215438403, 0, '', 0),
(22, 3, '19', 'News Categories', '', '', 1215438403, 0, '', 0),
(23, 3, '20', 'Languages', '', '', 1215438403, 0, '', 0),
(24, 3, '21', 'Attributes Definitions', '', '', 1215438403, 0, '', 0),
(25, 3, '22', 'Attribute Types', '', '', 1215438403, 0, '', 0),
(26, 3, '23', 'Translations', 'PÅ™eklady', '', 1215438403, 0, '', 1),
(27, 3, '24', 'Czech', '', '', 1215438403, 0, '', 0),
(28, 3, '25', 'German', '', '', 1215438403, 0, '', 0),
(29, 3, '26', 'User management', 'UÅ¾ivatelÃ©', '', 1215438403, 0, '', 1),
(30, 3, '27', 'New user', '', '', 1215438403, 0, '', 0),
(31, 3, '28', 'Edit user', '', '', 1215438403, 0, '', 0),
(32, 3, '29', 'Remove user', '', '', 1215438403, 0, '', 0),
(33, 3, '30', 'Users', '', '', 1215438403, 0, '', 0),
(34, 3, '31', 'Loading user', '', '', 1215438403, 0, '', 0),
(35, 3, '32', 'New User', 'NovÃ½ uÅ¾ivatel', '', 1215438403, 0, '', 1),
(36, 3, '33', 'User Properties', '', '', 1215438403, 0, '', 0),
(37, 3, '34', 'Username', '', '', 1215438403, 0, '', 0),
(38, 3, '35', 'Role', '', '', 1215438403, 0, '', 0),
(39, 3, '36', 'Name', '', '', 1215438403, 0, '', 0),
(40, 3, '37', 'Password', '', '', 1215438403, 0, '', 0),
(41, 3, '38', 'Password must be set!', '', '', 1215438403, 0, '', 0),
(42, 3, '39', 'Password must be at least 6 characters long!', '', '', 1215438403, 0, '', 0),
(43, 3, '40', 'Password again', '', '', 1215438403, 0, '', 0),
(44, 3, '41', 'You must fill in both password fields with the same password.', '', '', 1215438403, 0, '', 0),
(45, 3, '42', 'Email', '', '', 1215438403, 0, '', 0),
(46, 3, '43', 'Comments saved ok.', '', '', 1215438409, 0, '', 0),
(47, 3, '44', 'Cannot enter row with duplicate value', '', '', 1215438409, 0, '', 0),
(48, 3, '45', 'Selected rows deleted ok!', '', '', 1215438409, 0, '', 0),
(49, 3, '46', 'Cannot delete row', '', '', 1215438409, 0, '', 0),
(50, 3, '47', 'Publ', '', '', 1215438409, 0, '', 0),
(51, 3, '48', 'Categories saved ok.', '', '', 1215438410, 0, '', 0),
(52, 3, '49', 'Cannot enter row with duplicate value %1$s.', '', '', 1215438410, 0, '', 0),
(53, 3, '50', 'Cannot delete row while any news in this category exist.', '', '', 1215438410, 0, '', 0),
(54, 3, '51', 'Category CZ', '', '', 1215438410, 0, '', 0),
(55, 3, '52', 'Category DE', '', '', 1215438410, 0, '', 0),
(56, 3, '53', 'Languages saved ok.', '', '', 1215438411, 0, '', 0),
(57, 3, '54', 'Cannot delete language.', '', '', 1215438411, 0, '', 0),
(58, 3, '55', 'Language Code', '', '', 1215438411, 0, '', 0),
(59, 3, '56', 'Language Name', '', '', 1215438411, 0, '', 0),
(60, 3, '57', 'News saved ok.', '', '', 1215438441, 0, '', 0),
(61, 3, '58', 'VÃ­ce', '', '', 1215440213, 0, '', 0),
(62, 3, '59', 'Recycle bin', 'KoÅ¡', '', 1215440389, 0, '', 1),
(63, 3, '60', 'Typ', '', '', 1215440389, 0, '', 0),
(64, 3, '61', 'Description', '', '', 1215440389, 0, '', 0),
(65, 3, '62', 'Attributes saved ok.', '', '', 1215441713, 0, '', 0),
(66, 3, '63', 'Cannot delete row while any news in this attribute exist.', '', '', 1215441713, 0, '', 0),
(67, 3, '64', 'Attribute CZ', '', '', 1215441713, 0, '', 0),
(68, 3, '65', 'Attribute DE', '', '', 1215441713, 0, '', 0),
(69, 3, '66', 'Type', '', '', 1215441713, 0, '', 0),
(70, 3, '67', 'Primary', '', '', 1215441713, 0, '', 0),
(71, 3, '68', 'Attribute Types saved ok.', '', '', 1215441713, 0, '', 0),
(72, 3, '69', 'Attribute Type CZ', '', '', 1215441713, 0, '', 0),
(73, 3, '70', 'Attribute Type TDE', '', '', 1215441713, 0, '', 0),
(74, 3, '71', 'Editor', '', '', 1215441713, 0, '', 0),
(75, 3, '72', 'Renderer', '', '', 1215441713, 0, '', 0),
(76, 3, '73', 'Translate', '', '', 1215441713, 0, '', 0),
(77, 3, '74', 'Attribute Type DE', '', '', 1215443019, 0, '', 0),
(78, 3, '75', 'Translations saved ok.', 'PÅ™eklady byly uloÅ¾eny OK.', '', 1215554281, 0, '', 1),
(79, 3, '76', 'Selected translations deleted ok!', '', '', 1215554281, 0, '', 0),
(80, 3, '77', 'Cannot delete row.', '', '', 1215554281, 0, '', 0),
(81, 3, '78', 'Source key', 'Zdroj', '', 1215554281, 0, '', 1),
(82, 3, '79', 'Translation', 'PÅ™eklad', '', 1215554281, 0, '', 1),
(83, 3, '80', 'Translated', '', '', 1215554281, 0, '', 0),
(84, 3, '81', 'Categories', '', '', 1215554953, 0, '', 0),
(85, 3, '82', 'Search', '', '', 1215554953, 0, '', 0),
(86, 3, '83', 'List of products', '', '', 1215554953, 0, '', 0),
(87, 3, '84', 'Product', '', '', 1215554953, 0, '', 0),
(88, 3, '85', 'Product Images', '', '', 1215554953, 0, '', 0),
(89, 3, '86', 'Delete image', '', '', 1215554953, 0, '', 0),
(90, 3, '87', 'Products management', 'Produkty', '', 1215577213, 0, '', 1),
(91, 3, '88', 'New product', 'NovÃ½ produkt', '', 1215577213, 0, '', 1),
(92, 3, '89', 'Images saved ok.', '', '', 1216058620, 0, '', 0),
(93, 3, '90', 'Product saved ok.', '', '', 1216060349, 0, '', 0),
(94, 3, '91', 'New category', 'NovÃ¡ kategorie', '', 1216073110, 0, '', 1),
(95, 3, '92', 'Basic Data', 'ZÃ¡kladnÃ­ Ãºdaje', '', 1216073143, 0, '', 1),
(96, 3, '93', 'Images', '', '', 1216073143, 0, '', 0),
(97, 3, '94', 'Available from', '', '', 1216160316, 0, '', 0),
(98, 3, '95', 'Quantity', '', '', 1216160316, 0, '', 0),
(99, 3, '96', 'Price', '', '', 1216160316, 0, '', 0),
(100, 3, '97', 'Tax', '', '', 1216160316, 0, '', 0),
(102, 2, '2', 'Products management', '', '', 1216525218, 0, '', 0),
(103, 2, '3', 'New product', '', '', 1216525218, 0, '', 0),
(104, 2, '4', 'Categories', '', '', 1216525218, 0, '', 0),
(105, 2, '5', 'Search', '', '', 1216525218, 0, '', 0),
(106, 2, '6', 'Name', '', '', 1216525218, 0, '', 0),
(107, 2, '7', 'Description', '', '', 1216525218, 0, '', 0),
(108, 2, '8', 'List of products', '', '', 1216525218, 0, '', 0),
(109, 2, '9', 'Product', '', '', 1216525218, 0, '', 0),
(110, 2, '10', 'Basic Data', '', '', 1216525218, 0, '', 0),
(111, 2, '11', 'News Name', '', '', 1216525218, 0, '', 0),
(112, 2, '12', 'Available from', '', '', 1216525218, 0, '', 0),
(113, 2, '13', 'Quantity', '', '', 1216525218, 0, '', 0),
(114, 2, '14', 'Price', '', '', 1216525218, 0, '', 0),
(115, 2, '15', 'Tax', '', '', 1216525218, 0, '', 0),
(116, 2, '16', 'Images', '', '', 1216525218, 0, '', 0),
(117, 2, '17', 'Product Images', '', '', 1216525218, 0, '', 0),
(118, 2, '18', 'Delete image', '', '', 1216525218, 0, '', 0),
(119, 2, '19', 'News Categories', '', '', 1216525218, 0, '', 0),
(120, 2, '20', 'Languages', '', '', 1216525218, 0, '', 0),
(121, 2, '21', 'Attributes Definitions', '', '', 1216525218, 0, '', 0),
(122, 2, '22', 'Attribute Types', '', '', 1216525218, 0, '', 0),
(123, 2, '23', 'User management', '', '', 1216525218, 0, '', 0),
(124, 2, '24', 'New user', '', '', 1216525218, 0, '', 0),
(125, 2, '25', 'Edit user', '', '', 1216525218, 0, '', 0),
(126, 2, '26', 'Remove user', '', '', 1216525218, 0, '', 0),
(127, 2, '27', 'Users', '', '', 1216525218, 0, '', 0),
(128, 2, '28', 'Loading user', '', '', 1216525218, 0, '', 0),
(129, 2, '29', 'New User', '', '', 1216525218, 0, '', 0),
(130, 2, '30', 'User Properties', '', '', 1216525218, 0, '', 0),
(131, 2, '31', 'Username', '', '', 1216525218, 0, '', 0),
(132, 2, '32', 'Role', '', '', 1216525218, 0, '', 0),
(133, 2, '33', 'Password', '', '', 1216525218, 0, '', 0),
(134, 2, '34', 'Password must be set!', '', '', 1216525218, 0, '', 0),
(135, 2, '35', 'Password must be at least 6 characters long!', '', '', 1216525218, 0, '', 0),
(136, 2, '36', 'Password again', '', '', 1216525218, 0, '', 0),
(137, 2, '37', 'You must fill in both password fields with the same password.', '', '', 1216525218, 0, '', 0),
(138, 2, '38', 'Email', '', '', 1216525218, 0, '', 0),
(139, 2, '39', 'Languages saved ok.', '', '', 1216525226, 0, '', 0),
(140, 2, '40', 'Cannot enter row with duplicate value %1$s.', '', '', 1216525226, 0, '', 0),
(141, 2, '41', 'Selected rows deleted ok!', '', '', 1216525226, 0, '', 0),
(142, 2, '42', 'Cannot delete language.', '', '', 1216525226, 0, '', 0),
(143, 2, '43', 'Language Code', '', '', 1216525226, 0, '', 0),
(144, 2, '44', 'Language Name', '', '', 1216525226, 0, '', 0),
(145, 2, '45', 'Categories saved ok.', '', '', 1216525227, 0, '', 0),
(146, 2, '46', 'Cannot delete row while any news in this category exist.', '', '', 1216525227, 0, '', 0),
(147, 2, '47', 'Category CZ', '', '', 1216525227, 0, '', 0),
(148, 2, '48', 'Category DE', '', '', 1216525227, 0, '', 0),
(149, 2, '49', 'Attribute Types saved ok.', '', '', 1216525227, 0, '', 0),
(150, 2, '50', 'Attribute Type CZ', '', '', 1216525227, 0, '', 0),
(151, 2, '51', 'Attribute Type DE', '', '', 1216525227, 0, '', 0),
(152, 2, '52', 'Editor', '', '', 1216525227, 0, '', 0),
(153, 2, '53', 'Renderer', '', '', 1216525227, 0, '', 0),
(154, 2, '54', 'Translate', '', '', 1216525227, 0, '', 0),
(155, 2, '55', 'Attributes saved ok.', '', '', 1216525227, 0, '', 0),
(156, 2, '56', 'Cannot delete row while any news in this attribute exist.', '', '', 1216525227, 0, '', 0),
(157, 2, '57', 'Attribute CZ', '', '', 1216525227, 0, '', 0),
(158, 2, '58', 'Attribute DE', '', '', 1216525227, 0, '', 0),
(159, 2, '59', 'Type', '', '', 1216525227, 0, '', 0),
(160, 2, '60', 'Primary', '', '', 1216525227, 0, '', 0),
(161, 2, '61', 'Comments saved ok.', '', '', 1216529182, 0, '', 0),
(162, 2, '62', 'Cannot enter row with duplicate value', '', '', 1216529182, 0, '', 0),
(163, 2, '63', 'Cannot delete row', '', '', 1216529182, 0, '', 0),
(164, 2, '64', 'Operational', '', '', 1216529182, 0, '', 0),
(165, 2, '65', 'Images saved ok.', '', '', 1216662249, 0, '', 0),
(166, 2, '66', 'Product saved ok.', '', '', 1216662267, 0, '', 0),
(167, 2, '67', 'Vendor Types', '', '', 1216672138, 0, '', 0),
(168, 2, '68', 'Properties', '', '', 1216672138, 0, '', 0),
(169, 2, '69', 'Property#', '', '', 1216672145, 0, '', 0),
(170, 2, '70', 'Suburb', '', '', 1216672145, 0, '', 0),
(171, 2, '71', 'State', '', '', 1216672145, 0, '', 0),
(172, 2, '72', 'Company Name', '', '', 1216680757, 0, '', 0),
(173, 2, '73', 'Vendors management', '', '', 1216681412, 0, '', 0),
(174, 2, '74', 'List of vendors', '', '', 1216686502, 0, '', 0),
(175, 2, '75', 'Vendor', '', '', 1216686502, 0, '', 0),
(176, 2, '76', 'Contacts', '', '', 1216686502, 0, '', 0),
(177, 2, '77', 'New vendor', '', '', 1216686638, 0, '', 0),
(178, 2, '78', 'Vendor saved ok.', '', '', 1216686648, 0, '', 0),
(179, 2, '79', 'Properties saved ok.', '', '', 1216687671, 0, '', 0),
(180, 2, '80', 'Property', '', '', 1216687671, 0, '', 0);

-- --------------------------------------------------------

--
-- Struktura tabulky `vendors`
--

DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
  `Uid` int(10) unsigned NOT NULL auto_increment,
  `CompanyName` varchar(128) collate utf8_czech_ci NOT NULL,
  `CompanySoleTrader` varchar(128) collate utf8_czech_ci NOT NULL,
  `CompanyTradeName` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactStreetName` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactSuburb` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactState` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactPostCode` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactEmail` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactTelephone` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactFax` varchar(128) collate utf8_czech_ci NOT NULL,
  `ContactMobile` varchar(128) collate utf8_czech_ci NOT NULL,
  `PostalStreetName` varchar(128) collate utf8_czech_ci NOT NULL,
  `PostalSuburb` varchar(128) collate utf8_czech_ci NOT NULL,
  `PostalState` varchar(128) collate utf8_czech_ci NOT NULL,
  `PostalPostCode` varchar(128) collate utf8_czech_ci NOT NULL,
  `PaymentContactName` varchar(128) collate utf8_czech_ci NOT NULL,
  `PaymentAddress` varchar(128) collate utf8_czech_ci NOT NULL,
  `PaymentEmail` varchar(128) collate utf8_czech_ci NOT NULL,
  `PaymentTelephone` varchar(128) collate utf8_czech_ci NOT NULL,
  `PaymentFax` varchar(128) collate utf8_czech_ci NOT NULL,
  `PaymentMobile` varchar(128) collate utf8_czech_ci NOT NULL,
  `OrdersContactName` varchar(128) collate utf8_czech_ci NOT NULL,
  `OrdersAddress` varchar(128) collate utf8_czech_ci NOT NULL,
  `OrdersEmail` varchar(128) collate utf8_czech_ci NOT NULL,
  `OrdersTelephone` varchar(128) collate utf8_czech_ci NOT NULL,
  `OrdersFax` varchar(128) collate utf8_czech_ci NOT NULL,
  `OrdersMobile` varchar(128) collate utf8_czech_ci NOT NULL,
  `PayChequeEft` varchar(128) collate utf8_czech_ci NOT NULL,
  `PayNameOfAccountHolder` varchar(128) collate utf8_czech_ci NOT NULL,
  `PayNameOfBank` varchar(128) collate utf8_czech_ci NOT NULL,
  `PayBSB` varchar(128) collate utf8_czech_ci NOT NULL,
  `PayAccountNumber` varchar(128) collate utf8_czech_ci NOT NULL,
  `WPolicyNumber` varchar(128) collate utf8_czech_ci NOT NULL,
  `WInsuredAmount` varchar(45) collate utf8_czech_ci NOT NULL,
  `WInsurerName` varchar(128) collate utf8_czech_ci NOT NULL,
  `WExpiryDate` int(10) unsigned default NULL,
  `PPolicyNumber` varchar(128) collate utf8_czech_ci NOT NULL,
  `PInsuredAmount` varchar(45) collate utf8_czech_ci NOT NULL,
  `PInsurerName` varchar(128) collate utf8_czech_ci NOT NULL,
  `PExpiryDate` int(10) unsigned NOT NULL,
  `IPolicyNumber` varchar(128) collate utf8_czech_ci NOT NULL,
  `IInsuredAmount` varchar(45) collate utf8_czech_ci NOT NULL,
  `IInsurerName` varchar(128) collate utf8_czech_ci NOT NULL,
  `IExpiryDate` int(10) unsigned NOT NULL,
  `IcixName` varchar(128) collate utf8_czech_ci NOT NULL,
  `IcixDate` int(10) unsigned NOT NULL,
  `DeclarationName` varchar(45) collate utf8_czech_ci NOT NULL,
  `DeclarationDate` int(10) unsigned NOT NULL,
  `UserId` int(10) unsigned NOT NULL,
  `TypeId` int(10) unsigned default '70',
  `CompanyABN` varchar(45) collate utf8_czech_ci default NULL,
  PRIMARY KEY  (`Uid`),
  KEY `Index_CompanyName` (`CompanyName`),
  KEY `FK_vendors_vendor_types` (`TypeId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci COMMENT='InnoDB free: 11264 kB; (`Uid`) REFER `mrems/vendor_employees' AUTO_INCREMENT=5 ;

--
-- Vypisuji data pro tabulku `vendors`
--

INSERT INTO `vendors` (`Uid`, `CompanyName`, `CompanySoleTrader`, `CompanyTradeName`, `ContactStreetName`, `ContactSuburb`, `ContactState`, `ContactPostCode`, `ContactEmail`, `ContactTelephone`, `ContactFax`, `ContactMobile`, `PostalStreetName`, `PostalSuburb`, `PostalState`, `PostalPostCode`, `PaymentContactName`, `PaymentAddress`, `PaymentEmail`, `PaymentTelephone`, `PaymentFax`, `PaymentMobile`, `OrdersContactName`, `OrdersAddress`, `OrdersEmail`, `OrdersTelephone`, `OrdersFax`, `OrdersMobile`, `PayChequeEft`, `PayNameOfAccountHolder`, `PayNameOfBank`, `PayBSB`, `PayAccountNumber`, `WPolicyNumber`, `WInsuredAmount`, `WInsurerName`, `WExpiryDate`, `PPolicyNumber`, `PInsuredAmount`, `PInsurerName`, `PExpiryDate`, `IPolicyNumber`, `IInsuredAmount`, `IInsurerName`, `IExpiryDate`, `IcixName`, `IcixDate`, `DeclarationName`, `DeclarationDate`, `UserId`, `TypeId`, `CompanyABN`) VALUES
(1, 'Test', 't', 't', 't', 't', 't', 't', 't@t.com', '999', '999', '999', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', '', 0, '', '', '', 0, '', 0, '', 0, 0, 0, 't'),
(2, 'Test', 't', 't', 't', 't', 't', 't', 't@t.com', '999', '999', '999', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', '', 0, '', '', '', 0, '', 0, '', 0, 0, 0, 't'),
(3, 'Test', 't', 't', 't', 't', 't', 't', 't@test.com', '999', '999', '999', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', '', 0, '', '', '', 0, '', 0, '', 0, 0, 0, 't'),
(4, 'Test', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', '', 0, '', '', '', 0, '', 0, '', 0, 0, 0, '');

-- --------------------------------------------------------

--
-- Struktura tabulky `vendors_categories`
--

DROP TABLE IF EXISTS `vendors_categories`;
CREATE TABLE `vendors_categories` (
  `VendorId` int(10) unsigned NOT NULL default '0',
  `CategoryId` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  USING BTREE (`VendorId`,`CategoryId`),
  UNIQUE KEY `idx_category_vendor` USING BTREE (`CategoryId`,`VendorId`),
  UNIQUE KEY `idx_vendor_category` USING BTREE (`VendorId`,`CategoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `vendors_categories`
--

INSERT INTO `vendors_categories` (`VendorId`, `CategoryId`) VALUES
(4, 135),
(4, 137);

-- --------------------------------------------------------

--
-- Struktura tabulky `vendor_employees`
--

DROP TABLE IF EXISTS `vendor_employees`;
CREATE TABLE `vendor_employees` (
  `Uid` int(10) unsigned NOT NULL auto_increment,
  `VendorId` int(10) unsigned NOT NULL,
  `Name` varchar(45) collate utf8_czech_ci NOT NULL,
  `Site` varchar(45) collate utf8_czech_ci NOT NULL,
  `IdCard` int(10) unsigned NOT NULL,
  `Supervisor` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`Uid`),
  KEY `VendorId` (`VendorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=1 ;

--
-- Vypisuji data pro tabulku `vendor_employees`
--


-- --------------------------------------------------------

--
-- Struktura tabulky `vendor_types`
--

DROP TABLE IF EXISTS `vendor_types`;
CREATE TABLE `vendor_types` (
  `Uid` int(10) unsigned NOT NULL auto_increment,
  `Name` varchar(128) default NULL,
  `Operational` tinyint(1) NOT NULL,
  PRIMARY KEY  (`Uid`),
  KEY `IDX_Name` (`Name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=71 ;

--
-- Vypisuji data pro tabulku `vendor_types`
--

INSERT INTO `vendor_types` (`Uid`, `Name`, `Operational`) VALUES
(1, 'Operational Auto Doors', 1),
(2, 'Operational BMS (DDC)', 1),
(3, 'Operational Carpark Roller shutters / boom gates', 1),
(4, 'Operational Carpark Wages', 1),
(5, 'Operational CCTV', 1),
(6, 'Operational Cleaning', 1),
(7, 'Operational Cleaning Materials', 1),
(8, 'Operational Consultants', 1),
(9, 'Operational Cooling Towers - Maintenance & Water Testing', 1),
(10, 'Operational Electricity', 1),
(11, 'Operational Evacuation Training', 1),
(12, 'Operational Filter Maintenance', 1),
(13, 'Operational Fire Alarm Monitoring', 1),
(14, 'Operational Fire Services', 1),
(15, 'Operational Food Court Cleaning', 1),
(16, 'Operational Gardening Maintenance', 1),
(17, 'Operational Gardening Materials', 1),
(18, 'Operational Gardens/Grounds Maintenance', 1),
(19, 'Operational Grease Traps & Trade Waste Enzyme Treatment', 1),
(20, 'Operational Hygiene Services', 1),
(21, 'Operational Indoor Gardening Contract', 1),
(22, 'Operational Locks / Keys / Cards', 1),
(23, 'Operational Mechanical Services', 1),
(24, 'Operational OHS&E audits', 1),
(25, 'Operational OHS&E Trainning', 1),
(26, 'Operational OHSE Resource', 1),
(27, 'Operational Oil & Gas', 1),
(28, 'Operational Other Cleaning', 1),
(29, 'Operational Painting', 1),
(30, 'Operational Pest Control', 1),
(31, 'Operational R & M - Air Conditioning', 1),
(32, 'Operational R & M - Auto Doors', 1),
(33, 'Operational R & M - BMS', 1),
(34, 'Operational R & M - Carparking', 1),
(35, 'Operational R & M - Fire', 1),
(36, 'Operational R & M - General', 1),
(37, 'Operational R & M - Lamps & Tubes', 1),
(38, 'Operational R & M - Lifts & Elev', 1),
(39, 'Operational R & M - Plumbing', 1),
(40, 'Operational R & M -Electrical', 1),
(41, 'Operational R & M Glazing', 1),
(42, 'Operational R & M Sustainability', 1),
(43, 'Operational Rubbish Removal', 1),
(44, 'Operational Security Call Out', 1),
(45, 'Operational Security Equipment', 1),
(46, 'Operational Security Monitoring', 1),
(47, 'Operational Security Services', 1),
(48, 'Operational Signs and Materials', 1),
(49, 'Operational Toilet Requesits', 1),
(50, 'Operational Vertical Transport', 1),
(51, 'Admin Help desk', 0),
(52, 'Admin Insurance', 0),
(53, 'Admin Licence Fees', 0),
(54, 'Admin Management Fees', 0),
(55, 'Admin Marketing', 0),
(56, 'Admin Meter Reading Charges', 0),
(57, 'Admin Non Recoverable Expenses', 0),
(58, 'Admin Office Other', 0),
(59, 'Admin Office Training', 0),
(60, 'Admin Property Other', 0),
(61, 'Admin Recoverable Expenses', 0),
(62, 'Admin Salaries', 0),
(63, 'Admin Salaries Other', 0),
(64, 'Admin Statutory', 0),
(65, 'Admin Travel & Staff Enter', 0),
(66, 'IT IT Helpdesk and Licences', 0),
(67, 'IT Office Equipment', 0),
(68, 'IT Telephones', 0),
(69, 'Marketing', 0),
(70, 'Supplier Only', 0);

-- --------------------------------------------------------


--
-- Struktura pro pohled `view_products_categories`
--
DROP TABLE IF EXISTS `view_products_categories`;

DROP VIEW IF EXISTS `view_products_categories`;
CREATE VIEW `mrems`.`view_products_categories` AS select `p`.`uid` AS `uid`,`p`.`type` AS `type`,`p`.`quantity` AS `quantity`,`p`.`model` AS `model`,`p`.`image` AS `image`,`p`.`price` AS `price`,`p`.`virtual` AS `virtual`,`p`.`created` AS `created`,`p`.`changed` AS `changed`,`p`.`available` AS `available`,`p`.`weight` AS `weight`,`p`.`status` AS `status`,`p`.`tax_class_id` AS `tax_class_id`,`p`.`manufacturers_id` AS `manufacturers_id`,`p`.`ordered` AS `ordered`,`p`.`quantity_order_min` AS `quantity_order_min`,`p`.`quantity_order_units` AS `quantity_order_units`,`p`.`priced_by_attribute` AS `priced_by_attribute`,`p`.`product_is_free` AS `product_is_free`,`p`.`product_is_call` AS `product_is_call`,`p`.`quantity_mixed` AS `quantity_mixed`,`p`.`product_is_always_free_shipping` AS `product_is_always_free_shipping`,`p`.`qty_box_status` AS `qty_box_status`,`p`.`quantity_order_max` AS `quantity_order_max`,`p`.`sort_order` AS `sort_order`,`p`.`discount_type` AS `discount_type`,`p`.`discount_type_from` AS `discount_type_from`,`p`.`price_sorter` AS `price_sorter`,`p`.`master_categories_id` AS `master_categories_id`,`p`.`mixed_discount_quantity` AS `mixed_discount_quantity`,`p`.`metatags_title_status` AS `metatags_title_status`,`p`.`metatags_name_status` AS `metatags_name_status`,`p`.`metatags_model_status` AS `metatags_model_status`,`p`.`metatags_price_status` AS `metatags_price_status`,`p`.`metatags_title_tagline_status` AS `metatags_title_tagline_status`,`p`.`name` AS `name`,`p`.`images` AS `images`,`p`.`description` AS `description`,`pc`.`product_id` AS `product_id`,`pc`.`category_id` AS `category_id` from (`mrems`.`products` `p` join `mrems`.`products_categories` `pc`) where (`pc`.`product_id` = `p`.`uid`);

-- --------------------------------------------------------

--
-- Struktura pro pohled `view_vendors_categories`
--
DROP TABLE IF EXISTS `view_vendors_categories`;

DROP VIEW IF EXISTS `view_vendors_categories`;
CREATE VIEW `mrems`.`view_vendors_categories` AS select `p`.`Uid` AS `Uid`,`p`.`CompanyName` AS `CompanyName`,`p`.`CompanySoleTrader` AS `CompanySoleTrader`,`p`.`CompanyTradeName` AS `CompanyTradeName`,`p`.`ContactStreetName` AS `ContactStreetName`,`p`.`ContactSuburb` AS `ContactSuburb`,`p`.`ContactState` AS `ContactState`,`p`.`ContactPostCode` AS `ContactPostCode`,`p`.`ContactEmail` AS `ContactEmail`,`p`.`ContactTelephone` AS `ContactTelephone`,`p`.`ContactFax` AS `ContactFax`,`p`.`ContactMobile` AS `ContactMobile`,`p`.`PostalStreetName` AS `PostalStreetName`,`p`.`PostalSuburb` AS `PostalSuburb`,`p`.`PostalState` AS `PostalState`,`p`.`PostalPostCode` AS `PostalPostCode`,`p`.`PaymentContactName` AS `PaymentContactName`,`p`.`PaymentAddress` AS `PaymentAddress`,`p`.`PaymentEmail` AS `PaymentEmail`,`p`.`PaymentTelephone` AS `PaymentTelephone`,`p`.`PaymentFax` AS `PaymentFax`,`p`.`PaymentMobile` AS `PaymentMobile`,`p`.`OrdersContactName` AS `OrdersContactName`,`p`.`OrdersAddress` AS `OrdersAddress`,`p`.`OrdersEmail` AS `OrdersEmail`,`p`.`OrdersTelephone` AS `OrdersTelephone`,`p`.`OrdersFax` AS `OrdersFax`,`p`.`OrdersMobile` AS `OrdersMobile`,`p`.`PayChequeEft` AS `PayChequeEft`,`p`.`PayNameOfAccountHolder` AS `PayNameOfAccountHolder`,`p`.`PayNameOfBank` AS `PayNameOfBank`,`p`.`PayBSB` AS `PayBSB`,`p`.`PayAccountNumber` AS `PayAccountNumber`,`p`.`WPolicyNumber` AS `WPolicyNumber`,`p`.`WInsuredAmount` AS `WInsuredAmount`,`p`.`WInsurerName` AS `WInsurerName`,`p`.`WExpiryDate` AS `WExpiryDate`,`p`.`PPolicyNumber` AS `PPolicyNumber`,`p`.`PInsuredAmount` AS `PInsuredAmount`,`p`.`PInsurerName` AS `PInsurerName`,`p`.`PExpiryDate` AS `PExpiryDate`,`p`.`IPolicyNumber` AS `IPolicyNumber`,`p`.`IInsuredAmount` AS `IInsuredAmount`,`p`.`IInsurerName` AS `IInsurerName`,`p`.`IExpiryDate` AS `IExpiryDate`,`p`.`IcixName` AS `IcixName`,`p`.`IcixDate` AS `IcixDate`,`p`.`DeclarationName` AS `DeclarationName`,`p`.`DeclarationDate` AS `DeclarationDate`,`p`.`UserId` AS `UserId`,`p`.`TypeId` AS `TypeId`,`p`.`CompanyABN` AS `CompanyABN`,`pc`.`VendorId` AS `VendorId`,`pc`.`CategoryId` AS `CategoryId` from (`mrems`.`vendors` `p` join `mrems`.`vendors_categories` `pc`) where (`pc`.`VendorId` = `p`.`Uid`);

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `vendors_categories`
--
ALTER TABLE `vendors_categories`
  ADD CONSTRAINT `FK_vendors_categories_1` FOREIGN KEY (`VendorId`) REFERENCES `vendors` (`Uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_vendors_categories_2` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Omezení pro tabulku `vendor_employees`
--
ALTER TABLE `vendor_employees`
  ADD CONSTRAINT `FK_vendor_employees_1` FOREIGN KEY (`VendorId`) REFERENCES `vendors` (`Uid`) ON DELETE CASCADE ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS=1;

COMMIT;
