<?php
/**
 * FTabPanel class file.
 *
 * @author Tomasz Wolny <tomasz.wolny@polecam.to.pl> and Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005-2007 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: FTabPanel.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Web.UI.WebControls
 * @since 3.1.1
 */

/**
 * Class TTabPanel.
 *
 * TTabPanel displays a tabbed panel. Users can click on the tab bar to switching among
 * different tab views. Each tab view is an independent panel that can contain arbitrary content.
 *
 * A TTabPanel control consists of one or several {@link TTabView} controls representing the possible
 * tab views. At any time, only one tab view is visible (active), which is specified by any of
 * the following properties:
 * - {@link setActiveViewIndex ActiveViewIndex} - the zero-based integer index of the view in the view collection.
 * - {@link setActiveViewID ActiveViewID} - the text ID of the visible view.
 * - {@link setActiveView ActiveView} - the visible view instance.
 * If both {@link setActiveViewIndex ActiveViewIndex} and {@link setActiveViewID ActiveViewID}
 * are set, the latter takes precedence.
 *
 * TTabPanel uses CSS to specify the appearance of the tab bar and panel. By default,
 * an embedded CSS file will be published which contains the default CSS for TTabPanel.
 * You may also use your own CSS file by specifying the {@link setCssUrl CssUrl} property.
 * The following properties specify the CSS classes used for elements in a TTabPanel:
 * - {@link setCssClass CssClass} - the CSS class name for the outer-most div element (defaults to 'tab-panel');
 * - {@link setTabCssClass TabCssClass} - the CSS class name for nonactive tab div elements (defaults to 'tab-normal');
 * - {@link setActiveTabCssClass ActiveTabCssClass} - the CSS class name for the active tab div element (defaults to 'tab-active');
 * - {@link setViewCssClass ViewCssClass} - the CSS class for the div element enclosing view content (defaults to 'tab-view');
 *
 * To use TTabPanel, write a template like following:
 * <code>
 * <com:TTabPanel>
 *   <com:TTabView Caption="View 1">
 *     content for view 1
 *   </com:TTabView>
 *   <com:TTabView Caption="View 2">
 *     content for view 2
 *   </com:TTabView>
 *   <com:TTabView Caption="View 3">
 *     content for view 3
 *   </com:TTabView>
 * </com:TTabPanel>
 * </code>
 *
 * @author Tomasz Wolny <tomasz.wolny@polecam.to.pl> and Qiang Xue <qiang.xue@gmail.com>
 * @version $Id: FTabPanel.php 2348 2013-12-20 10:20:54Z arun $
 * @since 3.1.1
 */
class FTabPanel extends TTabPanel
{
	/**
	 * Renders body contents of the tab control.
	 * @param THtmlWriter the writer used for the rendering purpose.
	 */
	public function renderContents($writer)
	{
		$views=$this->getViews();
		if($views->getCount()>0)
		{
			$writer->writeLine();
			// render tab bar
			$writer->write('<ul class="tabs-nav">');
			foreach($views as $view)
			{
				$view->renderTab($writer);
				$writer->writeLine();
			}
			$writer->write('</ul>');
			$writer->writeLine();

			// render tab views
			foreach($views as $view)
			{
				$view->renderControl($writer);
				$writer->writeLine();
			}
		}
	}
}

/**
 * FTabView class.
 *
 */
class FTabView extends TTabView
{

	/**
	 * Renders the tab associated with the tab view.
	 * @param THtmlWriter the writer for rendering purpose.
	 */
	public function renderTab($writer)
	{
		if($this->getVisible(false) && $this->getPage()->getClientSupportsJavaScript())
		{
			$writer->addAttribute('id',$this->getClientID().'_0');

			$style=$this->getActive()?$this->getParent()->getActiveTabStyle():$this->getParent()->getTabStyle();
			$style->addAttributesToRender($writer);

			$writer->renderBeginTag('li');

			$this->renderTabContent($writer);

			$writer->renderEndTag();
		}
	}
	/**
	 * Renders the content in the tab.
	 * By default, a hyperlink is displayed.
	 * @param THtmlWriter the HTML writer
	 */
	protected function renderTabContent($writer)
	{
		if(($url=$this->getNavigateUrl())==='')
			$url='javascript://';
		if(($caption=$this->getCaption())==='')
			$caption='&nbsp;';
		$writer->write("<a href=\"{$url}\"><span>{$caption}</span></a>");
	}
}

?>