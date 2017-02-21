CREATE TABLE  course_progress (
  id  serial PRIMARY KEY ,
  course_instance_id numeric(10) NOT NULL,
  course_id numeric(10) NOT NULL,
  progress varchar(30) NOT NULL,
  datemodified timestamp without time zone DEFAULT now() NOT NULL
 -- UNIQUE (course_instance_id)
)  ;

-- Rule Course Progress
CREATE RULE replace_courseprogress AS 
    ON INSERT TO course_progress 
    WHERE (EXISTS ( SELECT 1 FROM course_progress WHERE ( (course_progress."course_instance_id" = new."course_instance_id") )
                                  )
                   ) 
 DO INSTEAD UPDATE course_progress 
        SET course_instance_id = new.course_instance_id,
         course_id = new.course_id,
         progress = new.progress,
         datemodified = new.datemodified
WHERE ( (course_progress."course_instance_id" = new."course_instance_id") );


grant select on course_progress to cms;
grant insert on course_progress to cms;
grant delete on course_progress to cms;

grant select on course_progress_id_seq to cms;
grant insert on course_progress_id_seq to cms;
grant delete on course_progress_id_seq to cms;

GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO cms;
