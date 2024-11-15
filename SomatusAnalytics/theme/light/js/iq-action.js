/**
 * Created by SChoudhary on 9/04/2018.
 */
$(document).ready(function () {
	//Menu Selection
	contextPath = $(location).attr('pathname');
	if (contextPath == '/') {
		$('.menu-home').addClass("active");
	} else {

		var menuId = $(".content").attr("parent-menu");
		$('.menu-' + menuId).addClass("active");
	}
	/** Disable right click */
	$(this).bind("contextmenu", function (e) {
		//  e.preventDefault();
	});

	/** Initialize Client Selection */
	initClient();
	  	 
});



/**
 * Common Functions
 */

function init_main_full_screen() {
	if ($("#embedContainer") != undefined)
		init_full_screen_height("#embedContainer", 1);
}



function init_full_screen_height(element, type) {
	var height = $(window).height() - 50;
	if (type == 0)
		$(window).width() > 767 ? $(element).css("min-height", height) : $(element).css("height", "400px");
	else
		$(window).width() > 767 ? $(element).css("height", height) : $(element).css("height", "400px");
}

function getScreenHeight() {
	var screen = getWindowSize();
	return screen.height - 205;
}

function getScreenWidth() {
	var screen = $("#display-reports-block").width();
	return screen;
}
// For Generic Enter & Exit Full Screen
function init_full_screen(status) {
	console.log("Initializing Full Screen..");
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
		$(".page-titles").removeClass("hidden");
		
	} else {
		$(".navbar-fixed-bottom").removeClass("visible");
		$(".navbar-fixed-bottom").removeClass("mouse-in");
		$(".nav-block").removeClass("visible");
		$(".nav-block").removeClass("mouse-in");
		$(".page-titles").addClass("hidden");
	}
}
var report;
var navigation_history = new Array();
var current_active_tab = "";
var back_active_tab = "";
var BI_FIRST_REPORT_DISPLAY = false;
var BI_BACK_CLICK = false;

function init_power_bi_filter() {
	var FILTER_PROV = [];
	filterCount = $("#filter-count").val();
	/** Digiti Regex */
	var reg = /^[0-9]*$/
	if (filterCount > 0) {
		for (i = 1; i <= filterCount; i++) {
				
			var filter = $("#filter_" + i);
			var filterValue = filter.html();
			/*if (filterValue.match(reg))
				filterValue = parseInt(filterValue);
			*/
			var filterObj = {
				$schema: "http://powerbi.com/product/schema#basic",
				filterType: 1,
				requireSingleSelection: false,
				target: {
					table: filter.attr('data-table'),
					column: filter.attr('data-column')
				},
				operator: "In",
				values: [filterValue]
			}
			FILTER_PROV[i - 1] = filterObj;

		}
		return FILTER_PROV;
	} else {
		return [];
    }
}

$("#enter-full-screen").click(function () {
	//$(".default-content").waitMe();
	//console.log("Starting Loader...");
	startLoader();
	;
	init_full_screen(true);
	//updateHandsOnSettings('height',getScreenHeight()+100);
	//updateHandsOnSettings('width', getScreenWidth() + 208);
	var screen = getWindowSize();
	//sleep(10000)
	//updateHandsOnSettingsSize(screen.height - 90, screen.width);
	//$(".default-content").waitMe("hide");
	$.wait(100, function () {
		updateHandsOnSettingsSize(screen.height - 90, screen.width);
	});
	
	
});

$("#exit-full-screen").click(function () {
	//$("#datatable-display-block-header").waitMe();
	startLoader();

	init_full_screen(false);
	//updateHandsOnSettings('height',getScreenHeight()-180);
	//updateHandsOnSettings('width', getScreenWidth() - 208);
	
//	$("#datatable-display-block-header").waitMe("hide");
	$.wait(100, function () {
		updateHandsOnSettingsSize(getScreenHeight() - 80, getScreenWidth() - 30);
	});

});

// add wait as $.wait() standalone and $(elem).wait() for animation chaining
(function ($) {

	$.wait = function (duration, completeCallback, target) {
		$target = $(target || '<queue />');
		return $target.delay(duration).queue(function (next) { completeCallback && completeCallback.call($target); next(); });
	}

	$.fn.wait = function (duration, completeCallback) {
		return $.wait.call(this, duration, completeCallback, this);
	};

})(jQuery);

function updateHandsOnSettingsSize(height, width) {
	//console.log("Inside update handsonsettings..Key:"+k+" Value:"+v);

	var $container = $("#datatable-display-block");
	var hot = $container.handsontable('getInstance');
	var settings = hot.getSettings();
	settings['height'] = height;
	settings['width'] = width;
	hot.updateSettings(settings);
	return true;
	//console.log(settings);
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

function updateHandsOnSettings(k,v){
	//console.log("Inside update handsonsettings..Key:"+k+" Value:"+v);
	
	var $container = $("#datatable-display-block");
	var hot = $container.handsontable('getInstance');
	var settings = hot.getSettings();
	settings[k]=v;
	hot.updateSettings(settings);
	//console.log(settings);
}

var REPORT_PAGES = [];
var REPORT_SELECTED_PAGE = "";

function init_power_bi_report() {
	// Get a reference to the embedded report HTML element
	var reportContainer = $('#embedContainer')[0];

	init_full_screen_height("#embedContainer", 1);

	FILTER_PROV = init_power_bi_filter();

		var config = {
			type: 'report',
			tokenType: models.TokenType.Embed,
			accessToken: accessToken,
			embedUrl: embedUrl,
			id: embedReportId,
			permissions: models.Permissions.All,
			filters: FILTER_PROV,
			settings: {
				filterPaneEnabled: showFilter,
				navContentPaneEnabled: showTab

			}
		};


	if (config != "") {
		$("#back-report-navigation").hide();
		//$(".sticky-nav-top").hide();
		// Embed the report and display it within the div container.
		report = powerbi.embed(reportContainer, config);

		

		// Set the filter for the report.
		// Pay attention that setFilters receives an array.
		//Get Active Page
		report.on('pageChanged', event => {
			

			if (!BI_FIRST_REPORT_DISPLAY) {
				BI_FIRST_REPORT_DISPLAY = true;
				current_active_tab = event.detail.newPage.name;
			} else {
				if (!BI_BACK_CLICK) {
					navigation_history.push(current_active_tab);
				} 
				BI_BACK_CLICK = false;
				current_active_tab = event.detail.newPage.name;
				
			}
			REPORT_SELECTED_PAGE = event.detail.newPage.displayName;

			if (navigation_history.length != 0) {
				$("#back-report-navigation").show();
				//$(".sticky-nav-top").show();
			}
		});
	}

	report.on("loaded", function () {
		console.log("Power BI loaded event executing");
		// Set REPORT_PAGES and current Page
		//REPORT_PAGES.totalPages = report.getPages();

		
		report.getPages()
			.then(function (pages) {
				// Retrieve  page.
				pages.forEach(function (page) {
					REPORT_PAGES.push(page);
				});

			});
	});

	$("#back-report-navigation").click(function () {
		if (BI_BACK_CLICK)
			return;
		back_active_tab = navigation_history.pop();
		const page1 = report.page(back_active_tab);
		page1.setActive();
		BI_BACK_CLICK = true;
		
		if (navigation_history.length == 0) {
			$("#back-report-navigation").hide();
			//$(".sticky-nav-top").hide();
		}
		//Set Report Pages & Current Page
		REPORT_PAGES.currentPage = page1;
	});

	
	
	

	$("#subscribe-report").click(function () {

		var reportURI = $("#download-reportURI").val();
		var reportTitle = $("#label-" + reportURI).html();
		var reportId = $("#download-reportURI").val();
		var reportType = $("#subscribedReportType").val();

	//	$(".select-report").prop("checked", false);
	//	$("#select-report-" + reportId).prop("checked", true);

		//$('input:radio[name="inlineRadioOptions"]').val('downloadReport');
		$('#inlineDownload').prop('checked',true);

		$(".report-subscription-section").addClass("hidden");
		$(".report-download-section").removeClass("hidden");

		console.log("Checking Report Schedule");
		var subscriptionRequest = {};
		subscriptionRequest.reportId = reportId;
		subscriptionRequest.reportType = reportType;
		$("#already-subscribed-report").hide();
		$.ajax({
			type: 'POST',
			url: "/subscribe/getStatus/",
			async: true,
			data: JSON.stringify(subscriptionRequest),
			contentType: 'application/json;',
			success: function (data) {
				if (!(data == null || data.length === 0)) {
					alreadySubscribed = true;
					var subscription = JSON.parse(data);
					if (subscription != null) {
						var type = subscription.type;

						var freq = subscription.frequency;
					}
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

		rb_init_subscribe(reportId, reportTitle, "PBI");
		//notify("Report Subscribed Successfully", "success");
	});


	$(window).resize(function () {
		init_full_screen(false);
	});

	/* $("#btn-report-filters").click(function () { */
		document.onkeyup = function (e) {
			if (e.ctrlKey && e.which == 73) {/**ctrl+i**/

				try {
					console.log("Report Filtrers");
					report.getFilters().then(function (filters) {
						console.log(filters);

					});


				}
				catch (errors) {
					Log.log(errors);
				}

			report.getPages()
				.then(function (pages) {
					// Retrieve active page.
					var activePage = pages.filter(function (page) {
						return page.isActive
					})[0];

					activePage.getFilters()
						.then(function (filters) {
							console.log(filters);
							//alert(filters);
						})
						.catch(function (errors) {
							console.error(errors);
						});
				})
				.catch(function (errors) {
					//console.log(errors);
				});
		} 
	};

	$("#btn-download-pbi-report").click(function () {
	/** Open Download report popup */
		var reportURI = $("#download-reportURI").val();
		var reportTitle = $("#label-" + reportURI).html();
			

		rb_init_export($("#download-reportURI").val(), reportTitle,"PBI");
	});
}

function rb_init_subscribe(reportId, reportName, type = "SELF_SERVICE") {
//	console.log("Inside rb_init_subscribe");
	var reportType = $("#subscribedReportType").val();
	


	$("#subscribedReportId").val(reportId);
	var fileName = rb_get_file_name(reportName);

	
	$("#downloadFileName").val(fileName);
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
	



	$("#subscribedFileName").val(fileName);
	$("#subscribedReportDisplayName").val(reportName);

	$('#subscribeReportModel').modal('show');
	$("#subscribe-report-names").html(reportName);


	$("#subscribe-frequency").change(function () {
		var frequency = $("#subscribe-frequency option:selected").val();
	//	console.log("Frequency:"+frequency);
		if (frequency == "DAY") {
			$(".frequency-div").addClass("col-md-12");
			$(".frequency-div").removeClass("col-md-6");

			//$("#inlineRadioLink").attr('disabled', true);
			//$("#inlineRadioFile").prop('checked', true);
			//$(".inlineRadioLink-block").removeClass("hidden");
			//$(".inlineRadioFile-block").addClass("hidden");
			$("#subscribedReportDisplayName").removeAttr('disabled');
			$("#subscribedFileName").attr('disabled', true);
			//$(".inlineRadioLink-block").removeClass('hidden');
			//$(".report-file-link-block").removeClass('hidden');

			$(".subscribe-frequency-monthday-block").addClass("hidden");
			$(".subscribe-frequency-weekday-block").addClass("hidden");
		
			

		} else {
			$(".frequency-div").addClass("col-md-6");
			$(".frequency-div").removeClass("col-md-12");
			
			//$("#inlineRadioFile").removeAttr('disabled');
			//$(".report-file-link-block").addClass('hidden');

			
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
			if ($("#subscribedReportDisplayName").val().length > 2)
				$("#btn-subscribe-report").removeAttr('disabled');
			
		} else {
			//$(".inlineRadioLink-block").addClass("hidden");
			//$(".inlineRadioFile-block").removeClass("hidden");
			$("#subscribedReportDisplayName").attr('disabled', true);
			$("#subscribedFileName").removeAttr('disabled');
			
			if ($("#subscribedFileName").val().length > 2)
				$("#btn-subscribe-report").removeAttr('disabled');
		}
	});

	$('input:radio[name="inlineRadioReportSelectionOptions"]').change(function () {
	//	console.log($(this).val());
	

		if ($(this).val().toUpperCase() == 'DOWNLOADREPORT') {
		
			$(".report-subscription-section").addClass("hidden");
			$(".report-download-section").removeClass("hidden");
			rb_init_export(reportId, reportName,"SELF_SERVICE");
		}else{
				
			$("#subscribe-frequency").val('DAY');
			$("#subscribe-frequency").selectpicker("refresh");
			//$(".report-file-link-block").removeClass('hidden');

			$(".frequency-div").addClass("col-md-12");
			$(".frequency-div").removeClass("col-md-6");
					
			$(".subscribe-frequency-monthday-block").addClass("hidden");
			$(".subscribe-frequency-weekday-block").addClass("hidden");
	
			$(".report-subscription-section").removeClass("hidden");
			$(".report-download-section").addClass("hidden");
			rb_init_subscribe(reportId, reportName, "SELF_SERVICE");
		
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

		var selectedOption = $('input[name="inlineRadioReportSelectionOptions"]:checked').val();
	//	console.log(selectedOption);

		if(selectedOption=="downloadReport"){
			if (rb_DOWNLOAD_REPORT)
			return;

			rb_DOWNLOAD_REPORT = true;
			e.preventDefault();
			var reportId = $("#subscribedReportId").val();

			var reportName = $("#subscribe-report-names").html();
			var fileName = $("#downloadFileName").val();
			$("#btn-download-report").prop("disabled", true);
			if (type == "PBI")
				emailPBIReportWithFileName(reportId, reportName, fileName, "#display-reports-block");
			else
				emailExcelReportWithFileName(reportId, reportName, fileName, "#display-reports-block");
			} else{
				subscribeReportWithFileNameSubmit( "#display-reports-block");

			}


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
	
//	var subscriptionType = $("input[name='inlineRadioOptions']:checked").val();
	var subscriptionType = "file";
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
			$("#btn-download-report").removeProp("disabled");
		},
		error: function (e) {
			notify("Error in submitting report download request, please try again", "danger");
			rb_DOWNLOAD_REPORT = false;
			$(loading_element_id).waitMe('hide');
			$("#btn-download-report").prop("disabled");
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
	/* Not Required for Provider Portal
	var emailId = $("#username").val();
	if (emailId.endsWith("somatus.com") )
		window.location = $("#ad-login").attr('href');
	else
		return false;
	*/
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
				$(".auth-form").waitMe({
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

	loginValidator = $("#login-otp-form").validate({
		rules: {
			otp: {
				required: true,
				number: true,
				maxlength:6
			}
		},
		messages: {
			otp: {
				required: "Please provide verification code",
				maxlength: "Maximum length of verification code is 6 digits"
			}
		},
		submitHandler: function (form) {
			$('#btn-otp-confirm').prop('disabled', true);
			$(".auth-form").waitMe({
					effect: 'win8',
					text: 'Validating verification code<br/><br/>Please wait..',
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

$('#resend2fcode').click(function(){
	$(".auth-form").waitMe({
		effect: 'win8',
		text: 'Resending verification code to your registered email<br/><br/>Please wait..',
		bg: 'rgba(255,255,255,0.9)',
		color: '#000',
		maxSize: '',
		source: 'img.svg',
		onClose: function () { }
	});
});

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
				minlength:8,
				pwcheck:true
			},
			newpassword: {
				required: true,
				minlength: 8,
				pwcheck:true
			},
			confirmpassword: {
				required: true,
				minlength: 8,
				equalTo: "#newpassword",
				pwcheck:true
			}
		},
		messages: {
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long",
				pwcheck: "Your password must contain at least one special character, upper case letter and a number"
			},
			newpassword: {
				required: "Please provide new password",
				minlength: "Your password must be at least 8 characters long",
				pwcheck: "Your password must contain at least one special character, upper case letter and a number"
			},
			confirmpassword: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Please enter the same password as above",
				pwcheck: "Your password must contain at least one special character, upper case letter and a number"
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
				minlength: 8,
				pwcheck:true
			},
			confirmpassword: {
				required: true,
				minlength: 8,
				equalTo: "#newpassword",
				pwcheck:true
			}
		},
		messages: {
			
			newpassword: {
				required: "Please provide new password",
				minlength: "Your password must be at least 8 characters long",
				pwcheck:"Password must contain at least one special character, upper case letter and a number."
			},
			confirmpassword: {
				required: "Please enter the same password as above",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Please enter the same password as above",
				pwcheck:"Password must contain at least one special character, upper case letter and a number."
			}
		},
		submitHandler: function (form) {
			$(".auth-form").waitMe({
				effect: 'win8',
				text: 'Setting new password<br/><br/>Please wait..',
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
			loginId: {
				required: true,
				email: true
			},
		},
		messages: {
			
			loginId: {
				required: "Please enter registered email id.",

			},
			
		},
		submitHandler: function (form) {
			//console.log(form.loginId.value);
			//$("#emailVerificationCode").val(randomString(16, '#aA'));
			//console.log(form.emailVerificationCode.value);
			$(".auth-form").waitMe({
				effect: 'win8',
				text: 'Sending verification link to set new password on your email.<br/><br/>Please wait..',
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

function init_pdf_preview() {
	var height = getScreenHeight() - 100;
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

	$(".subscribe-report").click(function () {
		//var reportURI = $("#download-reportURI").val();
		//var reportTitle = $("#label-" + reportURI).html();

	//	console.log("subscribe");
		var reportId = $(this).attr("data-ref");
		$(".select-report").prop("checked", false);
		$("#select-report-" + reportId).prop("checked", true);
		var reportTitle = rb_getSelectedReportName();
		var reportName= rb_getSelectedReportName();
		var reportType = $("#subscribedReportType").val();
		// Hide Subscribe option and show download option.
		// Default Set to Download Report..

		//$('input:radio[name="inlineRadioOptions"]').val('downloadReport');
		$('#inlineDownload').prop('checked',true);

		$(".report-subscription-section").addClass("hidden");
		$(".report-download-section").removeClass("hidden");


		var subscriptionRequest = {};
		subscriptionRequest.reportId = reportId;
		subscriptionRequest.reportType = reportType;

		$("#already-subscribed-report").hide();
		$.ajax({
			type: 'POST',
			url: "/subscribe/getStatus/",
			async: true,
			data: JSON.stringify(subscriptionRequest),
			contentType: 'application/json;',
			success: function (data) {
				if (!(data == null || data.length === 0)) {
					alreadySubscribed = true;
					var subscription = JSON.parse(data);
					if (subscription != null) {
						var type = subscription.type;

						var freq = subscription.frequency;
					}
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


	 //	rb_init_export(reportId, reportName,"SELF_SERVICE");
	 	rb_init_subscribe(reportId, reportTitle, "SELF_SERVICE");
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

		//$('input:radio[name="inlineRadioOptions"]').val('downloadReport');
		$('#inlineDownload').prop('checked',true);

		$(".report-subscription-section").addClass("hidden");
		$(".report-download-section").removeClass("hidden");
		
		//rb_init_export(reportId, reportName,"SELF_SERVICE");
		rb_init_subscribe(reportId, reportName, "SELF_SERVICE");
		
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

//	console.log("Inside rb_init_export");
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
		$("#btn-download-report").prop("disabled", true);
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
				value += ";";
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
	var height = getScreenHeight()-220;
	var config = {
		"searching": false,
		"colReorder": true,
		scrollY: height,
		scrollX: true,
		scrollCollapse: true,
		paging: false

	}

	heightGrid = getScreenHeight() - 145;
	var data=$('#data-table tbody tr').map(function(tr){
        return [$(this).children().map(function(td){return $(this).text()}).get()]
        }).get();

	var colData=$('#data-table thead tr').map(function(tr){
		return $(this).children().map(function(td){return $(this).text()}).get()
		}).get();	

		$('#data-table').html("");
	var table =$('#data-table').handsontable({
		data:data,
		rowHeaders: true,
		colHeaders: colData,
		height: heightGrid,
		manualColumnResize: true,
		manualRowResize: true,
		dropdownMenu: true,
		filters: true,
		dropdownMenu: ['filter_by_condition', 'filter_action_bar', 'filter_by_value'],
		multiColumnSorting: true,
		renderAllRows:false,
		readOnly: true,
		licenseKey: 'a31b8-a2cc8-e8924-1420d-fdd2f'
		
	  });
	

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

	init_selfservice_handsontable();

}

function init_datatable_loadData(rd){
//console.log("Initialize...");
	var
  $$ = function(id) {
    return document.getElementById(id);
  },
  container = $$('#report-data-table'),
  autosave = $$('autosave'),
  load = $$('load'),
  save = $$('save'),
  autosaveNotification,
  hot;

  hot = new Handsontable(container, {
	startRows: 8,
	startCols: 6,
	rowHeaders: true,
	colHeaders: true,
	afterChange: function (change, source) {
	  if (source === 'loadData') {
		return; //don't save this change
	  }
	  if (!autosave.checked) {
		return;
	  }
	  clearTimeout(autosaveNotification);
	  ajax(rd, 'GET', JSON.stringify({data: change}), function (data) {
		exampleConsole.innerText  = 'Autosaved (' + change.length + ' ' + 'cell' + (change.length > 1 ? 's' : '') + ')';
		autosaveNotification = setTimeout(function() {
		  exampleConsole.innerText ='Changes will be autosaved';
		}, 1000);
	  });
	}
  });
}


function init_datatable_loadData(rd) {
	var height = getScreenHeight() - 100;
	var rdJSON = JSON.parse(rd);
	alert("Height" + height);
	$('#report-data-table').DataTable({
		serverSide: true,
		ordering: false,
	
		"searching": true,
		"colReorder": true,
		scrollY: height,


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
function init_selfservice_handsontable(){
	var $container = $("#datatable-display-block");
	var colHead=document.getElementById('handsontable-column-headers').innerHTML;
	var colHeadArr = colHead.split(",");
	//console.log(colHeadArr);
	//gte height
	heightGrid = getScreenHeight() - 75;

	$container.handsontable({
		rowHeaders: true,
		colHeaders: colHeadArr,
		height: heightGrid,
		manualColumnResize: true,
		manualRowResize: true,
		dropdownMenu: true,
		filters: true,
		dropdownMenu: ['filter_by_condition', 'filter_action_bar', 'filter_by_value'],
		multiColumnSorting: true,
		renderAllRows:false,
		readOnly: true,
		licenseKey: 'a31b8-a2cc8-e8924-1420d-fdd2f'
		
	  });


	var handsontable = $container.data('handsontable');
	
	
	var reportId = $("#reports").val();
	var totalRecords = "";
	var url='/reportbuilder/LoadData/' + reportId;
	$.ajax({
		url: url,
		dataType: 'json',
		type: 'GET',
		success: function (res) {
			handsontable.loadData(res.data);
		//	console.log(res.data.length);
			totalRecords = res.data.length;
			$("#noOfRecords").text("Total no. of records : "+res.data.length).formatDigits();
		$("#display-reports-block").waitMe("hide");
		}
	});

	var plugin = handsontable.getPlugin('AutoRowSize');

/*	handsontable.updateSettings({
		afterScrollVertically: function () {
			console.log('First visible row index ' + plugin.getFirstVisibleRow());
			console.log('Last visible row index ' + plugin.getLastVisibleRow());
		}
	}) */

	Handsontable.hooks.add('afterFilter', x => {
		var visibleRows = $container.handsontable('countRows');
		//	var $("#noOfRecords").text().split(":");
	
		$("#noOfRecords").text("Showing " + visibleRows+ " of " + totalRecords+" records").formatDigits();
	//	console.log(visibleRows);
	}, handsontable);

	Handsontable.hooks.add('afterRenderer', stopLoader, handsontable);

		

	  var excelHOTButton = document.getElementById('excelHOT');
	  var editReportHOTButton = document.getElementById('editReportHOT');
	  var vwCondHOTButton = document.getElementById('vwCondHOT');
	  console.log("VIew Condition Button");
	  
	  Handsontable.dom.addEvent(excelHOTButton, 'click', function () {
		rb_init_export(reportId, $("#display_report_name").html());
	  });

	 
	  Handsontable.dom.addEvent(vwCondHOTButton, 'click', function () {
		  console.log("View Condition Clicked!!");
		$("#displayConditionModal").modal('show');
	  });

	  Handsontable.dom.addEvent(editReportHOTButton, 'click', function () {
		window.location.href = "/reportbuilder/edit/" + reportId;
	  });


	

	
}

function init_datatable_loadData2_1() {
	var height = getScreenHeight() - 200;

	var reportId = $("#reports").val();
	var config = {
		//"deferLoading": 30,
		"ajax": {
			"url": "/reportbuilder/LoadData/" + reportId,
			
		},
		dom: 'Bfrtip',
		buttons: [
			{
				text: 'Excel',
				className:'buttons-excel buttons-html5',
				action: function (e, dt, node, config) {
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
		scrollY: height,
		scrollX: true,
		scrollCollapse: false,
		"info": true,
		scroller: true,
		"bAutoWidth": true,
		"bScrollAutoCss": true,
		"bProcessing": true,
		"bRetrieve": true,
		"bJQueryUI": true,
		
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

function init_user_datatable_list(){
	var height = getScreenHeight()-150;
	var config = {
		"searching": true,
		"colReorder": true,
		scrollY: height,
		scrollX: true,
		scrollCollapse: true,
		paging: true
	}

	var table = $('#user-data-table').DataTable(config);

	$("#addUsrButton").click(function () {
		prepareUsrModal();
	});
}

function prepareUsrModal () {
	//console.log("Inside prepareUsrModal");
	$("#newUsrFrm").trigger('reset');
	$("#userId").val(null);
	$("#email").prop('disabled',false);
	$("#loginType").prop('disabled',false);
	$("#loginType").selectpicker('val',"");
	$("#addUsrFrm").trigger("reset");
	$('#userRole').selectpicker('val', "");
	$('#clientName').selectpicker('val',"");
	$('#clientName').selectpicker('val',"");
	
	updClientFilters();
}

function getClientIds(){
	var clientIds = [];
	$('#clientName option:selected').each(function(index,obj){
		clientIds.push(obj.value);
	});
	return clientIds;
}

function getClientId(){
	var clientId=$("#defClientId").val(clientId);
	var clientIds = getClientIds();
	if(clientId==null||clientId==undefined|| $.inArray(clientId, clientIds) == -1 ){
	
		clientId=clientIds[0];
	}

	return clientId;
}

function updClientFilters(){	
	//console.log("Inside updClientFilters");

	var clientId=getClientId();
	

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
						$(".report-filter-label").html("<div class='badge badge-light'>USER BI REPORT FILTERS</div>");	
						$(".report-filter-label").after(`<div class="form-group col-md-6">	
						<label for="filter-${key}">*${key}</label>	
						<input type="text" class="form-control filterpair" name="filter-${key}" id="${key}" value="" required="required">	
					</div>`);	
					});	
					$(".report-filter-label").addClass('px-3 p-2 alert alert-light col-md-12');	
						
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
							$(".report-filter-label").html("<div class='badge badge-light'>USER BI REPORT FILTERS</div>");	
							$(".report-filter-label").after(`<div class="form-group  col-md-6">	
                            <label for="filter-${obj.filter_key}">*${obj.filter_key}</label>	
                            <input type="text" class="form-control filterpair" id="${obj.filter_key}" value="${obj.filter_value}" required="required">	
                        </div>`);	
						});	
						$(".report-filter-label").addClass('px-3 p-2 alert alert-light col-md-12');	
							
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
	

	var userAdditionValidator =  $("#newUsrFrm").validate({
		rules: {

			email: {
				required: true,
				email:true
			},
		 	mobile: {
				number: true
			}, 
		},
	 	messages: {
			mobile: {
				required: "Please provide mobile number",
				minlength: "Your mobile number must be at least 8 characters long"
			},
		}  
	});


	var usrId = $("#userId").val();
	var reqType = "";
	//console.log("UserID:"+usrId);
	
	if(usrId == null || usrId.length === 0){

		reqType = "ADD_USER";
	}
	else{
		reqType = "UPDATE_USER";
	}

	var status = $("#newUsrFrm").valid();
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

function deleteUser(userid) {		
	//console.log(userid);
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
	
}

function editUserModel(userId,email,loginType,clientName,clientId,mobile,displayName,role,clientIds){
	
	$("#addUsrFrm").trigger("reset");
	
	var userAdditionValidator = $( "#newUsrFrm" ).validate();
	
	userAdditionValidator.resetForm();

	$("#email").val(email);
	$("#email").prop('disabled',true);
	//console.log($("#loginType").val());
	$("#loginType").selectpicker('val', loginType);
	$("#loginType").prop('disabled',true);
	$("#defClientId").val(clientId); //DefaultClient
	$("#mobile").val(mobile);
	$("#displayName").val($("#" + displayName).val()); 

	
	$('#userRole').selectpicker('val', role.split(","));
	$('#clientName').selectpicker('val', clientIds.split(","));

	$("#userId").val(userId);
	updClientFilters();
	
}

function addUpdNewUserRequest(reqType) {
	var addUsrFrm = new Object();
	//console.log("RequestType:"+reqType);
	
	var roleIds = [];
	$('#userRole option:selected').each(function(index,obj){
		roleIds.push(obj.value);
	});

	var clientIds =  getClientIds();
	var clientId = getClientId();

	//console.log(clientIds);
	var userAdditionValidator = $( "#newUsrFrm" ).validate();
	userAdditionValidator.resetForm();
	if(reqType==="ADD_USER"){
		urlToPost = "/user/addUser";
		waitMeText = 'Adding User<br/><br/>Please wait..';
		usrPostFailMsg = 'User Addition Failed';
		usrPostSuccMsg = 'User Added Successfully';

		addUsrFrm.loginId = $("#email").val();
		addUsrFrm.loginType = $("#loginType").val();
		addUsrFrm.clientId = clientId;
		addUsrFrm.clientIds = clientIds;
		addUsrFrm.roleIds = roleIds;
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
		addUsrFrm.clientId = clientId;
		addUsrFrm.clientIds = clientIds;
		addUsrFrm.roleIds = roleIds;
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
			//console.log(data);
			if (data == "SUCCESS") {
				notify(usrPostSuccMsg, "success");
				userAdditionValidator.resetForm();
				$("#addUsrFrm").trigger("reset");
				$('#addOrUpdUsrModal').modal('hide');
				reload();
			} else if(data=="EXIST_FAIL") {
				notify("User already exists!!", "danger");
				//console.log(usrPostFailMsg);
				$("body").waitMe("hide");
				$("#addOrUpdUsrModal").show();

		}else {
			notify(usrPostFailMsg, "danger");
		//	console.log("Inside Else...");
			$("body").waitMe("hide");
			$("#addOrUpdUsrModal").show();

	}
		},
		error: function (e) {
			notify(usrPostFailMsg, "danger")
		//	console.log(usrPostFailMsg + e);
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


	function CallAPI_AJAX(uri,callback,data){

		$.ajax({	
			type: 'POST',	
			url: uri,	
			async: true,	
			data: JSON.stringify(data),	
			contentType: 'application/json;',	
			success: callback,	
			error: function (e) {	
			//	notify("Error in checking, if report already exists", "danger");	
			stopLoader();
			}	
		});	
		
	}



function initClient() {
	$(".set-default-client").click(function () {
		var clientId = $(this).attr('data-ref');
		var msg = 'Setting default client for User<br/><br/>Please wait..';
		//console.log("Setting default client" + clientId);
		succCb = successDefaultClient;
		errCB = errorDefaultClient;

		setClient(clientId, "DEFAULT", msg, succCb, errCB);
	});
	$(".change-client").click(function () {
		var clientId = $(this).attr('data-ref');
		var msg = 'Changing client <br/><br/>Please wait..';
		succCb = successChangeClient;
		errCB = errorChangeClient;
		setClient(clientId, "SELECT", msg, succCb, errCB );
	});
}


function setClient(clientId, type, msg, succCb, errCB ) {
	//METHOD TYPE: DEFAULT
	
	var obj = new Object();
	obj.clientId=clientId;
	obj.clientDomain = type; // Method Type 
	uri = "/user/updateclient";
	
	waitMeText = msg;
	$("body").waitMe({
		effect: 'win8',
		text: waitMeText,
		bg: 'rgba(255,255,255,0.9)',
		color: '#000',
		maxSize: '',
		source: 'img.svg',
		onClose: function () { }
	});
	postAjax(uri,obj,succCb,errCB);
}

function successDefaultClient(data){
	notify("Successfully Update", "success");
	$("body").waitMe("hide");
	reload();
}

function errorDefaultClient(e){
	notify("Update failed!!, please try again", "danger")
	$("body").waitMe("hide");
}

function successChangeClient(data) {
	//console.log(data);
	window.location = "/";
}

function errorChangeClient(e) {
	notify("Update failed!!, please try again", "danger")
	$("body").waitMe("hide");
}

//Common Function for Ajax Call

function postAjax(uri,obj,succCb,errCB){

	$.ajax({	
		type: 'POST',	
		url: uri,	
		async: true,	
		data: JSON.stringify(obj),	
		contentType: 'application/json;',	
		success: succCb,	
		error: errCB
	});	
	
}


$("#contactUsModel").on('show.bs.modal', event => {

	let pages = REPORT_PAGES;
	var pageOptions = [];

	pages.forEach(function (page) {
		if (REPORT_SELECTED_PAGE == page)
			pageOptions.push('<option value="' + page.displayName + ' selected">' + page.displayName + '</option>');
		else
			pageOptions.push('<option value="' + page.displayName + '">' + page.displayName + '</option>');
		
	})
	$('#contactReport').html(pageOptions.join(''));
	$('#contactReport').selectpicker('refresh');
	$('#contactReport').selectpicker('val', REPORT_SELECTED_PAGE);

}) 



//Contact Us
$("#btn-contact-us").click(function () {
	console.log("Clicked...");
	var contactUsForm = new Object();
	urlToPost = "/contact/contactUs";
	contactUsForm.report = $("#contactReport").val();
	contactUsForm.subject = $("#contactSubject").val();
	contactUsForm.comments = $("#contactComments").val();


	
	var contactUsValidator =  $("#contactUsForm").validate({
		rules: {
			contactReport: {
				required: true
			},
			contactSubject: {
				required: true
			},
			contactComments: {
				required: true
			} 
		},
	 	messages: {
			contactReport: {
				required: "Please provide report name",
			},
			contactSubject: {
				required: "Please provide subject/topic",
			},
			contactComments: {
				required: "Please enter comments",
			},
		}  
	});

	var status = $("#contactUsForm").valid();
	if (status != true){
		return false;
	}
	

	//$("#addOrUpdUsrModal").hide();


	$("body").waitMe({
		effect: 'win8',
		//text: "Please wait.",
		bg: 'rgba(255,255,255,0.9)',
		color: '#000',
		maxSize: '',
		source: 'img.svg',
		onClose: function () { }
	});
	console.log("Posting contact details");
	$.ajax({
		type: 'POST',
		url: urlToPost,
		async: true,
		data: JSON.stringify(contactUsForm),
		contentType: 'application/json;',
		success: function (data) {
			//console.log(data);
			if (data == "SUCCESS") {
				notify("Comments Submitted Successfully!","success");
				$("#contactUsForm").trigger("reset");
				$('#contactUsModel').modal('hide');
		//		reload();
				$("body").waitMe("hide");
			} else {
			notify("Error in submitting comments.","error");
			$("body").waitMe("hide");
			$("#contactUsModel").show();

		}
		},
		error: function (e) {
			notify("", "error")
		//	console.log(usrPostFailMsg + e);
			$("body").waitMe("hide");
			$("#contactUsModel").show();
		}

	});
	
});
