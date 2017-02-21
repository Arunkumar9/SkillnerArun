<?
  // images directory
  $images_dir = "images/";
  // valid extensions
  $valid_exts = array(".gif", ".jpg", ".jpeg", ".png");
  // image list
  $list = array();
  // create handle for images directory
  $dir = opendir($images_dir);
  // loop through each entry in the directory
  while ($file_name = readdir($dir)) {
    // exclude sub directories
    if (is_file($images_dir.$file_name)) {
      // exclude files that aren't images
      if (in_array(strtolower(strrchr($file_name, ".")), $valid_exts)) {
        // get the image dimensions
        list($width, $height) = getimagesize($images_dir.$file_name);
        // get the image size
        $size = filesize($images_dir.$file_name);
        // append to the image list
        $list[] = array("name" => $file_name, "width" => $width,
          "height" => $height, "size" => $size, "url" => $images_dir.$file_name);
      }
    }
  }
  // close the directory service
  closedir($dir);
  // output the image list as json
  echo json_encode(array("images" => $list));
?>
