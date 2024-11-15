var boolean = ["Y", "N"];
var iq_core = function () {

	"use strict"



	var initSelect = function () {
		if ($.fn.select2) {
			$('.ui-select').select2({
				placeholder: "Select...", theme: 'bootstrap'
			})
		}
	}




	var initDatePicker = function () {
		if ($.fn.datepicker) {
			$('.ui-weekdatepicker').datepicker({
				autoclose: true
				, todayHighlight: true
			})
		}
	}

	var initPageActions = function () {
		getPageInitFunctionId();
	}


	var initSweetAlerts = function () {
		$('[data-type="confirm-alert"]').each(
			function () {
				var $this = $(this)
				var data_title = $this.attr("data-title");
				var data_text = $this.attr("data-text");
				var data_display_type = $this.attr("data-display-type");
				var data_confirmbtn_text = $this.attr("data-confirmbtn-text");
				var data_confirm_title = $this.attr("data-confirm-title");
				var data_confirm_text = $this.attr("data-confirm-text");


				$this.on('click', function (e) {
					swal({
						title: data_title,
						text: data_text,
						type: data_display_type,
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: data_confirmbtn_text,
						closeOnConfirm: false
					},
						function () {
							swal(data_confirm_title, data_confirm_text, "success");
						});
				});
			}
		)

		$('[data-type="message-alert"]').each(
			function () {
				var $this = $(this)
				var data_title = $this.attr("data-title");
				var data_text = $this.attr("data-text");
				var data_display_type = $this.attr("data-display-type");


				$this.on('click', function (e) {
					swal(data_title, data_text, data_display_type)
				});
			}
		)


		$('[data-type="request-confirm"]').each(
			function () {
				var $this = $(this)
				var data_title = $this.attr("data-title");
				var data_text = $this.attr("data-text");
				var data_display_type = $this.attr("data-display-type");
				var data_confirmbtn_text = $this.attr("data-confirmbtn-text");
				var data_confirm_title = $this.attr("data-confirm-title");
				var data_confirm_text = $this.attr("data-confirm-text");
				var request_url = $this.attr("data-request-url");
				var success_url = $this.attr("data-success-url");
				var data_error_text = $this.attr("data-error-text");

				$this.on('click', function (e) {
					swal({
						title: data_title,
						text: data_text,
						type: data_display_type,
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: data_confirmbtn_text,
						closeOnConfirm: false,
						showLoaderOnConfirm: true
					},
						function () {
							$.ajax({
								type: 'GET',
								url: request_url,
								async: true,

								dataType: 'json',
								success: function (data) {

									swal({
										title: data_confirm_title, text: data_confirm_text,
										type: "warning",
										confirmButtonColor: "#DD6B55",
										confirmButtonText: "OK",
										closeOnConfirm: true
									},
										function (isConfirm) {
											if (isConfirm) {
												window.location.href = success_url;
											}
										});
								},
								error: function (e) {
									swal("", data_error_text, "error");
									console.log(e.responseText);
								}

							})
							//swal(data_confirm_title, data_confirm_text, "success");
						});
				});
			});
	}

	var initAccordions = function () {
		$('.accordion-simple, .accordion-panel').each(function (i) {
			var accordion = $(this)
				, toggle = accordion.find('.accordion-toggle')
				, activePanel = accordion.find('.panel-collapse.in').parent()

			activePanel.addClass('is-open')

			toggle.prepend('<i class="fa accordion-caret"></i>')

			toggle.on('click', function (e) {
				var panel = $(this).parents('.panel')

				panel.toggleClass('is-open')
				panel.siblings().removeClass('is-open')
			})
		})
	}

	return {
		initDatePicker: initDatePicker(),
		initAccordions: initAccordions(),
		initSelect: initSelect(),
		initSweetAlerts: initSweetAlerts()
	}

}()

function loadHandOnTableData(metaurl, dataurl, table_id, meta_src_type) {
	//Get Meta Info by Script
	if (meta_src_type == "json") {
		$.getJSON("theme/indoqubix/configure/" + metaurl).done(function (metascript, textStatus) {
			//loadHandsOnTableData(meta,dataurl,table_id);
			loadHandsOnTableData(metascript.meta, dataurl, table_id);
		})
			.fail(function (jqxhr, settings, e) {
				console.log("Error in Loading " + metaurl + " >> Response :" + e.message);
			});
	} else {
		$.getScript("theme/indoqubix/configure/" + metaurl).done(function (metascript, textStatus) {
			loadHandsOnTableData(meta, dataurl, table_id);
		})
			.fail(function (jqxhr, settings, e) {
				console.log("Error in Loading " + metaurl + " >> Response :" + e.message);
			});
	}




}

function grayField() {
	return function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		td.style.background = '#efefef';
	}
}


function loadHandsOnTableData(meta, dataurl, table_id) {
	if (dataurl == "")
		return initHandsOnTable(meta, [], table_id);

	$.ajax({
		type: 'GET',
		url: "theme/indoqubix/configure/" + dataurl,
		async: true,

		dataType: 'json',
		success: function (data) {
			initHandsOnTable(meta, data, table_id);
		},
		error: function (e) {
			console.log("Error" + e.responseText);
		}

	});
}

function initHandsOnTable(meta, data, table_id) {
	var hotElement = document.getElementById(table_id);
	var hot = new Handsontable(hotElement, meta);
	hot.loadData(data);

	/* Add code for loading data 
	
	var hot = HOTWrapper({
		data : JSON.parse(JSON.stringify(data)),
		meta : meta,
		tableId : table_id
		
	});*/
}
//Get Window Size
function getWindowSize() {
	var win = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		w = win.innerWidth || e.clientWidth || g.clientWidth,
		h = win.innerHeight || e.clientHeight || g.clientHeight;
	return { width: w, height: h };
}

//Get Page Id
function getPageInitFunctionId() {
	var content = $('.content');
	return content.attr("data-ref");
}

/*
 * Bootstrap Growl - Notifications popups
 */
function notify(message, type) {

	var config = {
		positionClass: "toast-bottom-right",
		timeOut: 5e3,
		closeButton: !0,
		debug: !1,
		newestOnTop: !0,
		progressBar: !0,
		preventDuplicates: !0,
		onclick: null,
		showDuration: "300",
		hideDuration: "1000",
		extendedTimeOut: "1000",
		showEasing: "swing",
		hideEasing: "linear",
		showMethod: "fadeIn",
		hideMethod: "fadeOut",
		tapToDismiss: !1
	};
	if (type == "success")
		toastr.success(message, "Success", config);
	else if (type == "error")
		toastr.error(message, "Error", config);
	else
		toastr.info(message, type, config);


};


/*
$(document).ready(function(){

	//Add blue animated border and remove with condition when focus and blur
    if($('.fg-line')[0]) {
        $('body').on('focus', '.form-control', function(){
            $(this).closest('.fg-line').addClass('fg-toggled');
        })

        $('body').on('blur', '.form-control', function(){
            var p = $(this).closest('.form-group');
            var i = p.find('.form-control').val();

            if (p.hasClass('fg-float')) {
                if (i.length == 0) {
                    $(this).closest('.fg-line').removeClass('fg-toggled');
                }
            }
            else {
                $(this).closest('.fg-line').removeClass('fg-toggled');
            }
        });
    }

    //Add blue border for pre-valued fg-flot text feilds
    if($('.fg-float')[0]) {
        $('.fg-float .form-control').each(function(){
            var i = $(this).val();

            if (!i.length == 0) {
                $(this).closest('.fg-line').addClass('fg-toggled');
            }

        });
    }

	if ($('[data-action="fullscreen"]')[0]) {
		var fs = $("[data-action='fullscreen']");
		fs.on('click', function(e) {
			e.preventDefault();

			//Launch
			function launchIntoFullscreen(element) {

				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
			}

			//Exit
			function exitFullscreen() {

				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}

			launchIntoFullscreen(document.documentElement);
			fs.closest('.dropdown').removeClass('open');
		});
	}



});

*/