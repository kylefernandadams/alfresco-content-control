(function(){var j=YAHOO.util.Dom;var g=Alfresco.util.encodeHTML;Alfresco.dashlet.SiteSearch=function o(q){Alfresco.dashlet.SiteSearch.superclass.constructor.call(this,"Alfresco.dashlet.SiteSearch",q,["container","datasource","datatable"]);this.services.preferences=new Alfresco.service.Preferences();return this};YAHOO.extend(Alfresco.dashlet.SiteSearch,Alfresco.component.SearchBase,{options:{searchRootNode:"",searchTerm:"",resultSize:"10"},PREFERENCES_SITE_SEARCH_DASHLET_TERM:"",PREFERENCES_SITE_SEARCH_DASHLET_RESULTSIZE:"",onReady:function k(){var u=this,v=this.id;var r=this.services.preferences.getDashletId(this,"site.search");this.PREFERENCES_SITE_SEARCH_DASHLET_TERM=r+".term";this.PREFERENCES_SITE_SEARCH_DASHLET_RESULTSIZE=r+".resultSize";this.widgets.resultSizeMenuButton=Alfresco.util.createYUIButton(this,"resultSize",this.onResultSizeSelected,{type:"menu",menu:"resultSize-menu",lazyloadmenu:false});var s=this.services.preferences.get();var t=Alfresco.util.findValueByDotNotation(s,this.PREFERENCES_SITE_SEARCH_DASHLET_TERM),q=Alfresco.util.findValueByDotNotation(s,this.PREFERENCES_SITE_SEARCH_DASHLET_RESULTSIZE);if(t!=null||q!=null){this.options.searchTerm=j.get(this.id+"-search-text").value=(t?t:"");this.options.resultSize=(q?q:"10");this.doRequest()}var q=this.getResultSize();this.widgets.resultSizeMenuButton.set("label",q+" "+Alfresco.constants.MENU_ARROW_SYMBOL);this.widgets.resultSizeMenuButton.value=q;j.removeClass(Selector.query(".toolbar div",v,true),"hidden");var u=this;j.get(v+"-search-text").onkeypress=function(w){if(w.keyCode==YAHOO.util.KeyListener.KEY.ENTER){u.setSearchTerm(YAHOO.lang.trim(j.get(u.id+"-search-text").value));u.doRequest()}};j.get(v+"-search-button").onclick=function(w){u.setSearchTerm(YAHOO.lang.trim(j.get(u.id+"-search-text").value));u.doRequest()}},getSearchTerm:function l(){return this.options.searchTerm},setSearchTerm:function p(q){if(this.options.searchTerm!=q){this.options.searchTerm=q;this.services.preferences.set(this.PREFERENCES_SITE_SEARCH_DASHLET_TERM,q)}},getResultSize:function a(){return YAHOO.lang.trim(this.options.resultSize)},setResultSize:function e(q){if(this.options.resultSize!=q){this.options.resultSize=q;this.services.preferences.set(this.PREFERENCES_SITE_SEARCH_DASHLET_RESULTSIZE,q)}},getRootNode:function d(){return this.options.searchRootNode},buildNameWithHref:function m(q,r){return'<h3 class="itemname"> <a class="theme-color-1" href='+q+">"+r+"</a></h3>"},buildDescription:function n(q,r,s){var u="";var t=this.options.siteId;if(!(t&&t!=null)){u=q+" "+this.msg("message.insite")+' <a href="'+Alfresco.constants.URL_PAGECONTEXT+"site/"+r+'/dashboard">'+g(s)+"</a>"}return u},buildUrl:function b(){var q=Alfresco.constants.PROXY_URI+"slingshot/search?term={term}&maxResults={maxResults}&rootNode={rootNode}";var r=this.options.siteId;if(r&&r!=null){q+="&site="+r}return YAHOO.lang.substitute(q,{term:encodeURIComponent(this.getSearchTerm()),maxResults:this.getResultSize(),rootNode:encodeURIComponent(this.getRootNode())})},doRequest:function c(){this.widgets.alfrescoDataTable=new Alfresco.util.DataTable({dataSource:{url:this.buildUrl(),config:{responseSchema:{resultsList:"items"}}},dataTable:{container:this.id+"-search-results",columnDefinitions:[{key:"site",formatter:this.bind(this.renderThumbnail),width:48},{key:"path",formatter:this.bind(this.renderDescription)}],config:{MSG_EMPTY:this.msg("no.result")}}})},renderThumbnail:function i(r,q,s,t){if(q.getData("type")==="document"){j.addClass(r.parentNode,"thumbnail")}r.innerHTML=this.buildThumbnailHtml(q,48,48)},renderDescription:function h(D,G,y,v){var z=G.getData("type"),t=G.getData("name"),A=G.getData("displayName"),u=G.getData("site"),F=G.getData("path"),C=G.getData("nodeRef"),s=G.getData("container"),r=G.getData("modifiedOn"),B=u.shortName,w=u.title,E=Alfresco.util.formatDate(Alfresco.util.fromISO8601(r)),x=this.buildTextForType(z),q=this.getBrowseUrl(t,z,u,F,C,s,E);D.innerHTML=this.buildNameWithHref(q,A)+this.buildDescription(x,B,w)+this.buildPath(z,F,u)},onResultSizeSelected:function f(y,x){var r=x[1];if(r){this.widgets.resultSizeMenuButton.set("label",r.cfg.getProperty("text")+" "+Alfresco.constants.MENU_ARROW_SYMBOL);this.widgets.resultSizeMenuButton.value=r.value;this.setResultSize(r.value);var t=this.widgets.alfrescoDataTable;if(t){var q=t.getDataTable().getDataSource(),s=q.liveData,w=s.split("?"),u=w[1].split("&");for(var v=0;v<u.length;v++){if(u[v].split("=")[0]==="maxResults"){u[v]="maxResults="+r.value;s=w[0]+"?"+u.join("&");break}}q.liveData=s;t.loadDataTable()}}}})})();