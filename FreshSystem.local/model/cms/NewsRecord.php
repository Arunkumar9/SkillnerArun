<?php

/**
 * Auto generated by prado-cli.php on 2008-04-16 12:58:06.
 */
class NewsRecord extends NewsAR {

    private $_images = null;


    /*
      public function setImagesView($value)
      {
      $data = json_decode($value,true);
      if ($data['uid']) {
      $record = NewsImagesRecord::finder()->findByPk($data['uid']);
      } else {
      unset($data['uid']);
      $record = new NewsImagesRecord();
      }
      $record->fromArray($data);
      $record->save();

      $this->_images = $records;
      }

      public function getImagesView()
      {
      if (!$this->_images) {

      }
      return json_encode($this->_images)
      }

     */

    public function getPerex($showName=true, $l=6) {

        if (is_numeric($showName)) {
            $l = $shownName;
            $showName = false;
        }
        $lines = preg_split('/<\/p/', $this->text);

        $first = explode(' ', trim(strip_tags(preg_replace('/<p.*?>|&nbsp;/', '', $lines[0]))));
        $trail = (count($first) > $l) ? '...' : '';
        if ($showName)
            return '<b>' . $this->name . ':</b> ' . implode(' ', array_slice($first, 0, $l)) . $trail;
        else
            return implode(' ', array_slice($first, 0, $l)) . $trail;
    }

    

    public function getImagesList() {
        //
        if ($this->images) {
            $images = json_decode($this->images);
            return $images;
        }
        return array();
    }

    public function getImagesRecords() {

        $images = json_decode($this->images, true);
        $result = array();
        if (count($images)) {
            foreach ($images as $image)
                $result[] = new NewsImagesRecord($image);
        }
        return $result;
    }

    public function getImagesNN() {
        return (!$this->images || $this->images == 'null') ? '[]' : $this->images;
    }

    public function setImagesNN($value) {
        $this->images = $value;
    }

    public function getFirstImage() {
        //
        if (($list = $this->ImagesList) && $list[0])
            $fi = $list[0]->uid;

        if (!$fi)
            return Prado::getApplication()->Parameters['defaultNoImage'];
        else
            return $fi;
    }

    public function getNewsId() {

        return $this->uid . '-' . FU::urlify($this->name);
    }

    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

}

?>