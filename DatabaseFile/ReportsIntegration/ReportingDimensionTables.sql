Dimension tables :
-------------------------
-- Course      --  While saving a course we will insert an entry into business events table with event name "Course create/update"

CREATE TABLE IF NOT EXISTS `course` (
  `id` int(10) unsigned NOT NULL,
  `name` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


/**************************************************************************************************************************/
-- Quiz name       -- While saving the quiz we will insert an entry into business events table with event name "quiz create/update"

CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int(10) unsigned NOT NULL,
  `name` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


/**************************************************************************************************************************/
-- Quiz question order number
CREATE TABLE IF NOT EXISTS `quiz_question` (
  `id` int(10) unsigned NOT NULL,
  `ordering` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/**************************************************************************************************************************/

ALTER TABLE quiz_answers ADD  CONSTRAINT `fk_quiz_answers_question_id`  FOREIGN KEY (`question_id` )  REFERENCES  `quiz_question` (`id` )     ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE quiz_answers ADD  CONSTRAINT `fk_quiz_answers_quiz1`   FOREIGN KEY (`quiz_id` )   REFERENCES `quiz` (`id` )    ON DELETE CASCADE  ON UPDATE CASCADE;
    
ALTER TABLE quiz_answers ADD  CONSTRAINT `fk_quiz_answers_course1`     FOREIGN KEY (`course_id` )     REFERENCES `course` (`id` )     ON DELETE CASCADE  ON UPDATE CASCADE;
