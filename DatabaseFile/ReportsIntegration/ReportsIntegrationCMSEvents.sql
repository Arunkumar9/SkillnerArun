---------------------------------------------------------------------------------------------------------------------
-- We need to track the below event and store data in to Business Events Table
             --Task Creation
             --Task Status Update
             --Answered to a question
             --Calculated Quiz Score
----------------------------------------------------------------------------------------------------------------------
--Business Events 

CREATE TABLE IF NOT EXISTS `business_events` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `event_name` VARCHAR(50) NOT NULL,
  `event_date` datetime NOT NULL,
  `process_status` VARCHAR(500) DEFAULT NULL,
  `data` VARCHAR(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


ALTER TABLE `quiz_answer_results` ADD COLUMN `failure_attempts` int(10) DEFAULT '0' NOT NULL;
ALTER TABLE `quiz_answer_results` ADD COLUMN `multiAnsCount` tinyint(1)  DEFAULT '0' NOT NULL;
ALTER TABLE `quiz_answer_results` DROP COLUMN `multiAnsCount` ;

ALTER TABLE `quiz_answer_results` DROP COLUMN `failure_attempts` ;

CREATE TABLE IF NOT EXISTS `quizques_failureattempt` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` int(10) NOT NULL,
  `course_id` int(10)  NOT NULL,
  `quiz_id` int(10)  NOT NULL,
  `question_id` int(10)  NOT NULL,
  `failureattempts` int(10)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;



