(function(){var b=YAHOO.util.Dom,r=YAHOO.util.Event,f=YAHOO.util.Element;var h=Alfresco.util.encodeHTML;Alfresco.InvitationList=function(t){Alfresco.InvitationList.superclass.constructor.call(this,"Alfresco.InvitationList",t,["button","container","datasource","datatable","json"]);this.listWidgets=[];this.uniqueRecordId=1;YAHOO.Bubbling.on("personSelected",this.onPersonSelected,this);return this};YAHOO.extend(Alfresco.InvitationList,Alfresco.component.Base,{options:{siteId:"",roles:[]},listWidgets:null,uniqueRecordId:null,onReady:function j(){if(YAHOO.env.ua.webkit>0){b.setStyle(this.id+"-backTo","vertical-align","sub")}this.widgets.inviteButton=Alfresco.util.createYUIButton(this,"invite-button",this.inviteButtonClick);this.widgets.allRolesSelect=Alfresco.util.createYUIButton(this,"selectallroles-button",this.onSelectAllRoles,{type:"menu",menu:"selectallroles-menu"});this.widgets.dataSource=new YAHOO.util.DataSource([],{responseType:YAHOO.util.DataSource.TYPE_JSARRAY});this._setupDataTable();this._enableDisableInviteButton();var v=this,u=function t(x,w){v.removeInvitee.call(v,w[1].anchor);w[1].stop=true;return true};YAHOO.Bubbling.addDefaultAction("remove-item-button",u);b.setStyle(this.id+"-invitationBar","visibility","visible")},_setupDataTable:function a(){var x=this;var t=function v(G,E,H,I){var B=E.getData(),D=YAHOO.lang.trim(B.firstName+" "+B.lastName),F="",C=B.email;if(B.userName!==undefined&&B.userName.length>0){F="("+B.userName+")"}G.innerHTML='<h3 class="itemname">'+h(D)+' <span class="lighter theme-color-1">'+h(F)+'</span></h3><div class="detail">'+h(C)+"</div>"};var w=function y(N,P,L,C){b.setStyle(N.parentNode,"width",L.width+"px");b.setStyle(N,"overflow","visible");var O=new f(N),D=P.getData("id"),M=x.id+"-roleselector-"+D;var J=b.get(x.id+"-role-column-template"),E=J.cloneNode(true);E.setAttribute("id","actionsDiv"+D);b.setStyle(E,"display","");var K=[],H;for(var G=0,F=x.options.roles.length;G<F;G++){H=x.options.roles[G];K.push({text:x.msg("role."+H),value:H,onclick:{fn:x.onRoleSelect,obj:{record:P,role:H},scope:x}})}O.appendChild(E);var B=b.getElementsByClassName("role-selector-button","button",E);var I=new YAHOO.widget.Button(B[0],{type:"menu",name:M,label:x.getRoleLabel(P)+" "+Alfresco.constants.MENU_ARROW_SYMBOL,menu:K});x.listWidgets[D]={button:I}};var u=function A(C,B,D,F){b.setStyle(C.parentNode,"width",D.width+"px");var E='<span id="'+x.id+'-removeInvitee">  <a href="#" class="remove-item-button"><span class="removeIcon">&nbsp;</span></a></span>';C.innerHTML=E};var z=[{key:"user",label:"User",sortable:false,formatter:t},{key:"role",label:"Role",sortable:false,formatter:w,width:140},{key:"remove",label:"Remove",sortable:false,formatter:u,width:30}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-inviteelist",z,this.widgets.dataSource,{MSG_EMPTY:this.msg("invitationlist.empty-list")})},getRoleLabel:function g(t){if(t.getData("role")!==undefined){return this.msg("role."+t.getData("role"))}return this.msg("invitationlist.selectrole")},onPersonSelected:function s(v,u){var w=u[1],t={id:this.uniqueRecordId++,userName:w.userName||"",firstName:w.firstName,lastName:w.lastName,email:w.email};this.widgets.dataTable.addRow(t);this._enableDisableInviteButton()},removeInvitee:function q(u){var t=this.widgets.dataTable.getRecord(u);YAHOO.Bubbling.fire("personDeselected",{userName:t.getData("userName")});this.widgets.dataTable.deleteRow(t);this._enableDisableInviteButton()},onSelectAllRoles:function p(w,v,u){var t=v[1].value;if(t===""){return}this._setAllRolesImpl(t);this._enableDisableInviteButton();r.preventDefault(v[0])},onRoleSelect:function i(x,w,v){var u=v.role,t=v.record;this._setRoleForRecord(t,u);this._enableDisableInviteButton();r.preventDefault(w[0])},_setAllRolesImpl:function c(t){var x=this.widgets.dataTable.getRecordSet(),u;for(var v=0,w=x.getLength();v<w;v++){u=x.getRecord(v);this._setRoleForRecord(u,t)}this._enableDisableInviteButton()},_setRoleForRecord:function m(t,u){t.setData("role",u);this.listWidgets[t.getData("id")].button.set("label",this.getRoleLabel(t)+" "+Alfresco.constants.MENU_ARROW_SYMBOL)},_checkAllRolesSet:function d(){var w=this.widgets.dataTable.getRecordSet(),t;for(var v=0,u=w.getLength();v<u;v++){t=w.getRecord(v);if(t.getData("role")===undefined){return false}}return true},_enableDisableInviteButton:function k(){var t=this.widgets.dataTable.getRecordSet().getLength()>0&&this._checkAllRolesSet();this.widgets.inviteButton.set("disabled",!t)},inviteButtonClick:function o(y){var w=this.widgets.dataTable.getRecordSet();if(w.getLength()<0||!this._checkAllRolesSet()){this._enableDisableInviteButton();return}this.widgets.inviteButton.set("disabled",true);this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:this.msg("message.please-wait"),spanClass:"wait",displayTime:0});var x=[];for(var v=0,u=w.getLength();v<u;v++){x.push(w.getRecord(v))}var t={recs:x,size:x.length,index:0,successes:[],failures:[]};this._processInviteData(t)},_processInviteData:function n(t){if(t.index>=t.size){this._finalizeInvites(t);return}this._doInviteUser(t)},_doInviteUser:function l(t){var v=t.recs[t.index];var z=function y(A){t.successes.push(t.index);t.index++;this._processInviteData(t)};var w=function u(A){t.failures.push(t.index);t.index++;this._processInviteData(t)};var x=window.location.protocol+"//"+window.location.host+Alfresco.constants.URL_CONTEXT;Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/sites/"+this.options.siteId+"/invitations",method:"POST",requestContentType:"application/json",responseContentType:"application/json",dataObj:{invitationType:"NOMINATED",inviteeUserName:v.getData("userName")||"",inviteeRoleName:v.getData("role"),inviteeFirstName:v.getData("firstName"),inviteeLastName:v.getData("lastName"),inviteeEmail:v.getData("email"),serverPath:x,acceptURL:"page/accept-invite",rejectURL:"page/reject-invite"},successCallback:{fn:z,scope:this},failureCallback:{fn:w,scope:this}})},_finalizeInvites:function e(t){for(var u=t.successes.length-1;u>=0;u--){this.widgets.dataTable.deleteRow(t.successes[u])}this.widgets.feedbackMessage.destroy();Alfresco.util.PopupManager.displayMessage({text:this.msg("message.inviteresult",t.successes.length,t.failures.length)});this._enableDisableInviteButton()}})})();