/**
Copyright (c) 2008 Ângelo Ayres Camargo <uacaman at gmail.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

var XToolTip = Class.create();

XToolTip.init = function()
{
	if (this.XToolTip === undefined)
	{
		XToolTip.arr = new Array();
	}
	
	for(x =0; x < XToolTip.arr.length; x++)
	{
		var text 		= XToolTip.arr[x][1];
		var orientation = XToolTip.arr[x][2];

		Event.observe( $(XToolTip.arr[x][0]), "mouseover", XMessage.show.curry(XToolTip.arr[x][1], XToolTip.arr[x][2])   );
	}
}

XToolTip.add = function(obj, text, orientation)
{
	if (XToolTip.arr === undefined)
	{
		XToolTip.arr = new Array();
	}
	XToolTip.arr.push(	new Array(obj, text, orientation) );
}


Object.extend(XToolTip.prototype, 
{
    initialize: function (obj, text, orientation) 
	{
		if (typeof(XMessage) === undefined)
		{
			alert('Did you forget to include XMessage.js?');
		}
		else
		{
			if (XToolTip.loaded === undefined)
			{
				XToolTip.loaded = true;
				Event.observe(window, "load", XToolTip.init);	
		}			
			XToolTip.add(obj, text, orientation);
		}
    }	
});
