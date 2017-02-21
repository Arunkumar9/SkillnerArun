--Reports Integration DB design
--May 1st 2014

--task_status Dimension table

CREATE TABLE task_status (
  id numeric(11) NOT NULL ,
  name character varying(100) DEFAULT NULL,
  Description character varying(500) DEFAULT NULL,
  PRIMARY KEY (id)
);

/*
3            --- OPEN_TASK
4            --  OPEN_UPDATED_BY_INSTRUCTOR
5            --  OPEN_UPDATED_BY_STUDENT
99          --- TASK_COMPLETED
*/


INSERT INTO task_status(id , name,description) VALUES (3,'Open Task' ,'Task created by system will have this status at begining if any one instructor or student change the status then it will chnange according to that') , (4,'Update by instructor','If the post is updated by the instructor then this status is ued'),(5,'Update by Student', 'If the post is updated by the student then this status is used'),(99,'Task Closed','When a task is closed by the instructor then this status is used');


--Dimension tables :
-------------------------
-- Course      --  While saving a course we will insert an entry into business events table with event name "Course create/update"

CREATE TABLE  course (
  id numeric(10) NOT NULL,
  name character varying(50) DEFAULT NULL,
  PRIMARY KEY (id)
) ;

/************************************************************************************************************************/
-- Quiz name       -- While saving the quiz we will insert an entry into business events table with event name "quiz create/update"

CREATE TABLE  quiz (
  id numeric(10) NOT NULL,
  name character varying(50) DEFAULT NULL,
  PRIMARY KEY (id)
) ;

/************************************************************************************************************************/
-- Quiz question order number
CREATE TABLE  quiz_question (
  id numeric(10) NOT NULL,
  ordering numeric(10) DEFAULT NULL,
  PRIMARY KEY (id)
) ;

/***********************************************************************************************************************/

--Tasks table

CREATE TABLE  tasks (
  id  serial PRIMARY KEY ,
  course_instance_id numeric(10) NOT NULL,
  course_id numeric(10) NOT NULL,
  student_id numeric(10) NOT NULL,
  thread_id numeric(10)  NOT NULL,
  task_status_id numeric(11)   NOT NULL DEFAULT '3',
  datemodified timestamp without time zone DEFAULT now() NOT NULL,
  FOREIGN KEY (task_status_id) REFERENCES task_status(id)        ON DELETE CASCADE  ON UPDATE CASCADE,
  UNIQUE (thread_id)
)  ;

-- Task Rule
CREATE RULE replace_tasks AS 
    ON INSERT TO tasks 
    WHERE (EXISTS ( SELECT 1 FROM tasks WHERE ( (tasks."thread_id" = new."thread_id") )
                                  )
                   ) 
 DO INSTEAD UPDATE tasks 
        SET course_instance_id = new.course_instance_id,
         course_id = new.course_id,
         student_id = new.student_id,
         task_status_id = new.task_status_id,
         datemodified = new.datemodified
WHERE ( (tasks."thread_id" = new."thread_id") );
--INSERT INTO tasks (course_instance_id,course_id,student_id,thread_id,task_status_id,datemodified) VALUES ( 200203,9634,121,38,5,'2014-05-23 17:31:43' ),( 200204,9634,121,61,4,'2014-05-23 17:31:43' );
--CREATE UNIQUE INDEX name ON table (column [, ...]);
/***********************************************************************************************************************/


--quiz_score
CREATE TABLE  quiz_score (
  id  serial PRIMARY KEY  ,
  course_instance_id numeric(10) NOT NULL,
  course_id numeric(10) NOT NULL,
  student_id numeric(10) NOT NULL,
  quiz_id numeric(10) NOT NULL,
  evaluation_date timestamp without time zone DEFAULT now() NOT NULL,
  quiz_score numeric(10) NOT NULL DEFAULT '0',
  passing_score numeric(10) NOT NULL DEFAULT '0',
  datemodified timestamp without time zone DEFAULT now() NOT NULL
 -- UNIQUE (course_instance_id,quiz_id)
)  ;

-- Quiz Scores Rule
CREATE RULE replace_quiz_score AS 
    ON INSERT TO quiz_score 
    WHERE (EXISTS ( SELECT 1 FROM  quiz_score WHERE ( (quiz_score."course_instance_id" = new."course_instance_id") AND (quiz_score."quiz_id" = new."quiz_id"))
                                  )
                   ) 
 DO INSTEAD UPDATE quiz_score 
        SET course_instance_id = new.course_instance_id,
         course_id = new.course_id,
         student_id = new.student_id,
         quiz_id = new.quiz_id,
         evaluation_date = new.evaluation_date,
         quiz_score = new.quiz_score,
         passing_score= new.passing_score,
         datemodified = new.datemodified
WHERE ( (quiz_score."course_instance_id" = new."course_instance_id") AND (quiz_score."quiz_id" = new."quiz_id"));


--INSERT INTO quiz_score (course_instance_id,course_id,student_id,quiz_id,evaluation_date,quiz_score,passing_score,datemodified) VALUES ( 200203,9634,121,255,'2014-05-27 10:15:49',31,30,'2014-05-27 15:53:30' ),( 200203,9634,121,255,'2014-05-27 10:22:52',31,30,'2014-05-27 15:53:30' ),( 200203,9634,121,255,'2014-05-27 10:23:10',23,30,'2014-05-27 15:53:30' );

/***********************************************************************************************************************/



--Quiz Answers table
CREATE TABLE  quiz_answers (
  id  serial PRIMARY KEY ,
  course_instance_id numeric(10) NOT NULL,
  course_id numeric(10) NOT NULL,
  student_id numeric(10) NOT NULL,
  quiz_id numeric(10) NOT NULL,
  question_id numeric(10) NOT NULL,
  isAnswered_correctly numeric(1) NOT NULL DEFAULT '0',
  incorrect_attempt_count numeric(10) NOT NULL DEFAULT '0',
  datemodified timestamp without time zone DEFAULT now() NOT NULL,
 UNIQUE (course_instance_id,quiz_id,question_id)
)  ;


-- Quiz answers Rule
CREATE RULE replace_quiz_answers AS 
    ON INSERT TO quiz_answers 
    WHERE (EXISTS ( SELECT 1 FROM quiz_answers WHERE ( (quiz_answers."course_instance_id" = new."course_instance_id") AND (quiz_answers."quiz_id" = new."quiz_id") AND (quiz_answers."question_id" = new."question_id") )
                                  )
                   ) 
 DO INSTEAD UPDATE quiz_answers 
        SET course_instance_id = new.course_instance_id,
         course_id = new.course_id,
         student_id = new.student_id,
         quiz_id = new.quiz_id,
         question_id = new.question_id,
         isAnswered_correctly = new.isAnswered_correctly,
         incorrect_attempt_count = new.incorrect_attempt_count,
         datemodified = new.datemodified
        
WHERE  ( (quiz_answers."course_instance_id" = new."course_instance_id") AND (quiz_answers."quiz_id" = new."quiz_id") AND (quiz_answers."question_id" = new."question_id") );

/***********************************************************************************************************************/


ALTER TABLE quiz_answers ADD  CONSTRAINT fk_quiz_answers_question_id  FOREIGN KEY (question_id )  REFERENCES  quiz_question (id )     ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE quiz_answers ADD  CONSTRAINT fk_quiz_answers_quiz1   FOREIGN KEY (quiz_id )   REFERENCES quiz (id )    ON DELETE CASCADE  ON UPDATE CASCADE;
    
ALTER TABLE quiz_answers ADD  CONSTRAINT fk_quiz_answers_course1     FOREIGN KEY (course_id )     REFERENCES course (id )     ON DELETE CASCADE  ON UPDATE CASCADE;



ALTER TABLE quiz_score ADD  CONSTRAINT fk_quiz_score_quiz1   FOREIGN KEY (quiz_id )   REFERENCES quiz (id )    ON DELETE CASCADE  ON UPDATE CASCADE;
    
ALTER TABLE quiz_score ADD  CONSTRAINT fk_quiz_score_course1     FOREIGN KEY (course_id )     REFERENCES course (id )     ON DELETE CASCADE  ON UPDATE CASCADE;


ALTER TABLE tasks ADD  CONSTRAINT fk_tasks_course1     FOREIGN KEY (course_id )     REFERENCES course (id )     ON DELETE CASCADE  ON UPDATE CASCADE;



grant select on tasks to cms;
grant insert on tasks to cms;
grant delete on tasks to cms;

grant select on tasks_id_seq to cms;
grant insert on tasks_id_seq to cms;
grant delete on tasks_id_seq to cms;

GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO cms;

grant select on quiz_answers to cms;
grant insert on quiz_answers to cms;
grant delete on quiz_answers to cms;

grant select on quiz_answers_id_seq to cms;
grant insert on quiz_answers_id_seq to cms;
grant delete on quiz_answers_id_seq to cms;

GRANT USAGE, SELECT ON SEQUENCE quiz_answers_id_seq TO cms;


grant select on quiz_score to cms;
grant insert on quiz_score to cms;
grant delete on quiz_score to cms;

grant select on quiz_score_id_seq to cms;
grant insert on quiz_score_id_seq to cms;
grant delete on quiz_score_id_seq to cms;

GRANT USAGE, SELECT ON SEQUENCE quiz_score_id_seq TO cms;


/***********************************************************************************************************************/







/*

INSERT INTO tasks (course_instance_id,course_id,student_id,thread_id,task_status_id,datemodified) VALUES ( 200203,9634,121,38,5,'2014-05-23 17:31:43' ),( 200204,9634,121,61,4,'2014-05-23 17:31:43' );


http://stackoverflow.com/questions/8584967/split-comma-separated-column-data-into-additional-columns
http://stackoverflow.com/questions/1109061/insert-on-duplicate-update-in-postgresql

CREATE FUNCTION "taskcreateupdate"(p_taskkeys character varying, p_taskvalues character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$DECLARE
     v_resultVallues character varying;
     v_taskTotalCount numeric;
     v_startCountValue numeric;
     v_result numeric;
     v_querySql character varying;
     v_taskList character varying[];
     v_taskValueList character varying[];
     v_taskValue character varying;
     v_finalValueList character varying[];
     
BEGIN	
    v_resultVallues := 'values are caming';
    v_taskTotalCount := p_taskCount;
    v_startCountValue := 1;
    
   SELECT max(array_length(regexp_split_to_array(p_taskkeys, ','), 1)) INTO    v_taskTotalCount ;
   SELECT regexp_split_to_array(p_taskkeys, ',') INTO v_taskList;
   SELECT regexp_split_to_array(p_taskvalues, '~@~') INTO v_taskValueList;        --   v_taskValueList[1] ,  v_taskValueList[2]
   
   WHILE v_taskTotalCount > 0 LOOP
            v_taskValue := v_taskValueList[v_taskTotalCount];
            SELECT array_length(regexp_split_to_array(p_taskValue, ',') INTO v_finalValueList;
            
           UPDATE tasks SET course_instance_id = v_finalValueList[1],course_id = v_finalValueList[2] ,student_id = v_finalValueList[3],task_status_id = v_finalValueList[4],datemodified= v_finalValueList[5] WHERE thread_id = v_taskList[v_taskTotalCount];
            IF found THEN
                                                    
            END IF;  
                          
          v_taskTotalCount := v_taskTotalCount -1;
   END LOOP;
   
    -- WHILE v_taskTotalCount > 0 LOOP
    --  v_result := split_part(p_taskkeys, ',',v_startCountValue);
    --         v_querySql := 'INSERT INTO course (id,name) VALUES ('||v_startCountValue||','|v_result|')';
    --         EXECUTE querySql;
    --  v_startCountValue := v_startCountValue-1;
    -- END LOOP;

RETURN v_resultVallues;
END;$$;


SELECT public.taskcreateupdate('38,60'::character varying , '200203,9634,121,38,5,2014-05-23 14:29:22~@~200204,9634,121,60,4,2014-05-23 14:29:22'::character varying , 2::numeric);
SELECT taskcreateupdate('38,60' , 'task1,task2' , 2);


SELECT public.taskcreateupdate(CAST('abc' AS character varying) , CAST('tasktask' AS character varying) , CAST(2 AS numeric));
CAST (4 AS numeric)

SELECT public.test(CAST('test' AS character varying) );


SELECT public.taskcreateupdate(CAST('test' AS character varying) );

SELECT public.taskcreateupdate(CAST('abc' AS character varying) , CAST('tasktask' AS character varying));
*/
