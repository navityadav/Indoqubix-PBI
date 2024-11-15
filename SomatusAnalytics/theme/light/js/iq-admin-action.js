/**
 * 
 * Library for Admin Actions
 * 
 */



function init_content_management() {

	var clientId = $("#menuSelectClient").val();
	
	

	
	//console.log("Init Content Management");
	//console.log("Client ID:" + clientId); init_content_management

	//$("#static-content-area").hide();
	//$("#reportArea").hide();
	showHideElement("static-content-area", "hide");
	showHideElement("reportArea", "hide");
	getClientMenu(clientId);
}

function showHideElement(elementId, action) {

	if (action === "hide") {
		$("#" + elementId).hide();
	}
	if (action === "show") {
		$("#" + elementId).show();
	}
}


// START Content Management - Menu and Report Add/Update  

$("#menuSelectClient").change(function () {
	startLoader("Loading..");
	init_content_management();
	
});

/**
 * 
 * @param {*} clientId 
 * 
 * Get client menu based on client id.
 * Ajax Request posted to /content/getClientMenu
 * 
 * Returned data is checked for empty validation and following keys are replaced as text 
 * label to text, subMenu to nodes and attributes to state - as bootstrap-treeview uses replaced values for hierarchy and selection.
 * 
 */

function getClientMenu(clientId) {

	//console.log("Inside clientMenu..ClientID:"+clientId);	

	
	startLoader("Loading..");
	$("#no-selection").show();
	$("#content-detail").addClass("hidden");
	var menuModel = {};
	menuModel.clientId = clientId;
	$.ajax({
		type: 'POST',
		url: "/content/getClientMenu/",
		async: true,
		data: JSON.stringify(menuModel),
		contentType: 'application/json;',
		success: function (data) {
			if (!isEmpty(JSON.parse(data))) {
				//	var str = JSON.stringify(data);
				data = data.replace(/label/g, 'text');
				data = data.replace(/subMenu/g, 'nodes');
				data = data.replace(/attributes/g, 'state');

				// Change Menu Color based on Menu or Non
				
				data = JSON.parse(data);

				//console.log(data[0]);
				//data[0].state = { selected: true };
				//console.log("Inside getClientMenu():"+data[0]);
				//console.log(data);
				/******************
				 * 			 * 
				 * MENU BLOCK STARTS
				 * 
				 ******************/
				$("#parentMenu").html(' <select class="form-control" id="menuParent" name="menuParent" title="Select Parent..."> </select>');
				$("#menuParent").append('<option style="color:black;" value="">Select Parent</option>')

				$.each(data, function () {
					//console.log("Updating Menu..");
					//console.log(this);

					$("#menuParent").append('<option style="color:black;" value="' + this.id + '">' + this.text + '</option>')

				});
				
				updateParentMenu("Select Parent");
				/********************
				 * 					* 
				 * MENU BLOCK ENDS
				 * 
				 ******************/

				//updContentFrm(clientId, data[0]);
				
				//console.log(data);
				//console.log("Putting in treeview....");
			 
					$('#tree').treeview({
					data: data,
					levels: 2,
					expanded: false,
					selected: false,
					onNodeSelected: function (event, data) {
					
						//console.log(event);
						//console.log(JSON.stringify(data));
						//				 //console.log("ID:"+data.id);
						//				 //console.log("Is Static:"+data.is_static)
						//console.log("On Node Selected..calling updContentFrm...Client:"+clientId+" Data:"+JSON.stringify(data));
						updContentFrm(clientId, data);
						
					}
				});
		  // Select/unselect/toggle nodes
		  $('#input-select-node').on('keyup', function (e) {
			  //console.log($('#input-select-node').val());
			$('#tree').treeview('search',[ $('#input-select-node').val(), { ignoreCase: false, exactMatch: false , revealResults: true} ]);
		  });
			

				stopLoader();

			}

		},
		error: function (e) {
			stopLoader();
			//	notify("Error in checking, if report already exists", "danger");	

		}
	});
	
}	

	

function getReportDetails(clientId, uri) {
//	startLoader('Loading...');
	var reportModel = {};
	reportModel.clientId = clientId;
	reportModel.uri = uri;
	//console.log("Report Model:" + JSON.stringify(reportModel));
	uri = "/content/getReport/";
	callback = updReport;
	CallAPI_AJAX(uri, callback, reportModel);
}

function getRoleByMenuID(menuId) {
	var menuModel = {};
	menuModel.id = menuId;
	uri = "/content/getRoleByMenu/";
	callback = updRole;
	CallAPI_AJAX(uri, callback, menuModel);
	
}

function updRole(data) {
	//console.log("Updating Roles for menu...")
	//console.log(data);
	$('#userRole').selectpicker('val', JSON.parse(data));

}

function getPlaceHolders(clientId, uri) {
	//console.log("Inside Get Place Holders.. Client ID:"+clientId+" URL:"+uri);
	var model = {};
	model.clientId = clientId;
	model.uri = uri;
	//console.log("Menu Model:" + JSON.stringify(model));
	uri = "/content/getPlaceHolders/";
	callback = updPlaceHolders;
	CallAPI_AJAX(uri, callback, model);
}

function getPlaceHolderTemplates(templateName) {
	//console.log("Inside getPlaceHolderTemplates...")
	var template = {};
	template.title = templateName;
	uri = "/content/getPlaceHolderTemplates/";
	callback = updPlaceHolderTemplates;
	CallAPI_AJAX(uri, callback, template);
}

function updPlaceHolderTemplates(data) {
	//console.log("Inside updPlaceHolderTemplates..");
	//console.log(data.length);
	
	data = data.match(/__(.*?)__/g);
	if (data != null || data != undefined) {
		$(".static-placeholder").remove();
		//console.log("Inside PlaceHolder Templates.. Before Sort.");
		//console.log(data);
		//console.log("After Sort..");
		//console.log(data.sort());
		data = data.sort();
		//console.log(data);
		$.each(data, function (i, obj) {
			//console.log(obj);
			title = $.trim(obj.replace(/_/g, ' '));
			
			$(".menu-placeholder-label").before(`<div class="form-group  col-md-6 static-placeholder">	
				<label for="${title}">${title}</label>	
				<input type="text" class="form-control static-placeholder-fld" id="${title}"   required />	
				</div>`);
		});
	}
	stopLoader();

}



function updPlaceHolders(data) {
	//console.log("Inside updPlaceHolders...");
	//console.log(data.length);
	if (!isEmpty(JSON.parse(data))) {
		data = JSON.parse(data);
		
		$(".static-placeholder").remove();
		$.each(data, function (i, obj) {
			obj.title = $.trim(obj.title.replace(/_/g, ' '));
		
			$(".menu-placeholder-label").before(`<div class="form-group  col-md-6 static-placeholder">	
				<label for="${obj.title}">${obj.title}</label>	
				<input type="text" class="form-control static-placeholder-fld" id="${obj.title}" value="${obj.placeholder}" required />	
			</div>`);
		});
	}
	stopLoader();
}

function updReport(data) {
	//console.log("Inside UpdReport...");
	//console.log(data);
	
	data = JSON.parse(data);
	$("#menuReportId").val(data.id); //Sets Menu Report Id
	$("#reportId").val(data.reportId);
	$("#workspaceId").val(data.workspaceId);
	if (data.showTab == "Y") {
		$("#optshowtab").val(data.showTab);
		$("#optshowtab").prop("checked", true);
	}
	if (data.showFilter == "Y") {
		$("#optshowfilter").val(data.showFilter);
		$("#optshowfilter").prop("checked", true);
	}

	stopLoader();
}

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

$(".addMenu").click(function () {
	//console.log("Add Menu Clicked..");
	$("#no-selection").hide();
	$("#content-detail").removeClass("hidden");
	prepareContentFrm();
	

});

$("#delMenuContent").click(function () {	
	//console.log(userid);
	var menuURI=$("#menuURI").val();
	var menuId=$("#menuId").val();
	

	swal({
		title: "Are you sure?",
		text: "You want to delete!",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	  })
	  .then((willDelete) => {
		  if (willDelete) {
			var mb = new Object();
			mb.id=menuId;
			mb.uri=menuURI;
			mb.clientId=$("#menuSelectClient").val();

			if($("#contentType").val() == "STATIC"){
				mb.is_static_content='Y';
			}else{
				mb.is_static_content='N';
			}

			postURI = '/content/deleteContent';
			
				//ajax call to delete menu content.
				//console.log("Deleting Object...");
				//console.log(mb);
				startLoader();
				postAjax(postURI,mb,succMenuDel,errReportDel);
		} else {
		 
		}
	  });
	
	});

	
function succMenuDel(data){
	notify( "success");
	stopLoader();
	reload();
}
function errReportDel(data){
	notify("danger");
	stopLoader();
	//console.log("Faillure in report addition!!");
}

function URIValidator(){
	var clientId = $("#menuSelectClient").val();

	$("#frmMenuContent").validate({
		rules: {
			menuURI: {
				required: true,
				remote: {
					url: '/content/isURIAvailibleForClient/',
					type:"post",
					data: {
						clientId: function() {
						  return $("#menuSelectClient").val();
						}
					},
					
					},
				},
			},
		messages:{
			menuURI:{
				remote:$.validator.format("{0} URI is not available.")
			},
		},
		
	});
	$("#frmMenuContent").valid();
}

$("#menuLabel").blur(function(){
		//console.log($.trim($("#menuLabel").val()).replace(/ /g, '-').toLowerCase());
		//console.log($("#menuId").val());
		var menuId= $("#menuId").val();
		if(menuId==-1){
		$("#menuURI").val($.trim($("#menuLabel").val()).replace(/ /g, '-').toLowerCase());
		URIValidator();
	}
});


$("#menuURI").blur(function(){
	var menuId= $("#menuId").val();
	if(menuId==-1)
		URIValidator();
});

$("#saveMenuContent").click(function () {

	
	// Validate menuURI from that form.
	var menuId= $("#menuId").val();
	var menuURI = $("#menuURI").val();
	
	//console.log($("#menuSelectClient").val());
	if(menuId==-1){
		URIValidator();
	}
	

	var status = $("#frmMenuContent").valid();
	//console.log(status);
	var loaderMsg="";
	var notificationSuccMsg="";
	var notificationErrMsg="";
	setCheckedItems();
	var frm = $("#frmMenuContent").serializeObject();
	//console.log(frm);

	//console.log("Menu Parent:"+frm.menuParent);
	frm.contentType=$("#contentType").val();
	frm.menuParent=$("#menuParent").val();
	frm.menuIcon = $("#menuIcon").val();
	var URI = frm.menuURI;
	//console.log("Menu Parent:"+frm.menuParent);
	
	var clientId = $("#menuSelectClient").val();
	//console.log(frm);
	frm.optAccessControl=((frm.optAccessControl=='on' || frm.optAccessControl==true || frm.optAccessControl=='Y')?'Y':'N');
	frm.optIsMenu=((frm.optIsMenu=='on'||frm.optIsMenu==true || frm.optIsMenu=='Y')?'Y':'N');

	
	if(frm.seqNum=="" || frm.seqNum==undefined){
		frm.seqNum = 99;
	}//Create Menu Builder Object


	
	var mb = new Object();
	
	//menu.mm.client_id=frm.clientId;
	mb.id=frm.menuId;
	
	mb.uri=URI;
	mb.origURI = frm.menuOrigURI;
	mb.category=frm.menuLabel;
	mb.module_name=frm.menuLabel;
	mb.menu_icon = frm.menuIcon;
	mb.clientId = clientId;
	
	
	mb.is_access_controlled = frm.optAccessControl;
	var roleIds = [];
	$('#userRole option:selected').each(function(index,obj){
		roleIds.push(obj.value);
	});

	mb.roleIds=roleIds;
	mb.module_name=frm.menuLabel;
	mb.seqNo = frm.seqNum;
	mb.is_menu=frm.optIsMenu;
		
	if(frm.menuParent==undefined){
		mb.parent_module_id=0;	
	}
	else{
	mb.parent_module_id=frm.menuParent;
	}
	if(frm.contentType=="REPORT"){
		//console.log("Inside Report Model.........");
		mb.is_static_content='N';
		mb.staticContent=null;
		mb.static_content_template_id=0;
		var rm = new Object();
		rm.uri = URI;
		rm.clientId = clientId;
		rm.subtitle='T';
		rm.title='T'
		rm.workspaceId=frm.workspaceId;
		rm.reportId=frm.reportId;
		rm.id=frm.menuReportId;
		rm.origURI = frm.menuOrigURI;
	
		frm.optshowfilter=((frm.optshowfilter=='on' || frm.optshowfilter=='Y')?'Y':'N');
		frm.optshowtab=((frm.optshowtab=='on'|| frm.optshowtab=='Y')?'Y':'N');
	
		
	
		rm.showFilter=frm.optshowfilter;
		rm.showTab=frm.optshowtab;	
		mb.reportMenu=rm;
		postURI = '/content/addUpdMenuContent';
		succCb=succReportAdd;
		errCB=errReportAdd;
		if(status==true){
			startLoader(loaderMsg);
			postAjax(postURI,mb,succCb,errCB);
			}
		if(mb.id==-1){
			loaderMsg='Adding Report Menu..';
			notificationSuccMsg='Report Added Successfully.';
			notificationErrMsg='Failuer in adding report!!!.';
		}else {
			loaderMsg='Updating Report Menu..';
			notificationSuccMsg='Report Updated Successfully.';
			notificationErrMsg='Failuer in updating report!!!.';
		} 
	}else  if(frm.contentType=="STATIC"){
		var staticPlaceHolders  = [];	
		mb.reportMenu=null;
		$(".static-placeholder-fld").each(function (i) {	
			var staticFieldObj = new Object();	
			staticFieldObj.placeholder=this.id;	
			staticFieldObj.placeholder_text=this.value;	
			staticFieldObj.client_id = mb.clientId;
			staticFieldObj.uri=mb.uri;
			staticFieldObj.placeholder = $.trim(staticFieldObj.placeholder.replace(/ /g, '_'));
			staticFieldObj.placeholder='__'+staticFieldObj.placeholder+'__';
			staticPlaceHolders[i] = staticFieldObj;	
		});	
		
		mb.staticContent=staticPlaceHolders;
		mb.is_static_content='Y';
		mb.static_content_template_id=$("#staticTemplate").val();
		postURI = '/content/addUpdMenuContent';
		succCb=succStaticAdd;
		errCB=errStaticAdd;
		if(status==true){
			startLoader(loaderMsg);
			postAjax(postURI,mb,succCb,errCB);
			}
		if(mb.id==-1){
			loaderMsg='Adding Staic Menu..';
			notificationSuccMsg='Static Content Added Successfully.';
			notificationErrMsg='Failuer in adding report!!!.';
		}else{
			loaderMsg='Updating Static Menu..';
			notificationSuccMsg='statc Updated Successfully.';
			notificationErrMsg='static in updating report!!!.';
		} 
	}
	
	
		
	//console.log(filtersArr);	
	//console.log("Status:"+status);
	mb.staticMenu = staticPlaceHolders;
	
	

	//console.log(mb);

});	

function succReportAdd(data,notificationSuccMsg,notificationErrMsg){
	//console.log("Inside succReportAdd..")
	notify(notificationSuccMsg, "success");
	stopLoader();
	reload();
	//console.log("Report Added Successfully..");
}
function errReportAdd(data){
	notify(notificationErrMsg, "danger");
	stopLoader();
	//console.log("Faillure in report addition!!");
}


function succStaticAdd(data,notificationSuccMsg,notificationErrMsg){
	//console.log("Inside  static sucess add..")
	notify(notificationSuccMsg, "success");
	stopLoader();
	reload();
	//console.log("Report Added Successfully..");
}
function errStaticAdd(data){
	notify(notificationErrMsg, "danger");
	stopLoader();
	//console.log("Faillure in static addition!!");
}

$('#contentType').on('change', function () {
	//console.log("Content Type");
	//console.log($("#contentType").val());
	resetContentFrm();
	
});

function resetContentFrm(){
	startLoader('Loading..');
	if ($("#contentType").val() == "STATIC") {
		showHideElement("reportArea", "hide");

		showHideElement("static-content-area", "show");
		//console.log("Static Template Value:");
		//console.log($("#staticTemplate").val());
		var templateName = $("#staticTemplate").val();
		getPlaceHolderTemplates(templateName);
		$("#optIsHome").prop('disabled', false);

	}
	if ($("#contentType").val() == "REPORT") {
		showHideElement("static-content-area", "hide");
		var data = new Object();
		data.reportId = "";
		data.workspaceId = "";
		data.showTab = "N";
		data.showFilter = "";
		updReport(JSON.stringify(data));
		$("#optIsHome").prop('disabled', true);
		showHideElement("reportArea", "show");
	}
}

$('#staticTemplate').on('change', function () {
	var newTemplateName =  $("#staticTemplate").val();
	var staticTemplate= $("#hiddenStaticTemplate").val();
	//console.log("Old Template Name:"+staticTemplate+" New Template Name:"+newTemplateName);
	startLoader('Loading..');
	var menuURI=$("#menuURI").val();
	var clientId = $("#menuSelectClient").val();
	//console.log("Menu URI:"+menuURI + " Client ID:"+clientId);
	if(staticTemplate===newTemplateName){
		getPlaceHolders(clientId,menuURI);
	}else{
		getPlaceHolderTemplates(newTemplateName);
	}
	
	
});

$('#optIsHome').on('change', function () {
	if($('#optIsHome').is(':checked')){
		$("#seqNum").val('0');
		$("#seqNum").attr('readonly', true);
	}
	else{
	$("#seqNum").val('');
	$("#seqNum").attr('readonly', false);
	}
});

function setCheckedItems(){
	if($('#optIsHome').is(':checked')){
		$("#optIsHome").val("Y");
	}else{
		$("#optIsHome").val("N");
	}
	if($('#optIsMenu').is(':checked')){
		$("#optIsMenu").val("Y");
	}else{
		$("#optIsMenu").val("N");
	}
	if($('#optAccessControl').is(':checked')){
		$("#optAccessControl").val("Y");
	}else{
		$("#optAccessControl").val("N");
	}
	if($('#optshowtab').is(':checked')){
		$("#optshowtab").val("Y");
	}else{
		$("#optshowtab").val("N");
	}
	if($('#optshowfilter').is(':checked')){
		$("#optshowfilter").val("Y");
	}else{
		$("#optshowfilter").val("N");
	}
	
}

function prepareContentFrm() {
	//console.log("Inside NewContentForm");
	$("#card-title").html('** New Menu');
	$("#addOrUpdMenuItem").trigger('reset');
	$("#menuLabel").val('');
	$("#menuURI").val('');
	$("#menuParent").selectpicker('val', "");
	$('#userRole').selectpicker('val', "");
	$("#menuId").val(-1);
	$("#contentType").selectpicker('val', "REPORT");
	$("#delMenuContent").prop('disabled', true);
	$("#contentType").prop('disabled', false);
	$("#menuURI").attr('readonly', false);
	$("#seqNum").val('1');
	$("#optIsHome").prop("checked", false);
	$("#optIsHome").prop('disabled', true);
	$("#optIsMenu").prop("checked", false);
	$("#optAccessControl").prop("checked", false);
	$("#optshowtab").prop("checked", false);
	$("#optshowfilter").prop("checked", false);

	var selectedTreeNodes = $('#tree').treeview('getSelected');
	if(selectedTreeNodes.length>0)
	$('#tree').treeview('unselectNode',[selectedTreeNodes]);
	resetContentFrm();
}

function updateParentMenu(data) {
	
	$("#menuParent").selectpicker('val', data);

	//$("#menuParent").empty();
	
}


function updContentFrm(clientId, frm) {
	//console.log(frm);
	startLoader();
	//console.log("Inside Update Content Form");
	$("#no-selection").hide();
	$("#content-detail").removeClass("hidden");
	$("#card-title").html(frm.text);
	
	
	$("#menuLabel").val(frm.text);
	$("#menuURI").val(frm.uri);
	
	$("#menuURI").attr('readonly', true);
	$("#menuOrigURI").val(frm.uri);
	$("#menuId").val(frm.id);
	$("#seqNum").val(frm.menuSeqNo);
	if(frm.menuSeqNo=='0'){
		$("#optIsHome").prop("checked", true);
	}
	
	getRoleByMenuID(frm.id);
	updateParentMenu(frm.parentMenuId);
	
	if (frm.is_public == true) {
		$("#optAccessControl").val(frm.is_public);
		$("#optAccessControl").prop("checked", true);
	}else{
		$("#optAccessControl").val(frm.is_public);
		$("#optAccessControl").prop("checked", false);
	}
	if (frm.showMenu == 'Y') {
		//console.log("SHow Menu:"+frm.showMenu);
		$("#optIsMenu").val(frm.showMenu);
		$("#optIsMenu").prop("checked", true);
	}
	else{
		$("#optIsMenu").val(frm.showMenu);
		$("#optIsMenu").prop("checked", false);
	}
	
	if (frm.is_static == false) {
		$("#contentType").selectpicker('val', "REPORT");
		showHideElement("static-content-area", "hide");
		showHideElement("reportArea", "show");
		$("#optIsHome").prop('disabled', true);
		getReportDetails(clientId, frm.uri);

	} else {
		$("#contentType").selectpicker('val', "STATIC");
		$("#static-content-area").show();
		$("#reportArea").hide();
		$("#optIsHome").prop('disabled', false);
		$("#staticTemplate").selectpicker('val', frm.static_content_template_id);
		$("#hiddenStaticTemplate").val(frm.static_content_template_id);
		
		
		getPlaceHolders(clientId, frm.uri);
	}
	$("#contentType").prop('disabled', true);
	$("#delMenuContent").prop('disabled', false);
}
// Content Management Ends