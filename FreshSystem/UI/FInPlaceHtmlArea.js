Prado.WebUI.FInPlaceHtmlArea = Prado.WebUI.TInPlaceTextBox.extend(
{

	/**
	 * Changes the panel to an editable input.
	 * @param {Event} evt event source
	 */
	enterEditMode :  function(evt)
	{
	    if (this.isSaving || this.isEditing) return;
	    this.isEditing = true;
		this.onEnterEditMode();
		this.createEditorInput();
		this.showTextBox();
		this.editField.disabled = false;
		if(this.options.LoadTextOnEdit)
			this.loadExternalText();
		Prado.Element.focus(this.editField);
		if (typeof(tinyMCE) != undefined)
		{
			tinyMCE.execCommand('mceAddControl',false,this.editField.id);
			tinyMCE.execCommand('mceFocus',false,this.editField.id);
		}
		if (evt)
			Event.stop(evt);
    	return false;
	}
});

if (typeof(Fresh)=='undefined')
	var Fresh = {}

Fresh.mceCancel = function(inst)
{
 if (typeof(inst.execCommand)=='function')
 {
  ot = inst.oldTargetElement.id;
  p = Prado.WebUI.TInPlaceTextBox.textboxes[ot];
  if (p) 
  {
    h = p.element.innerHTML; 
    tinyMCE.removeMCEControl(inst.editorId);
    p.editField.value = h;
    p.exitEditMode();
    return true;
  } 
 }
 return false;
}

Fresh.mceSave = function(inst)
{
 if (typeof(inst.execCommand)=='function')
 {
  ot = inst.oldTargetElement.id;
  p = Prado.WebUI.TInPlaceTextBox.textboxes[ot];
  if (p)
  { 
    //html = inst.getHTML();
    h = tinyMCE.trim(inst.getHTML());
    tinyMCE.triggerNodeChange(false, true);
    tinyMCE.removeMCEControl(inst.editorId);
    p.editField.value = h;
    p.onTextBoxBlur();
    jQuery(p.element).find('title,meta').remove();
    return false;
  }
 }
 return true;
}


