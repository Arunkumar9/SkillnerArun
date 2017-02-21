/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$$('.fresh-highslide').each(function(e){
   var src = e.readAttribute('src');
   src = src.replace(/\.[0-9]{1,3}x[0-9]{1,3}/,'');
   e.wrap('a', { 'src': src, 'rel': })
});

