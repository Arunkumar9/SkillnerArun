CREATE TABLE IF NOT EXISTS `product_lesson_settings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) NOT NULL,
  `lesson_id` int(10) NOT NULL,
  `content_id` int(10) DEFAULT NULL,
  `setting_name` int(250) DEFAULT NULL,
  `setting_value` varchar(10) DEFAULT 0,
  `type` int(2) DEFAULT NULL,
  `order` int(2),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--ProductLessonSetting


ALTER TABLE `product_lesson_settings`  MODIFY setting_name varchar(250);

ALTER TABLE `product_lesson_settings`  MODIFY setting_value int(2);
