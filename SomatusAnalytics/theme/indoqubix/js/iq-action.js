/**
 * Created by SChoudhary on 9/04/2018.
 */
function init_full_screen_height(element, type) {
	var height = $(window).height() - 100;
	if (type == 0)
		$(window).width() > 767 ? $(element).css("min-height", height) : $(element).css("height", "400px");
	else
		$(window).width() > 767 ? $(element).css("height", height) : $(element).css("height", "400px");
}

function getScreenHeight() {
	var screen = getWindowSize();
	return screen.height - 205;
}

function init_full_screen(status) {
	if (!status) {
		$('body').removeClass("full-screen");
		showHeaderFooter(true);
		$("#exit-full-screen").addClass('hidden');
		$("#enter-full-screen").removeClass('hidden');
		init_full_screen_height("#embedContainer", 1);
		return false;
	}

	$("#exit-full-screen").removeClass('hidden');
	$("#enter-full-screen").addClass('hidden');
	/** display full screen */
	$('body').addClass("full-screen");
	$(document).ready(function () {
		//When Mouse Is On Them
		$(".nav-block").mouseover(function () {
			//showHeaderFooter(true);
			
		});
		//When Mouse Leaves Them
		$(".nav-block").mouseout(function () {
			//showHeaderFooter(false);
		});

		$(".navbar-fixed-bottom").mouseover(function () {
			//showHeaderFooter(true);

		});
		//When Mouse Leaves Them
		$(".navbar-fixed-bottom").mouseout(function () {
			//showHeaderFooter(false);
		});

		$("#embedContainer").css("height", getWindowSize().height)
		

	});
	showHeaderFooter(false);
	/*setTimeout(function () {
		showHeaderFooter(false);
	}, 500);*/
}

function showHeaderFooter(display) {
	if (display) {
		$(".navbar-fixed-bottom").addClass("visible");
		$(".navbar-fixed-bottom").addClass("mouse-in");
		$(".nav-block").addClass("visible");
		$(".nav-block").addClass("mouse-in");
	} else {
		$(".navbar-fixed-bottom").removeClass("visible");
		$(".navbar-fixed-bottom").removeClass("mouse-in");
		$(".nav-block").removeClass("visible");
		$(".nav-block").removeClass("mouse-in");
	}
}
var report;
function init_power_bi_report() {


	// Get a reference to the embedded report HTML element
	var reportContainer = $('#embedContainer')[0];

	init_full_screen_height("#embedContainer", 1);

	
	if (config != "") {
		// Embed the report and display it within the div container.
		report = powerbi.embed(reportContainer, config);

		// Set the filter for the report.
		// Pay attention that setFilters receives an array.
		
	}

	
	/** Disable right click on iFrame */
	// window.frames["powerbi-frame"].document.oncontextmenu = function(){ return false; };
	//init_full_screen();

	$("#enter-full-screen").click(function () {
		init_full_screen(true);
		// Displays the report in full screen mode.
		//report.fullscreen();

	});

	$("#subscribe-report").click(function () {
		var reportURI = $("#download-reportURI").val();
		var reportTitle = $("#label-" + reportURI).html();
		rb_init_subscribe($("#download-reportURI").val(), reportTitle, "PBI");
		//notify("Report Subscribed Successfully", "success");
	});

	$("#exit-full-screen").click(function () {
		init_full_screen(false);
	});

	$("#btn-report-filters").click(function () {
		

		report.getPages()
			.then(function (pages) {
				// Retrieve active page.
				var activePage = pages.filter(function (page) {
					return page.isActive
				})[0];

				activePage.getFilters()
					.then(function (filters) {
						//console.log(filters);
						//alert(filters);
					})
					.catch(function (errors) {
						//console.log(errors);
					});
			})
			.catch(function (errors) {
				//console.log(errors);
			});
		/*report.print()
			.catch(function (errors) {
				Log.log(errors);
			}); */
	});

	$("#btn-download-pbi-report").click(function () {
	/** Open Download report popup */
		var reportURI = $("#download-reportURI").val();
		var reportTitle = $("#label-" + reportURI).html();
			

		rb_init_export($("#download-reportURI").val(), reportTitle,"PBI");
	});
}

function rb_init_subscribe(reportId, reportName, type = "SELF_SERVICE") {
	var reportType = $("#subscribedReportType").val();
	$("#already-subscribed-report").hide();
	
	var subscriptionRequest = {};
	subscriptionRequest.reportId = reportId;
	subscriptionRequest.reportType = reportType;

	$.ajax({
		type: 'POST',
		url: "/subscribe/getStatus/",
		async: true,
		data: JSON.stringify(subscriptionRequest),
		contentType: 'application/json;',
		success: function (data) {
			if(!(data==null || data.length === 0)){
				alreadySubscribed = true;
				var subscription = JSON.parse(data);
				var type = subscription.type;

				var freq = subscription.frequency;
				if (freq == "DAY")
					freq = "Daily";
				else if (freq == "MONTH")
					freq = "Monthly";
				else if (freq == "WEEK")
					freq = "Weekly";

				if (type == "LINK")
					type = "Online";
				else
					type = "Report as attachment on Email";
				
				var nextSchedule = getFormatedDate(subscription.next_schedule_date);
				$("#already-subscribed-report-text").html("Report is already subscribed - Frequency : " + freq + "(" + type + ")<br/> Next Schedule : " + nextSchedule);



				$("#already-subscribed-report").show();
			}
		},
		error: function (e) {
			notify("Error in checking, if report already exists", "danger");
		
		}
	});


	$("#subscribedReportId").val(reportId);
	var fileName = rb_get_file_name(reportName);

	$("#subscribedFileName").val(fileName);
	$("#subscribedReportDisplayName").val(reportName);

	$('#subscribeReportModel').modal('show');
	$("#subscribe-report-names").html(reportName);

	$("#subscribe-frequency").change(function () {
		var frequency = $("#subscribe-frequency option:selected").val();
		if (frequency == "DAY") {
			$("#inlineRadioFile").attr('disabled', true);
			$("#inlineRadioLink").prop('checked', true);
			$(".inlineRadioLink-block").removeClass("hidden");
			$(".inlineRadioFile-block").addClass("hidden");
			$("#subscribedReportDisplayName").removeAttr('disabled');
			$("#subscribedFileName").attr('disabled', true);
			$(".subscribe-frequency-weekday-block").addClass("hidden");
			$(".subscribe-frequency-monthday-block").addClass("hidden");

		} else {
			$("#inlineRadioFile").removeAttr('disabled');
			if (frequency == "WEEK") {
				$(".subscribe-frequency-weekday-block").removeClass("hidden");
				$(".subscribe-frequency-monthday-block").addClass("hidden");
			} else {
				$(".subscribe-frequency-weekday-block").addClass("hidden");
				$(".subscribe-frequency-monthday-block").removeClass("hidden");
			}
		}
	});

	$('input:radio[name="inlineRadioOptions"]').change(function () {
		$("#btn-subscribe-report").attr('disabled', true);

		if ($(this).val() == 'link') {
			$(".inlineRadioLink-block").removeClass("hidden");
			$(".inlineRadioFile-block").addClass("hidden");
			$("#subscribedReportDisplayName").removeAttr('disabled');
			$("#subscribedFileName").attr('disabled', true);
			if ($("#subscribedReportDisplayName").val().length > 5)
				$("#btn-subscribe-report").removeAttr('disabled');
			
		} else {
			$(".inlineRadioLink-block").addClass("hidden");
			$(".inlineRadioFile-block").removeClass("hidden");
			$("#subscribedReportDisplayName").attr('disabled', true);
			$("#subscribedFileName").removeAttr('disabled');
			
			if ($("#subscribedFileName").val().length > 5)
				$("#btn-subscribe-report").removeAttr('disabled');
		}
	});

	/*** Report Name **/
	$("#subscribedReportDisplayName")
		.keyup(function () {
			var tvalue = $(this).val();

			if (tvalue.length > 1) {
				if (tvalue.length > 30) {
					tvalue = tvalue.substring(0, 30).trim();
				}
				tvalue = tvalue.replace(/[ ]/g, " ");
				$(this).val(tvalue);

				$("#btn-subscribe-report").removeAttr("disabled");
			} else {
				$("#btn-subscribe-report").attr("disabled", true);
			}
		})
		.keyup();

	/** File Name Checking Button */
	$("#subscribedFileName")
		.keyup(function () {
			var tvalue = $(this).val();

			if (tvalue.length > 1) {
				if (tvalue.length > 30) {
					tvalue = tvalue.substring(0, 30).trim();
				}

				tvalue = tvalue.replace(/[ ]/g, "_");
				$(this).val(tvalue);

				$("#btn-subscribe-report").removeAttr("disabled");
			} else {
				$("#btn-subscribe-report").attr("disabled", true);
			}
		})
		.keyup();


	$("#btn-subscribe-report").on('click', function (e) {
		e.preventDefault();
		
		$('#subscribeReportModel').modal('hide');

		subscribeReportWithFileNameSubmit( "#display-reports-block");
	});
}

var subscribeReportWithFileNameSubmitRequest = false;
function subscribeReportWithFileNameSubmit(loading_element_id) {
	if (subscribeReportWithFileNameSubmitRequest)
		return;

	subscribeReportWithFileNameSubmitRequest = true;
	$(loading_element_id).waitMe();

	var reportId = $("#subscribedReportId").val();
	var reportType = $("#subscribedReportType").val();
	
	var subscriptionType = $("input[name='inlineRadioOptions']:checked").val();
	var fileName = "";
	if (subscriptionType == "link") {
		reportName = replace_special_char($("#subscribedReportDisplayName").val());
	} else {
		reportName = $("#subscribedFileName").val();
		/** Reupdate filename */
		if (reportName == NaN || reportName == "")
			reportName = rb_get_file_name(reportName);
	}

	$("#btn-subscribe-report").attr('disabled', true);

	var subscribeRequest = {};
	subscribeRequest.reportId = reportId;
	subscribeRequest.reportName = reportName;
	subscribeRequest.type = subscriptionType;
	subscribeRequest.frequency = $("#subscribe-frequency option:selected").val();
	subscribeRequest.reportType = reportType;
	
	if (subscribeRequest.frequency == "WEEK") {
		subscribeRequest.frequencyDay = $("#subscribe-frequency-weekday option:selected").val();
	} else if (subscribeRequest.frequency == "MONTH") {
		subscribeRequest.frequencyDay = $("#subscribe-frequency-monthday option:selected").val();

	} else {
		subscribeRequest.frequencyDay = 1;
	}

	$.ajax({
		type: 'POST',
		url: "/subscribe/report/",
		async: true,
		data: JSON.stringify(subscribeRequest),
		contentType: 'application/json;',
		success: function (data) {
			if (data == "SUCCESS")
				notify("Report Subscribed Successfully", "success");
			else {
				notify("Error in subscribing report, please try again", "danger");
				$("#btn-subscribe-report").removeAttr("disabled");
			}
			subscribeReportWithFileNameSubmitRequest = false;
			$(loading_element_id).waitMe('hide');
			
		},
		error: function (e) {
			notify("Error in subscribing report, please try again", "danger");
			$(loading_element_id).waitMe('hide');
			subscribeReportWithFileNameSubmitRequest = false;
		}
	})
}

function emailPBIReportWithFileName(reportURI, reportName, fileName, loading_element_id) {
	$(loading_element_id).waitMe();

	/** Reupdate filename */
	if (fileName == NaN || fileName == "")
		fileName = rb_get_file_name(reportName);

	var exportRequestModel = {};
	exportRequestModel.reportId = embedReportId;
	exportRequestModel.token = accessToken;
	exportRequestModel.reportName = fileName;
	exportRequestModel.reportURI = reportURI;



	$.ajax({
		type: 'POST',
		url: "/SI/emailReport/",
		async: true,
		data: JSON.stringify(exportRequestModel),
		contentType: 'application/json;',
		success: function (data) {

			notify("Request Submited Successfully", "success");
			$("#download-request-report-name").html(fileName);
			$('#downloadReportModelSuccess').modal('show');
			rb_DOWNLOAD_REPORT = false;
			$(loading_element_id).waitMe('hide');
			refreshNotifications(false);
		},
		error: function (e) {
			notify("Error in submitting report download request, please try again", "danger");
			rb_DOWNLOAD_REPORT = false;
			$(loading_element_id).waitMe('hide');
		}
	})
}

function initExport() {
	$("#btnSave").click(function () {

		//exportReport();
	});
}

/***************** function login ***********************/
function isADUser() {
	var emailId = $("#username").val();
	if (emailId.endsWith("somatus.com") )
		window.location = $("#ad-login").attr('href');
	else
		return false;
}
function init_login() {

	$("#username")
		.focusout(function () {
			isADUser();
		});

	var redirect = getUrlParameter("redirect");
	$("#redirect").val(redirect);

	loginValidator = $("#login-form").validate({
		rules: {
			username: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 8
			}
		},
		messages: {
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long"
			},
			username: "Please enter valid email Id"
		},
		submitHandler: function (form) {
			if (!isADUser()) {
				$('#btn-singin').prop('disabled', true);
				$("body").waitMe({
					effect: 'win8',
					text: 'Authenticating User<br/><br/>Please wait..',
					bg: 'rgba(255,255,255,0.9)',
					color: '#000',
					maxSize: '',
					source: 'img.svg',
					onClose: function () { }
				});
				form.submit();
			}
		}
	});

}

function init_change_password() {
	$('.pass_show').append('<span class="ptxt">Show</span>');
	$(document).on('click', '.pass_show .ptxt', function () {
		$(this).text($(this).text() == "Show" ? "Hide" : "Show");
		$(this).prev().attr('type', function (index, attr) { return attr == 'password' ? 'text' : 'password'; });
	});  


	/** Init Subscription form */

	resetPasswordValidator = $("#reset-password-form").validate({
		rules: {
			password: {
				required: true,
				minlength:8
			},
			newpassword: {
				required: true,
				minlength: 8
			},
			confirmpassword: {
				required: true,
				minlength: 8,
				equalTo: "#newpassword"
			}
		},
		messages: {
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long"
			},
			newpassword: {
				required: "Please provide new password",
				minlength: "Your password must be at least 8 characters long"
			},
			confirmpassword: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Please enter the same password as above"
			}
		},
		submitHandler: function (form) {

			$('#btn-singin').prop('disabled', true);
			$("body").waitMe({
				effect: 'win8',
				text: 'Updating<br/><br/>Please wait..',
				bg: 'rgba(255,255,255,0.9)',
				color: '#000',
				maxSize: '',
				source: 'img.svg',
				onClose: function () { }
			});
			form.submit();
		}
	});

	requestResetPasswordValidator = $("#request-reset-password-form").validate({
		rules: {
			newpassword: {
				required: true,
				minlength: 8
			},
			confirmpassword: {
				required: true,
				minlength: 8,
				equalTo: "#newpassword"
			}
		},
		messages: {
			
			newpassword: {
				required: "Please provide new password",
				minlength: "Your password must be at least 8 characters long"
			},
			confirmpassword: {
				required: "Please provide the same password as above",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Please enter the same password as above"
			}
		},
		submitHandler: function (form) {
			$("body").waitMe({
				effect: 'win8',
				text: 'Reseting<br/><br/>Please wait..',
				bg: 'rgba(255,255,255,0.9)',
				color: '#000',
				maxSize: '',
				source: 'img.svg',
				onClose: function () { }
			});
			form.submit();
		}
	});

	forgetPasswordValidator = $("#forget-password-form").validate({
		rules: {
			username: {
				required: true,
				email: true
			},
		},
		messages: {
			
			username: {
				required: "Please provide LoginId",

			},
			
		},
		submitHandler: function (form) {
			//console.log(form.loginId.value);
			$("#emailVerificationCode").val(randomString(16, '#aA'));
			//console.log(form.emailVerificationCode.value);
			$("body").waitMe({
				effect: 'win8',
				text: 'Reseting<br/><br/>Please wait..',
				bg: 'rgba(255,255,255,0.9)',
				color: '#000',
				maxSize: '',
				source: 'img.svg',
				onClose: function () { }
			});
			form.submit();
		}
	});

}

$("body").waitMe();
$(document).ready(function () {
	$("body").waitMe("hide");

	//Menu Selection
	contextPath = $(location).attr('pathname');
	if (contextPath == '/') {
		$('.menu-home').addClass("active");
	} else {
		/*var pathArray = contextPath.split('/');
		if (pathArray.length >= 2) {
			BASE_PATH = pathArray[1];
			contextPath = $('#' + BASE_PATH).attr('main-ref');

			$('#menu-' + contextPath).addClass("active");
		}
		*/

		var menuId = $(".content").attr("parent-menu");
		$('.menu-' + menuId).addClass("active");



	}

	

	/** Disable right click */
	$(this).bind("contextmenu", function (e) {
		//  e.preventDefault();
	});


	/** Init Report Subscription */
	init_report_issue();
});


var issueValidator;
function init_report_issue() {
	contextPath = location + "";
	var pathArray = contextPath.split('/');
	if (pathArray.length >= 2) {
		REPORT_URI = pathArray[3];

	}

	/** Check subscription Status **/


	/** Init Subscription form */

	issueValidator = $("#issueform").validate({
		rules: {
			email: {
				required: true
			}
		}
	});


	$("#issue-btn").click(function () {
		var status = $("#issueform").valid();
		if (status == true) {
			submitIssueRequest();
		}
	});

}


function init_home() {
	$("body").removeClass("page-bg");
	$(".content-block").click(function () {
		var href = $(this).attr('data-ref');
		document.location = href;
	});

	$(".content-block-icon").click(function () {
		var href = $(this).attr('data-ref');
		document.location = href;
	})
}

function submitIssueRequest() {
	var issueRequest = new Object();
	issueRequest.subject = $("#subject").val();
	issueRequest.report = $("#report").val();
	issueRequest.message = $("#message").val();
	issueRequest.email = $("#email").val();
	issueRequest.frequency = $("#frequency option:selected").val();

	issueRequest.frequencyOptions = "";
	$.ajax({
		type: 'POST',
		url: "/issue/report",
		async: true,
		data: JSON.stringify(issueRequest),
		contentType: 'application/json;',
		success: function (data) {
			if (data == "SUCCESS") {
				notify("Issue reported Successfully", "success");
				issueValidator.resetForm();
				$("#issueform").trigger("reset");
				$('#myModal').modal('hide');
			} else {
				notify(" Failed to report issue, please try again", "danger");
				
			}
		},
		error: function (e) {
			notify(" Failed to report issue, please try again", "danger");
			
		}

	})



}


/***************** Function : Data Table  ****************/
var selectedTable = "";
var REPORT_BUILDER_PREVIEW = false;
function init_report_builder_Config() {
	
	$('#configure-table-form input').on('change', function (event) {
		var newSelectedTable = $("#configure-table-form input[type='radio']:checked").val();
		if (selectedTable == newSelectedTable)
			return;
		else {
			selectedTable = newSelectedTable
			event.preventDefault();
			rb_load_table_cloumn(selectedTable);
		}
	});

	$(".btn-report-builder-step2").click(function (e) {
		if (REPORT_BUILDER_PREVIEW) return;
		$(".btn-report-builder-step2").attr("disabled", true);
		REPORT_BUILDER_PREVIEW = true;
		rb_step2();
	});

	
	
}

function rb_init_datatable_list() {
	$('#sel-reoport-all').click(function (event) {
		var status = false;
		if (this.checked)
			status = true;
		
		$(".select-report").each(function () {
			this.checked = status;
		});
	
		if (status)
			$("#btn-delete").removeAttr("disabled");
		else
			$("#btn-delete").attr("disabled", true);

	});

	$('.select-report').click(function (event) {
		rb_datatable_select();
	});



	$("#confirmDeleteText")
		.keyup(function () {
			var tvalue = $(this).val();
			if (tvalue == "yes") {
				$("#btn-delete-report").removeAttr("disabled");
			} else {
				$("#btn-delete-report").attr("disabled", true);
			}
		})
		.keyup();

	$(".btn-delete-report").on('click', function (e) {
		e.preventDefault();
		var reportId = $(this).attr("data-ref");
		$(".select-report").prop("checked", false);
		$("#select-report-" + reportId).prop("checked", true);
		var reportName = rb_getSelectedReportName();

		$("#selected-report-names").html(reportName);
		$('#deleteReportModel').modal('show');
		$("#confirmDeleteText").val("");
		$("#btn-delete-report").attr("disabled", true);

		return false;
	});
	
	$(".btn-delete-user").on('click', function (e) {
		e.preventDefault();
		var userid = $(this).attr("data-ref");
		
		
		swal({
			title: "Are you sure?",
			text: "You want to delete user!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		  })
		  .then((willDelete) => {
			  if (willDelete) {
				
					$("body").waitMe({
						effect: 'win8',
						text: 'Deleting User<br/><br/>Please wait..',
						bg: 'rgba(255,255,255,0.9)',
						color: '#000',
						maxSize: '',
						source: 'img.svg',
						onClose: function () { }
					});

					  $.ajax({
					  type: 'POST',
					  url: "/user/delete/"+userid,
					  async: true,
					  data: JSON.stringify(userid),
					  contentType: 'application/json;',
					  success: function (data) {
							  /* swal("User deleted successfully!", {
								  icon: "success",
							  }).then(()=>reload());	*/		
							  notify("User Deleted Successfully", "success");			  
							  reload();
					  },
					  error: function (e) {
						  //notify("User Addition Failed", "danger")
						  //console.log("User Deletion Failed" + e);
					  }

				  });
			} else {
			 
			}
		  });
		
		
	});

	$("#btn-delete-report").on('click', function (e) {
		e.preventDefault();
		rb_sendDeleteReportRequest();
		return false;
	});

	$("#btn-delete").on('click', function (e) {
		var reportName = rb_getSelectedReportName();
		
		$("#selected-report-names").html(reportName);
		$('#deleteReportModel').modal('show');
		$("#confirmDeleteText").val("");
		$("#btn-delete-report").attr("disabled", true);

	});

	$(".btn-export-excel").on('click', function (e) {
		var reportId = $(this).attr("data-ref");
		$(".select-report").prop("checked", false);
		$("#select-report-" + reportId).prop("checked", true);
		var reportName = rb_getSelectedReportName();

		rb_init_export(reportId, reportName);
		
		e.preventDefault();
		return false;

		/*e.preventDefault();
		var reportId = $(this).attr("data-ref");
		$(".select-report").prop("checked", false);
		$("#select-report-" + reportId).prop("checked", true);
		var reportName = rb_getSelectedReportName();

		
		downloadExcelReport(reportId, reportName, "#display-reports-list-block");*/
	});

	
}

function replace_special_char(reportName) {
	var fileName = reportName.replace(/&amp;/g, " ").replace(/[^a-zA-Z ]/g, "").trim().replace(/  /g, " ").replace(/  /g, " ").replace(/_amp_/g, " ");
	fileName = fileName.replace(/[ ]/g, " ");
	return fileName;
}


function rb_get_file_name(reportName) {
	var fileName = reportName.replace(/&amp;/g, " ").replace(/[^a-zA-Z ]/g, "").trim().replace(/  /g, " ").replace(/  /g, " ").replace(/_amp_/g, "_");

	if (fileName.length > 30) {
		fileName = fileName.substring(0, 30);
	}

	fileName = fileName.replace(/[ ]/g, "_");
	return fileName;
}

var rb_DOWNLOAD_REPORT = false;
function rb_init_export(reportId, reportName, type="SELF_SERVICE") {

	$("#selectedReportId").val(reportId);
	var fileName = rb_get_file_name(reportName);

	$("#downloadFileName").val(fileName);

	$('#downloadReportModel').modal('show');
	$("#download-report-names").html(reportName);


/** File Name Checking Button */
	$("#downloadFileName")
		.keyup(function () {
			var tvalue = $(this).val();
			
			if (tvalue.length > 1) {
				if (tvalue.length > 30) {
					tvalue = tvalue.substring(0, 30).trim();
				}

				tvalue = tvalue.replace(/[ ]/g, "_");
				$(this).val(tvalue);

				$("#btn-download-report").removeAttr("disabled");
			} else {
				$("#btn-download-report").attr("disabled", true);
			}
		})
		.keyup();


	$("#btn-download-report").on('click', function (e) {
		if (rb_DOWNLOAD_REPORT)
			return;

		rb_DOWNLOAD_REPORT = true;
		e.preventDefault();
		var reportId = $("#selectedReportId").val();
		
		var reportName = $("#download-report-names").html();
		var fileName = $("#downloadFileName").val();
		$('#downloadReportModel').modal('hide');

		if (type == "PBI")
			emailPBIReportWithFileName(reportId, reportName, fileName, "#display-reports-block");
		else
			emailExcelReportWithFileName(reportId, reportName, fileName, "#display-reports-block");
	});
}



function rb_sendDeleteReportRequest() {
	var reportName = rb_getSelectedReportName();
	/** Show Loading Screen */
	$("#display-reports-block").waitMe({
		effect: 'win8',
		text: '<b>Deleting "' + reportName + '" Reports</b><br/><br/> Please wait ....',
		bg: 'rgba(255,255,255,0.9)',
		color: '#083050',
		maxSize: '',
		source: 'img.svg'
	});

	$('#deleteReportModel').modal('hide');

	var reportIds = rb_getSelectedReportId();
	$.ajax({
		type: 'POST',
		url: "/reportbuilder/delete",
		async: true,
		data: JSON.stringify(reportIds),
		contentType: 'application/json;',
		success: function (data) {
			/** Hide Wait Me */
			
			if (data != "" || data != 0) {

				notify("Report Deleted Successfully", "success");

				setTimeout(function () {
					$("#display-reports-block").waitMe("hide");
					window.location.replace("/reportbuilder/list");

				}, 3000); 

				
			} else {
				notify("Error in deleting reports", "error");
			}
		},
		error: function (e) {
			notify("Error in deleting Reports", "danger");
			/** Hide Wait Me */
			$("#display-reports-block").waitMe("hide");


		}

	});
}

function rb_getSelectedReportId() {

	var reportId  = [];
	i = 0;
	$(".select-report").each(function () {
		if (this.checked) {
			reportId[i] = this.value;
			i++;
		}
			
	});
	return reportId;
}

function rb_getSelectedReportName() {
	var reportName = [];
	i = 0;
	$(".select-report").each(function () {
		if (this.checked) {
			reportId = this.value;

			reportName[i] = $("#report-name-" + reportId).html();
			i++;
		}

	});
	
	return reportName.join(", ");
}

function rb_datatable_select() {
	

	var select = false;
	var selectAllStatus = true;
	$(".select-report").each(function () {
		if (this.checked)
			select = true;
		if (!this.checked && selectAllStatus)
			selectAllStatus = false;
	});

	if(select)
		$("#btn-delete").removeAttr("disabled");
	else
		$("#btn-delete").attr("disabled", true);

	$('#sel-reoport-all').prop("checked", selectAllStatus);

	


}

function edit_report_builder_Config() {
		selectedTable = $("#selected_table_id").html();
	

		$("#table-column-selection").removeClass("hidden");
		

		var display_name = $("#table_dn_" + selectedTable).html();
		/** Show Loading Screen */
		$("#datatable-configuration-block").waitMe({
			effect: 'win8',
			text: 'Loading ' + display_name + ' detail, Please wait ....',
			bg: 'rgba(255,255,255,0.9)',
			color: '#083050',
			maxSize: '',
			source: 'img.svg'
		});

		/** Get Column Infor from the the server */
		var tableColRequest = new Object();
		tableColRequest.table_id = selectedTable;

		$.ajax({
			type: 'POST',
			url: "/reportbuilder/getTableColumn",
			async: true,
			data: JSON.stringify(tableColRequest),
			contentType: 'application/json;',
			success: function (data) {


				$("#table-column-selection").html(data);
				rb_initColumnsEvents();
				rb_editColumnsSelection();
				rb_editColumnsCondition();
				rb_editEvent();

			/** Disable Save and Save as button */
				$(".btn-report-builder-step2").attr("disabled", false);
				/** Hide Wait Me */
				$("#datatable-configuration-block").waitMe("hide");

			},
			error: function (e) {
				notify("Column Data Failed", "danger");
				/** Hide Wait Me */
				$("#datatable-configuration-block").waitMe("hide");

				$("#table-column-selection").html("Error in loading columns");
			}

		});




}

function rb_editEvent() {
	reportNameValidator = $("#reportBuilderSaveForm").validate({
		rules: {
			reportName: {
				required: true,
				minLength: 10
			}
		}
	});

	reportNameAsValidator = $("#reportBuilderSaveAsForm").validate({
		rules: {
			reportName: {
				required: true,
				minLength: 10
			}
		}
	});

	$('#btn-update-report').on('click', function (e) {
		e.preventDefault();
		var status = $("#reportBuilderSaveForm").valid();
		if (status == true) {
			selected_report_id = $("#selected_report_id").html();
			rb_saveReport(1, selected_report_id, $("#reportName").val());
		}
	});

	$('#btn-save-as-report').on('click', function (e) {
		e.preventDefault();
		var status = $("#reportBuilderSaveAsForm").valid();
		if (status == true) {
			rb_saveReport(0, 0,$("#reportAsName").val());
		}
	});
}
function rb_editColumnsSelection() {
	
	
	reportColumn.forEach(element => {
		
		rb_selectTableColumn(element.column, true);
		$("#col_name_" + element.column).val(element.display_name);
		$("#check_" + element.column).attr("checked", true);
		$("#row_" + element.column).addClass("text-primary");
	});
		



}

function rb_editColumnsCondition() {
	if (reportCondition == null || reportCondition == undefined || reportCondition== "")
		return;

	reportCondition.forEach(element => {
		
		
		$("#col_value_" + element.column).val(element.condition_value);
		//rb_setSelectedIndex($("#col_condition_" + element.column), element.condition_operator);
		var condition_operator = element.condition_operator;
		if (condition_operator == "EQUAL")
			condition_operator = "IN";
		else if (condition_operator == "NOT EQUAL TO")
			condition_operator = "NOT IN";
		$("#col_condition_" + element.column).val(condition_operator);
		$("#row_" + element.column).addClass("table-primary");
		
	});
}

function rb_setSelectedIndex(s, v) {
	for (var i = 0; i < s.options.length; i++) {
		if (s.options[i].value == v) {
			s.options[i].selected = true;
			return;
		}
	}
}





function rb_step2() {
	var tableObject = rb_getDataTableObject("");
	rb_preview_data(tableObject);
}


function rb_saveReport(is_update, report_id, reportName) {

	if (is_update == undefined)
		is_update = 0;


	if (report_id == undefined)
		report_id = 0;
	
	
	var tableObject = rb_getDataTableObject(reportName);
	tableObject.is_update = is_update;
	tableObject.report_id = report_id;
	
	rb_saveReportToServer(tableObject);
}

function rb_saveReportToServer(tableDef) {
	$("#datatable-configuration-block").waitMe();
	$.ajax({
		type: 'POST',
		url: "/reportbuilder/savereport",
		async: true,
		data: JSON.stringify(tableDef),
		contentType: 'application/json;',
		success: function (data) {
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");
			if (data != "" || data != 0) {

				notify("Report Saved Successfully", "success");

				window.location.replace("/reportbuilder/display/" + data);
			} else {
				notify("Error in saving report", "error");
			}
		},
		error: function (e) {
			notify("Error in Saving Report", "danger");
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");

			
		}

	});
}


function rb_getDataTableObject(report_name) {
	var table = new Object();
	table.columns = [];
	table.condition = [];

	if (report_name != "")
		table.report_name = report_name;

	table.table_name = $("#table_dn_" + selectedTable).html();
	table.table_id = selectedTable;
	$(".select-column").each(function () {
		if (this.checked) {

			column_name = this.value;

			var col = new Object();
			col.column = column_name;
			col.display_name = $("#col_name_" + column_name).val();


			table.columns.push(col);
			/** Get Column Infor from the the server */
			if ($("#col_value_" + column_name).val() != "") {
				var condition = new Object();
				condition.column = column_name;
				condition.condition_operator = $("#col_condition_" + column_name).val();
				condition.condition_value = $("#col_value_" + column_name).val();
				table.condition.push(condition);
			}
		}
	});
	return table;
}

function rb_preview_data(tableDef) {
	$.ajax({
		type: 'POST',
		url: "/reportbuilder/preview",
		async: true,
		data: JSON.stringify(tableDef),
		contentType: 'application/json;',
		success: function (data) {
			$("#report-preiew").removeClass("hidden");
			$("#report-builder-configure").addClass("hidden");
			$("#report-preiew").html(data);
			init_report_builder_preview();
			rb_initColumnsEvents();
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");
			

		},
		error: function (e) {
			notify("Column Data Failed", "danger");
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");

			$("#table-column-selection").html("Error in loading columns");
		}

	});
}

function rb_load_table_cloumn(table_id) {
	
	$("#table-column-selection").removeClass("hidden");
	$(".btn-report-builder-step2").attr("disabled", true);

	var display_name = $("#table_dn_" + table_id).html();
	/** Show Loading Screen */
	$("#datatable-configuration-block").waitMe({
		effect: 'win8',
		text: 'Loading ' + display_name + ' detail, Please wait ....',
		bg: 'rgba(255,255,255,0.9)',
		color: '#083050',
		maxSize: '',
		source: 'img.svg'
	});

/** Get Column Infor from the the server */
	var tableColRequest = new Object();
	tableColRequest.table_id = table_id;

	$.ajax({
		type: 'POST',
		url: "/reportbuilder/getTableColumn",
		async: true,
		data: JSON.stringify(tableColRequest),
		contentType: 'application/json;',
		success: function (data) {


			$("#table-column-selection").html(data);
			rb_initColumnsEvents();
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");

		},
		error: function (e) {
			notify("Column Data Failed", "danger");
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");

			$("#table-column-selection").html("Error in loading columns");
		}

	});

}

function rb_initColumnsEvents() {
	$('#select-all-cols').click(function (event) {
		if (this.checked) {
			rb_selectAllTableColumns(true);
		} else {
			rb_selectAllTableColumns(false);
		}


	});

	/** Load Columns */

	/** Init columns */
	$(".select-column").each(function () {
		rb_selectTableColumn(this.value, this.checked);
	});


	$('.select-column').click(function () {
		rb_selectTableColumn(this.value, this.checked);
	});

	
	$('.ui-weekdatepicker').datepicker({
		format: "yyyy-mm-dd",
		autoclose: true,
		todayHighlight: true
	});

	$('.look-up-date').click(function () {
		var column = $(this).attr("data-col");
		var isDisabled = $("#col_value_" + column).is(':disabled');
		if (!isDisabled) {
			$("#col_value_" + column).focus();
		}
	});

	$('.look-up-list').click(function () {
		var column = $(this).attr("data-col");
		var isDisabled = $("#col_value_"+column).is(':disabled');
		if (isDisabled) {
			notify("Please select column", "info");
		} else {
			rb_loadUniqueValue(column);
		}

		
	});

	$('#btn-save-report').click(function () {
		rb_selectValue();
	});
}

function rb_loadUniqueValue(column) {
	$("#datatable-configuration-block").waitMe();

	var tableObject = rb_getDataTableObject("");
	tableObject.listColumn = column;
	$.ajax({
		type: 'POST',
		url: "/reportbuilder/valueList",
		async: true,	
		data: JSON.stringify(tableObject),
		contentType: 'application/json;',
		success: function (data) {
			
			$("#value-list-result").html(data);
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");

			$('#valueList').modal('show');


		},
		error: function (e) {
			notify("Error in loadingvalues", "danger");
			/** Hide Wait Me */
			$("#datatable-configuration-block").waitMe("hide");

			
		}

	});

}

function rb_selectValue() {
	var column = $("#value-list-col").val();
	var value = "";
	$(".select-column-value").each(function () {
		if (this.checked) {
			if (value != "")
				value += ",";
			value += this.value;

		}
	});
	$("#col_value_" + column).val(value);
	$('#valueList').modal('hide');
}



function rb_selectTableColumn(id, status) {
	
	
	if (status) {
		$(".btn-report-builder-step2").removeAttr("disabled");
		$("#col_condition_" + id).removeAttr("disabled");
		$("#col_name_" + id).removeAttr("disabled");
		$("#col_value_" + id).removeAttr("disabled");
		$("#col_action_" + id).addClass("active");
		
	} else {
		$('#select-all-cols').prop("checked", false);
		$("#col_condition_" + id).attr("disabled", "disabled");
		$("#col_name_" + id).attr("disabled", "disabled");
		$("#col_value_" + id).attr("disabled", "disabled");
		$("#col_action_" + id).removeClass("active");
		
	}

	$(".btn-report-builder-step2").attr("disabled", "disabled");
	$(".select-column").each(function () {
		status = this.checked;
		if (status) {
			$(".btn-report-builder-step2").removeAttr("disabled");
		}
	});
}
function rb_selectAllTableColumns(status) {
	$(".select-column").each(function () {
		this.checked = status;
		rb_selectTableColumn(this.value, status);
	});
}

var INIT_DATATABLE = false;
function init_report_builder_preview() {
	if (INIT_DATATABLE) return;
	INIT_DATATABLE = true;

	/*var table = $('#data-table').DataTable(
		{

			"paging": true,
			"searching": true,
			"colReorder": true,
			scrollY: 'calc(100vh - 170px)',
			scrollX: true,
			scrollCollapse: true,
			
			"info": true,

		}
	);*/

	var windowsSize = getWindowSize();
	var height = getScreenHeight()-170;
	var config = {
		"searching": true,
		"colReorder": true,
		scrollY: height,
		scrollX: true,
		scrollCollapse: true,
		paging: true

	}

	var table = $('#data-table').DataTable(config);


	

	//table.columns.adjust().draw(false);

	$('#btn-report-builder-step1').on('click', function (e) {
		e.preventDefault();
		REPORT_BUILDER_PREVIEW = false;
		INIT_DATATABLE = false;
		$("#report-preiew").addClass("hidden");
		$("#report-builder-configure").removeClass("hidden");
		table.destroy();
	});;

	reportNameValidator = $("#reportBuilderSaveForm").validate({
		rules: {
			reportName: {
				required: true,
				minLength : 10
			}
		}
	});

	$('#btn-save-report').on('click', function (e) {
		e.preventDefault();
		var status = $("#reportBuilderSaveForm").valid();
		if (status == true) {
			rb_saveReport(0, 0,$("#reportName").val());
		}
		
		
	});

	$('a.toggle-vis').on('click', function (e) {
		e.preventDefault();

		// Get the column API object
		var column = table.column($(this).attr('data-column'));

		// Toggle the visibility
		column.visible(!column.visible());
	});

	$('#columnShowHide').on('change', function (e) {
		$("#report-preiew").waitMe();
		$("#columnShowHide option:not(:selected)").map(function (i, el) {

			// Get the column API object
			var column = table.column($(this).val());

			// Toggle the visibility
			if (column.visible()) {
				column.visible(false);
				hideWaitMe("report-preiew");
			}
		}).get();

		$("#columnShowHide :selected").map(function (i, el) {

			// Get the column API object
			var column = table.column($(this).val());
			// Toggle the visibility
			if (!column.visible()) {
				column.visible(true);
				hideWaitMe("report-preiew");
				
			}

		}).get();

		
	});

	$('.selectpicker').selectpicker();

}

function hideWaitMe(element) {
	setTimeout(function () {
		$("#" + element).waitMe("hide")

	}, 1000); 
}

function rb_init_datatable_display() {
	
/** ON Report Change */
	$("#display-reports-block").waitMe();


	$('#reports').on('change', function (e) {
		e.preventDefault();
		$("#display-reports-block").waitMe();
		window.location.replace("/reportbuilder/display/" + $(this).val());
	});

	$('#columnShowHide').on('change', function (e) {
		$("#display-reports-block").waitMe();
		$("#columnShowHide option:not(:selected)").map(function (i, el) {

			// Get the column API object
			var column = table.column($(this).val());

			// Toggle the visibility
			if (column.visible()) {
				column.visible(false);
				hideWaitMe("display-reports-block");
			}
		}).get();

		$("#columnShowHide :selected").map(function (i, el) {

			// Get the column API object
			var column = table.column($(this).val());
			// Toggle the visibility
			if (!column.visible()) {
				column.visible(true);
				hideWaitMe("display-reports-block");

			}

		}).get();


	});

	



	$('.selectpicker').selectpicker();


	/*var reportId = $("#reports").val();
	$.ajax({
		type: 'POST',
		url: "/reportbuilder/LoadData/" + reportId,
		async: true,
		contentType: 'application/json;',
		success: function (data) {


			//init_datatable_loadData(data);
			
			$("#display-reports-block").waitMe("hide");

		},
		error: function (e) {
			notify("Error in loading Report", "danger");
			
			$("#display-reports-block").waitMe("hide");

			$("#display-reports-block").html("Error in loading report");
		}

	});*/


	init_datatable_loadData2();

	

}
function init_datatable_loadData(rd) {
	var height = getScreenHeight() - 100;
	var rdJSON = JSON.parse(rd);
	$('#report-data-table').DataTable({
		serverSide: true,
		ordering: false,
	
		"searching": true,
		"colReorder": true,
		scrollY: 200,
		scrollX: true,
		scrollCollapse: true,
		"info": true,
		deferRender: true,
		ajax: function (data, callback, settings) {
			var out = rdJSON.data;

			/*for (var i = rd.data.start, ien = rd.data.start + rd.data.length; i < ien; i++) {
				out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5']);
			}*/

			setTimeout(function () {
				callback({
					draw: 1,
					data: out,
					recordsTotal: rdJSON.recordsTotal,
					recordsFiltered: rdJSON.recordsFiltered
				});
			}, 10);
		},
		
		scroller: {
			loadingIndicator: true
		}
	});

	
}

var DOWNLOAD_EXCEL = false;
function init_datatable_loadData2() {
	var height = getScreenHeight() - 100;

	var reportId = $("#reports").val();
	var config = {
		//"deferLoading": 30,
		"ajax": {
			"url": "/reportbuilder/LoadData/" + reportId,
			
		},
		dom: 'Bfrtip',
		buttons: [
			/*{
				extend: 'excel',
				footer: false,
				exportOptions: {
					columns: ':visible',
					format: {
						body: function (data, column, row) {
							var tempData = data.replace(/(\r\n|\n|\r)/gm, "");
							var dateRegEx = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
							if (dateRegEx.test(tempData)) {
								var m = tempData.match(dateRegEx);
								var responseDate = moment(formatDate).format('DD/MM/YYYY');
								return new Date(m[1], m[2], m[3]);
							}
							


							return tempData;
						}
					}
				}
			},*/
			{
				text: 'Excel',
				className:'buttons-excel buttons-html5',
				action: function (e, dt, node, config) {
					//downloadExcelReport(reportId, $("#display_report_name").html(), "#display-reports-block");

					rb_init_export(reportId, $("#display_report_name").html());
					
				}
			},
			
			{
				extend: 'copy',
				exportOptions: {
					columns: ':visible',
					format: {
						body: function (data, column, row) {
							var tempData = data.replace(/(\r\n|\n|\r)/gm, "");
							//if it is html, return the text of the html instead of html
							/*if (/[,]/.test(tempData)) {
								return tempData.replace(/,/g, ' ');
							} else {
							return tempData;
							}*/
							return tempData;
						}
					}
				}
			},
			{
				text: 'Edit Report',
				className: 'buttons-edit buttons-html5',
				action: function (e, dt, node, config) {
					$("#display-reports-block").waitMe();

					// Copy an array based DataTables' data to another element
					e.preventDefault();  //stop the browser from following
					window.location.href = "/reportbuilder/edit/" + reportId;

				}
			},
			{
				text: 'View Conditions',
				className: 'buttons-excel buttons-html5',
				action: function (e, dt, node, config) {
					$("#displayConditionModal").modal('show');
					//displayConditionModal
				}
			}


		]
		,
		deferRender: true,
		"paging": true,
		"searching": true,
		"colReorder": true,
		scrollY: height,
		scrollX: true,
		scrollCollapse: true,
		"info": true
		
	};

	table = $('#report-data-table').DataTable(config);
	$("#display-reports-block").waitMe("hide");
	$('a.toggle-vis').on('click', function (e) {
		e.preventDefault();

		// Get the column API object
		var column = table.column($(this).attr('data-column'));

		// Toggle the visibility
		column.visible(!column.visible());
	});
}

function init_datatable_loadData1() {
	if (INIT_DATATABLE) return;
	INIT_DATATABLE = true;

	var table = $('#data-table').DataTable(
		{
			dom: 'Bfrtip',
			buttons: [
				{
					extend: 'excelHtml5',
					footer: false,
					exportOptions: {
						columns: ':visible'
					}
				},
				{
					extend: 'copy',
					exportOptions: {
						columns: ':visible'
					}
				}
				

			]
			,
			deferRender: true,
			"paging": true,
			"searching": true,
			"colReorder": true,
			scrollY: 'calc(100vh - 170px)',
			scrollX: true,
			scrollCollapse: true,
			"info": true,

		}
	);

	$('a.toggle-vis').on('click', function (e) {
		e.preventDefault();

		// Get the column API object
		var column = table.column($(this).attr('data-column'));

		// Toggle the visibility
		column.visible(!column.visible());
	});

}

function emailExcelReportWithFileName(reportId, reportName, fileName, loading_element_id) {
	$(loading_element_id).waitMe();

	/** Reupdate filename */
	if (fileName == NaN || fileName == "")
		fileName = rb_get_file_name(reportName);

	$.ajax({
		type: 'GET',
		url: "/reportbuilder/emailDataExcel/" + reportId + "-" + fileName,
		async: true,
		contentType: 'application/json;',
		success: function (data) {
			
			notify("Request Submited Successfully", "success");
			$("#download-request-report-name").html(fileName);
			$('#downloadReportModelSuccess').modal('show');
			rb_DOWNLOAD_REPORT = false;
			$(loading_element_id).waitMe('hide');
			refreshNotifications(false);
		},
		error: function (e) {
			notify("Error in submitting report download request, please try again", "danger");
			rb_DOWNLOAD_REPORT = false;
			$(loading_element_id).waitMe('hide');
		}
	})
}

function downloadExcelReportWithFileName(reportId, reportName,fileName, loading_element_id) {
	$(loading_element_id).waitMe();

/** Reupdate filename */
	if (fileName== NaN || fileName == "")
	fileName = rb_get_file_name(reportName);

	var x = new XMLHttpRequest();
	x.open("GET", "/reportbuilder/exportDataExcel/" + reportId + "-" + fileName, true);
	x.responseType = 'blob';
	x.onload = function (e) {
		download(x.response, fileName + ".xlsx", "application/vnd.openxmlformats - officedocument.spreadsheetml.sheet");
		$(loading_element_id).waitMe('hide');
		rb_DOWNLOAD_REPORT = false;
	}
	x.send();
	//window.location.href = "/reportbuilder/exportDataExcel/" + reportId;
}


function downloadExcelReport(reportId,reportName, loading_element_id) {
	var fileName = rb_get_file_name(reportName);
	downloadExcelReportWithFileName(reportId, reportName, fileName, loading_element_id);

}


//Admin Functions

var userAdditionValidator;
userAdditionValidator = $("#newUsrFrm").validate({
	rules: {

		email: {
			required: true,
			email:true
		},
		mobile: {
			required: true
		},
	}
});

function prepareUsrModal(){
	//console.log("Inside prepareUsrModal");
	$("#newUsrFrm").trigger('reset');
	$("#userId").val(null);
	$("#email").prop('disabled',false);
	$("#loginType").prop('disabled',false);
	userAdditionValidator.resetForm();
	$("#addUsrFrm").trigger("reset");
	
	updClientFilters();
}

function updClientFilters(){
	//console.log("Inside updClientFilters");
	var clientId = $("#clientName").val();
	var userId = $("#userId").val();
	//console.log("Client ID:"+clientId);
	//console.log("UserID:"+userId);

	$('#reportFilters').html('<div class="report-filter-label"></div>');

	if(!isEmpty(userId) && !isEmpty(clientId)){
		getFilterMappings(userId,clientId);
	}
	else if(!isEmpty(clientId)){
		getClientFilters(clientId);
	}
	$('#filter-Region').each(function() {
        $(this).rules("add", 
            {
                required: true,
                messages: {
                    required: "Required*",
                  }
            });
	});
	
}

function getClientFilters(clientId){
	//console.log("getClientFilters");
	var clientFilters = {};
		clientFilters.clientId = clientId;
		$.ajax({
			type: 'POST',
			url: "/user/getClientFilters/",
			async: true,
			data: JSON.stringify(clientFilters),
			contentType: 'application/json;',
			success: function (data) {
				//console.log(data);
				if(!isEmpty(data)){
					
					var clientFilters = data.split(',');
					
					$.each(clientFilters,function(i,key){
						$(".report-filter-label").html("Report Filters");
						$(".report-filter-label").after(`<div class="form-group  col-md-6">
						<label for="filter-${key}">*${key}</label>
						<input type="text" class="form-control filterpair" name="filter-${key}" id="${key}" value="" required="required">
					</div>`);

					});

					$(".report-filter-label").addClass('alert alert-success');
					
				}
			},
			error: function (e) {
			//	notify("Error in checking, if report already exists", "danger");
				return null;
			}
		});
	}

	function getFilterMappings(userId,clientId){
	
		//console.log("Inside getFilterMapping..");
		var filterMappings = {};
			filterMappings.userId = userId;
			filterMappings.clientId = clientId;
		$.ajax({
				type: 'POST',
				url: "/user/getFilterMappings/",
				async: true,
				data: JSON.stringify(filterMappings),
				contentType: 'application/json;',
				success: function (data) {
					//console.log(data);
					if(!isEmpty(JSON.parse(data))){
					
						$.each(JSON.parse(data),function(i,obj){
							$(".report-filter-label").html("Report Filters");
							$(".report-filter-label").after(`<div class="form-group  col-md-6">
                            <label for="filter-${obj.filter_key}">*${obj.filter_key}</label>
                            <input type="text" class="form-control filterpair" id="${obj.filter_key}" value=${obj.filter_value} required="required">
                        </div>`);

						});

						$(".report-filter-label").addClass('alert alert-success');
						
					}else{
						getClientFilters(clientId);
					}
					
				},
				error: function (e) {
				//	notify("Error in checking, if report already exists", "danger");
				
				}
			});
		}

function isEmpty(obj){
	if(obj == null || obj.length === 0){
		return true;
	}else {
		return false;
	}
}

$("#add-user-btn").click(function () {
	var status = $("#newUsrFrm").valid();
	var usrId = $("#userId").val();
	var reqType = "";
	//console.log("UserID:"+usrId);
	
	if(usrId == null || usrId.length === 0){

		reqType = "ADD_USER";
	}
	else{
		reqType = "UPDATE_USER";
	}
	if (status == true)
		addUpdNewUserRequest(reqType);
	
});



function randomString(length, chars) {
	var mask = '';
	if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
	if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (chars.indexOf('#') > -1) mask += '0123456789';
	if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	var result = '';
	for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
	return result;
}

function reload() {
	window.location.reload();
}

function editUserModel(userId,email,loginType,clientName,clientId,mobile,displayName,roleId){
	userAdditionValidator.resetForm();

	$("#addUsrFrm").trigger("reset");

	$("#email").val(email);
	$("#email").prop('disabled',true);
	$("#loginType").val(loginType);
	$("#loginType").prop('disabled',true);
	$("#clientName").val(clientId);
	$("#mobile").val(mobile);
	$("#displayName").val(displayName);
	
//	$("#userRole").val(roleId);
	$("#userId").val(userId);
	//console.log("USERID:"+userId+" ClientID:"+clientId);
	updClientFilters();
	//getFilterMappings(userId,clientId);
	
}

function addUpdNewUserRequest(reqType) {
	var addUsrFrm = new Object();
	//console.log("RequestType:"+reqType);
	
	var ar = [];
	$('#userRole option:selected').each(function(index,valor){
		ar.push(valor.value);
	});
	//console.log(ar);

	if(reqType==="ADD_USER"){
		urlToPost = "/user/addUser";
		waitMeText = 'Adding User<br/><br/>Please wait..';
		usrPostFailMsg = 'User Addition Failed';
		usrPostSuccMsg = 'User Added Successfully';

		addUsrFrm.loginId = $("#email").val();
		addUsrFrm.loginType = $("#loginType").val();
		addUsrFrm.clientId = $("#clientName").val();
		addUsrFrm.roleId = $("#userRole").val();
		addUsrFrm.email = $("#email").val();
		addUsrFrm.mobile = $("#mobile").val();
		addUsrFrm.displayName = $("#displayName").val();
		addUsrFrm.isActive = 'N';
		addUsrFrm.isDeleted = 'N';
		addUsrFrm.isFirstTimeLogin = 'Y';
		addUsrFrm.emailVerificationCode = randomString(16, '#aA');
	}
	else if (reqType==="UPDATE_USER"){
		urlToPost = "/user/updateUser";
		waitMeText = 'Updating User<br/><br/>Please wait..';
		usrPostFailMsg = 'User Updation Failed';
		usrPostSuccMsg = 'User Updated Successfully';

		addUsrFrm.userId = $("#userId").val();
		addUsrFrm.loginId = $("#email").val();
		addUsrFrm.loginType = $("#loginType").val();
		addUsrFrm.clientId = $("#clientName").val();
		addUsrFrm.roleId = $("#userRole").val();
		addUsrFrm.email = $("#email").val();
		addUsrFrm.mobile = $("#mobile").val();
		addUsrFrm.displayName = $("#displayName").val();
	}

	
	var filtersArr  = [];
	
	$(".filterpair").each(function (i) {
		var filterPairObj = new Object();
		filterPairObj.filter_key=this.id;
		filterPairObj.filter_value=this.value;
		//console.log("Adding Filter Obj"+filterPairObj);
		//console.log("Array Position:"+i);
		filtersArr[i] = filterPairObj;
			
	});
	
	//console.log(filtersArr);

	addUsrFrm.filterMappings = filtersArr;

	$("#addOrUpdUsrModal").hide();

	$("body").waitMe({
		effect: 'win8',
		text: waitMeText,
		bg: 'rgba(255,255,255,0.9)',
		color: '#000',
		maxSize: '',
		source: 'img.svg',
		onClose: function () { }
	});
	
	$.ajax({
		type: 'POST',
		url: urlToPost,
		async: true,
		data: JSON.stringify(addUsrFrm),
		contentType: 'application/json;',
		success: function (data) {
			if (data == "SUCCESS") {
				notify(usrPostSuccMsg, "success");
				userAdditionValidator.resetForm();
				$("#addUsrFrm").trigger("reset");
				$('#addOrUpdUsrModal').modal('hide');
				reload();
			} else {
					notify(usrPostFailMsg, "danger");
					//console.log(usrPostFailMsg);
					$("body").waitMe("hide");
					$("#addOrUpdUsrModal").show();

			}
		},
		error: function (e) {
			notify(usrPostFailMsg, "danger")
			//console.log(usrPostFailMsg + e);
			$("body").waitMe("hide");
			$("#addOrUpdUsrModal").show();
		}

	});
	


}

/****************** End of Data Table *******************/

function getFormatedDate(date) {
	var d = new Date(date);
	var curr_day = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();

	curr_month++; // In js, first month is 0, not 1
	if (curr_day <= 9)
		curr_day = "0" + curr_day;
	if (curr_month <= 9)
		curr_month = "0" + curr_month;

	var curr_hour = d.getHours();
	if (curr_hour <= 9)
		curr_hour = "0" + curr_hour;

	var curr_min = d.getMinutes();
	if (curr_hour <= 9)
		curr_min = "0" + curr_min;
	var curr_sec = d.getSeconds();
	if (curr_sec <= 9)
		curr_sec = "0" + curr_sec;

	
	year_2d = curr_year.toString().substring(2, 4)

	var finalDate = curr_year + "-" + curr_month + "-" + curr_day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
	return finalDate;
}
