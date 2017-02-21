--Reports Integration DB design
--May 1st 2014

--task_status Dimension table

CREATE TABLE IF NOT EXISTS `task_status` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) DEFAULT NULL,
  `Description` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*
3            --- OPEN_TASK
4            --  OPEN_UPDATED_BY_INSTRUCTOR
5            --  OPEN_UPDATED_BY_STUDENT
99          --- TASK_COMPLETED
*/


INSERT INTO `task_status`(`id` , `name`,`description`) VALUES (3,'Open Task' ,'Task created by system will have this status at begining if any one instructor or student change the status then it will chnange according to that') , (4,'Update by instructor','If the post is updated by the instructor then this status is ued'),(5,'Update by Student', 'If the post is updated by the student then this status is used'),(99,'Task Closed','When a task is closed by the instructor then this status is used');


--Tasks table

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` int(10) NOT NULL,
  `course_id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL,
  `thread_id` int(10)  NOT NULL,
  `task_status_id` int(11)  unsigned NOT NULL DEFAULT '3',
  `datemodified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (task_status_id) REFERENCES task_status(id)        ON DELETE CASCADE  ON UPDATE CASCADE,
  UNIQUE (`thread_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*
ALTER TABLE tasks ADD INDEX tasks_course(course_id);
ALTER TABLE tasks ADD INDEX tasks_student(student_id);
*/

--evaluation_date 
/*
CREATE TABLE IF NOT EXISTS `evaluation_date` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `evaluationdate`  datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
*/

--quiz_score
CREATE TABLE IF NOT EXISTS `quiz_score` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` int(10) NOT NULL,
  `course_id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL,
  `quiz_id` int(10) NOT NULL,
  `evaluation_date` datetime DEFAULT NULL,
  `quiz_score` int(10) NOT NULL DEFAULT '0',
  `passing_score` int(10) NOT NULL DEFAULT '0',
  `datemodified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`course_instance_id`,`quiz_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*
ALTER TABLE quiz_score ADD INDEX quiz_scoreStudent(student_id);

ALTER TABLE quiz_score ADD INDEX quiz_scoreCourse(course_id);

ALTER TABLE quiz_score ADD INDEX quiz_scoreQuiz(quiz_id);
*/

--Quiz Answers table
CREATE TABLE IF NOT EXISTS `quiz_answers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` int(10) NOT NULL,
  `course_id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL,
  `quiz_id` int(10) NOT NULL,
  `question_id` int(10) NOT NULL,
  `isAnswered_correctly` int(1) NOT NULL DEFAULT '0',
  `incorrect_attempt_count` int(10) NOT NULL DEFAULT '0',
  `datemodified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`course_instance_id`,`quiz_id`,`question_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*
ALTER TABLE quiz_answers ADD INDEX quiz_answersCourse(course_id);

ALTER TABLE quiz_answers ADD INDEX quiz_answersStudent(student_id);

ALTER TABLE quiz_answers ADD INDEX quiz_answersQuiz(quiz_id);

ALTER TABLE quiz_answers ADD INDEX quiz_answersQuestion(question_id);
*/

