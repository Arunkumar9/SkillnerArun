-- phpMyAdmin SQL Dump
-- version 2.11.4
-- http://www.phpmyadmin.net
--
-- Počítač: localhost
-- Vygenerováno: Středa 02. července 2008, 13:31
-- Verze MySQL: 5.0.51
-- Verze PHP: 5.2.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Databáze: `verkon`
--

-- --------------------------------------------------------

DROP VIEW IF EXISTS `cc_view`;
CREATE VIEW `cc_view` AS select `cc`.`uid` AS `uid`,`cc`.`t` AS `t`,`cc`.`parent_id` AS `parent_id`,_utf8'' AS `data` from `cms_containers` `cc` union select `c`.`uid` AS `uid`,`c`.`t` AS `t`,`c`.`parent_id` AS `parent_id`,`c`.`data` AS `data` from `cms_contents` `c`;
-- --------------------------------------------------------

--
-- Struktura tabulky `cms_containers`
--

CREATE TABLE IF NOT EXISTS `cms_containers` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `code` varchar(45) collate utf8_czech_ci default NULL,
  `description` tinytext collate utf8_czech_ci,
  `parent_id` int(10) unsigned default NULL,
  `type_id` int(10) unsigned NOT NULL default '3',
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci COMMENT='InnoDB free: 10240 kB' AUTO_INCREMENT=644 ;

-- --------------------------------------------------------

--
-- Struktura tabulky `cms_contents`
--

CREATE TABLE IF NOT EXISTS `cms_contents` (
  `uid` int(10) unsigned NOT NULL auto_increment,
  `code` varchar(45) collate utf8_czech_ci default NULL,
  `data` blob,
  `type_id` int(10) unsigned default NULL,
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci AUTO_INCREMENT=1684 ;

-- --------------------------------------------------------

--
-- Struktura tabulky `pradocache`
--

CREATE TABLE IF NOT EXISTS `pradocache` (
  `itemkey` char(128) collate utf8_czech_ci NOT NULL,
  `value` longblob,
  `expire` int(11) default NULL,
  PRIMARY KEY  (`itemkey`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku cms_containers
--
ALTER TABLE `cms_containers`
  ADD CONSTRAINT `FK_cms_containers_2` FOREIGN KEY (`parent_id`) REFERENCES `cms_containers` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku cms_contents
--
ALTER TABLE `cms_contents`
  ADD CONSTRAINT `FK_cms_contents_1` FOREIGN KEY (`parent_id`) REFERENCES `cms_containers` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
