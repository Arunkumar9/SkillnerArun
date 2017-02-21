ALTER TABLE `quiz_answers` ADD `range_limit` INT(10)  ;

ALTER TABLE `quiz_answers` ADD `numeric_type` CHAR(20) DEFAULT NULL ;

ALTER TABLE `quiz_answers` ADD `first_value` INT(10);

ALTER TABLE `quiz_answers` ADD `second_value` INT(10);
