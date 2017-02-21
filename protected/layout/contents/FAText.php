<?php

class FAText extends FStyledTemplateControl implements ITranslatableWidget
{
    private $_MenuCls;
    private $_ContainerUid;
    private $_video;


    public function onLoad($param) {
        parent::onLoad($param);
        if ($this->User->IsGuest) {
            echo('<script>window.close()</script>'); die();
        }
                
                
                //$this->Response->redirect($this->Page->getContainer('local:closeme')->getAbsoluteHref(true));
    }

    public function onPreRender($param) {
        parent::onPreRender($param);
        if (!$this->getPage()->IsPostBack)
            $this->commentsBox->Text=$this->getComments();

        $this->ChapterRepeater->datasource = $this->getChapters();
        $this->ChapterRepeater->databind();

    }


    public function getChapters() {

        $criteria = new TActiveRecordCriteria('videos_id = ?',$this->getVideo()->uid);
        $criteria->setOrdersBy('start');

        return CuepointRecord::finder ()->findAll($criteria);
    }
    public function getContainerUid() 	{
        return $this->_ContainerUid;
    }

    public function setContainerUid($value) 	{
        $this->_ContainerUid = $value;
    }

    public function getMenuCls() 	{
        return $this->_MenuCls;
    }

    public function setMenuCls($value) 	{
        $this->_MenuCls = $value;
    }

    public function postComments($sender,$params) {


        if (!($comment = UserCommentRecord::finder()->find('feusers_id = ? AND videos_id = ?',array($this->User->uid,$this->getVideo($this->currentVideo->Value)->uid)))) {
                $comment = new UserCommentRecord;
                $comment->videos_id = $this->getVideo()->uid;
                $comment->feusers_id = $this->User->uid;
        }
        $text = trim($this->commentsBox->SafeText);
        if ($text != $comment->comments && $text) {
            $comment->comments = $text;
            $comment->save();
        }
    }

    public function clipChanged($sender,$param) {

        $video = $this->getVideo($this->currentVideo->Value);
        $this->commentsBox->Text=$this->getComments();
        $this->broadcastEvent('OnClipChanged', $sender, $param);


    }

    public function getComments() {


        if (($comment = UserCommentRecord::finder()->find('feusers_id = ? AND videos_id = ?',array($this->User->uid,$this->getVideo()->uid)))) {
                return $comment->comments;

        }

    }

    public function getVideo($uid=null) {

                    if ($this->_video === null || $uid) {

                        $vid = ($uid) ? $uid : $this->Request['vid'];
                        $vid = ($vid) ? $vid : 0;
                        $this->Request['vid'] = $vid;
                        if (is_numeric($vid))
                            $this->_video = VideoRecord::finder()->findByPk($vid);
                        else
                            $this->_video = VideoRecord::finder()->find('cool_url= ?',$vid);

                        //die($vid);
                    }
                    return $this->_video;
    }
}