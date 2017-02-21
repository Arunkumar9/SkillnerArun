// $Id: email.filter.js 2348 2013-12-20 10:20:54Z arun $
var Fresh = Fresh || {};
Fresh.email = Fresh.email || {};
Fresh.email.geo_filter = function(context) {
  
  $$('.schovka').each(function(item) { item.remove() });
  $$('a[href]').each(function(item) {
    if (item.readAttribute('processed') != 'processed') {
      var href = item.readAttribute("href");
      var address = href.replace(/.*contacts\/([a-z]+)\/([a-z0-9._%-]+)\/([a-z0-9._%-]+)/i,'$3' + '@' + '$2' + '.' + '$1');
      if (href != address)
      {
        item.writeAttribute('processed', 'processed');
        item.writeAttribute("href", 'mailto:' + address);
        item.writeAttribute("rel", 'nofollow');
      //  item.html($(this).html().replace(/([a-z0-9._%-]+)\[at\]([a-z0-9._%-]+)\[dot\]([a-z.]+)/i,'$1' + '@' + '$2' + '.' + '$3'));
      }
    }
  });

}

String.prototype.rot13 = function(){
    return this.replace(/[a-zA-Z]/g, function(c){
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};
