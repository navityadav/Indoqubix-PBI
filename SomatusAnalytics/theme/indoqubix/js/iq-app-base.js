/*!
 * Theme        : Somatus
 */

$(window).load(function() {
        $("#preloader").delay(200).fadeOut();
});

function startSaveLoader(message){
	$("body").waitMe({
        effect: 'win8',
        text: 'Saving.. Please wait',
        bg: 'rgba(255,255,255,0.7)',
        color: '#000',
        maxSize: '',
        source: 'img.svg',
        onClose: function() {}
    });
}


function startLoader(message){
    console.log("Inside startLoader..");
	$("body").waitMe({
        effect: 'win8',
        text: 'Loading.. Please wait',
        bg: 'rgba(255,255,255,0.7)',
        color: '#000',
        maxSize: '',
        source: 'img.svg',
        onClose: function() {}
    });
}

function stopLoader(){
	$('body').waitMe('hide');
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function initAjaxPagination(elementId, pageContent, handler){
	if(pageContent.totalPages==null || pageContent.totalPages==0)
		return false;
	var d = new Date();
	var n = d.getMilliseconds();
	
	var paginationEventClass =  'iq_'+n;
	var startRecords = pageContent.number * pageContent.size;
	var endRecord = startRecords + pageContent.size;
	if(endRecord>pageContent.totalElements)
		endRecord=pageContent.totalElements;
	
	var title = "<span class='records-status'>Showing "+ (startRecords +1)+" to "+ endRecord +" of "+pageContent.totalElements + " Enteries</span>";
	
	var page = '<nav class="pull-right">' +
	' <ul class="pagination pull-right">';
	
	if(pageContent.first == true)
	{
		page += '<li class="page-item disabled"><a class="page-link" href="#">← First</a></li>';
		page += '<li class="page-item disabled"><a class="page-link" href="#"><i class="fa fa-angle-double-left"></i></a></li>';
	}
	else{
		page += '<li class="page-item "><a class="page-link '+paginationEventClass+'" data-page="0" data-size="'+pageContent.size+'" href="#">← First</a></li>';
		page += '<li class="page-item "><a class="page-link '+paginationEventClass+'" data-page="'+(pageContent.number-1)+'" data-size="'+pageContent.size+'" href="#"><i class="fa fa-angle-double-left"></i></a></li>';
		
	}
	
	 var currentPage = pageContent.number;
     var pageRange = 2;
     var totalPage = pageContent.totalPages;

     var rangeStart = currentPage - pageRange;
     var rangeEnd = currentPage + pageRange;
     
     if (rangeEnd > totalPage) {
         rangeEnd = totalPage;
         rangeStart = totalPage - pageRange * 2;
         rangeStart = rangeStart < 1 ? 1 : rangeStart;
     }

     if (rangeStart <= 1) {
         rangeStart = 1;
         rangeEnd = Math.min(pageRange * 2 + 1, totalPage);
     }
     
     if (rangeStart <= 3) {
    	 for (i = 0; i < rangeStart; i++) {
    		 page += getInnerPageLink(i,pageContent.number, pageContent.size,paginationEventClass);
    		 
    	 }
     }else {
    	 page += getInnerPageLink(1,pageContent.number, pageContent.size,paginationEventClass);
 		 page += '<li class="page-item disabled"><a class="page-link"  href="#">..</a></li>';
 		 
     }
    
     for (i = rangeStart; i < rangeEnd; i++) {
    	 page += getInnerPageLink(i,pageContent.number, pageContent.size,paginationEventClass);
     }
  
     if (rangeEnd >= totalPage - 2) {
    	 for (i = rangeEnd + 1; i <= totalPage; i++)
    		 page += getInnerPageLink(i,pageContent.number, pageContent.size,paginationEventClass);
     }else {
    	 page += '<li class="page-item disabled"><a class="page-link"  href="#">..</a></li>';
     }
     
       
	if(pageContent.last == true){
		page += '<li class="page-item disabled"><a class="page-link"  href="#"><i class="fa fa-angle-double-right"></i></a></li>';
		page += '<li class="page-item disabled"><a class="page-link"  href="#">Last →</a></li>';
	}
	else{
		page += '<li class="page-item "><a class="page-link '+paginationEventClass+'" data-page="'+(pageContent.number+1)+'" data-size="'+pageContent.size+'" href="#"><i class="fa fa-angle-double-right"></i></a></li>';
		page += '<li class="page-item "><a class="page-link '+paginationEventClass+'" data-page="'+(pageContent.totalPages-1)+'" data-size="'+pageContent.size+'" href="#">Last →</a></li>';
	}
		
	page +=' </ul> '+ title +'</nav>';
	
    $('#'+elementId).html(page);
  
    $("."+paginationEventClass).click(function(){
    	
    	var page = $(this).attr("data-page");
    	var size = $(this).attr("data-size");
    	handler(page,size);
    	
    });
}

function getInnerPageLink(i,currentPage, size,paginationEventClass){
	var page="";
	if(currentPage == i)
		page += '<li class="page-item active">';
	else
		page += '<li class="page-item ">';
		
	page += '<a class="page-link '+paginationEventClass+'" data-page="'+i+'" data-size="'+size+'" href="#">'+(i+1)+'</a></li>';
	
	return page;
}

function navbarFixed() {					
	if($(window).width() > 767) 
	{
		$(".navbar").addClass('navbar-fixed-top')
	}
	else {
        $(".navbar").removeClass('navbar-fixed-top');
        reload();
    }	
}


function reload() {
	window.location.reload();
}


function blockHeight() {
	jQuery(".bottom_block_content .item").css('height', '');
	var colHt = 0;
	$(".bottom_block_content .item").each(function() {
		if($(this).height() > colHt) {
				colHt = $(this).height();
		}
	});
	if($(window).width() > 767) {
		$(".bottom_block_content .item").css('height', colHt);
	}
	else{
		$(".bottom_block_content .item").css('height', '');
	}		
}
function colHeight() {
	jQuery(".block_content").css('height', '');
	var colHt = 0;
	$(".block_content").each(function() {
		if($(this).height() > colHt) {
				colHt = $(this).height();
		}
	});

	if($(window).width() > 767) {
		$(".block_content").css('height', (colHt+60));
	}
	else{
		$(".block_content").css('height', '');
	}		
}
jQuery(window).scroll(function () {		
	if($(window).width() > 767) 
	{
		if ($(this).scrollTop() > 50) {
			$("body").addClass('navbar-sticky');
        } 
		if ($(this).scrollTop() == 0) {
			$("body").removeClass('navbar-sticky');
        } 
	}	
});
$(document).ready(function () {

    $(window).resize(function () {
        navbarFixed();
        setTimeout(function () { blockHeight() }, 1000);
        setTimeout(function () { colHeight(); }, 1000);
    });


    BASE_PATH = "/"
    $(document).ready(function () {

        //Menu Selection
        contextPath = $(location).attr('pathname');
        if (contextPath == '/') {
            $('.menu-home').addClass("active");
        } else {

            var pathArray = contextPath.split('/');
            if (pathArray.length > 2)
                BASE_PATH = BASE_PATH + pathArray[1];
            else
                BASE_PATH = "";

            contextPath = pathArray[pathArray.length - 1];



            $('.menu-' + contextPath).addClass("active");


            var parent = $('.menu-' + contextPath).attr("data-parent");
            $('#' + parent).addClass("active");
        }

        var function_id = getPageInitFunctionId();
        if (function_id != undefined && function_id != "") {
            try {
                console.log("Executing Method::" + function_id);
                eval(function_id)();
            }
            catch (e) {
                console.log("Method Not Defined : " + function_id + " [" + e.message + "]");
            }
        }

        var adminHeight = $(".admin").height();
        if (adminHeight < $(window).height()) {
            $(".admin").css('min-height', $(window).height() - 149);
        }

        $(".notification-icon").click(function (e) {
            e.preventDefault();
            showHideNotificationPanel();

        });

        $(document).mouseup(function (e) {
            if (!$(".notification-icon").is(e.target) && $(".notification-icon").has(e.target).length === 0 && !$(".notification-panel").is(e.target) && $(".notification-panel").has(e.target).length === 0) {
                $(".notification-panel").addClass("hidden");
            }
        });

        if ($("#pagetype").val() != "LOGIN") { 
            /** Init Notification */
            initNotification();
        }

    });
    $.NOTIFICATION_COUNT = 0;
    $.NOTIFICATION_BODY_HTML = "";
    function initNotification(){
        $.NOTIFICATION_BODY_HTML = $("#notification-message-v1").html();
        $("#notification-message-v1").remove();
         refreshNotifications();
    }

    function showHideNotificationPanel() {
        $(".notification-panel").toggleClass("hidden");
        if ($.NOTIFICATION_COUNT > 0)
            markNotificationsAsRead();
    }

    function markNotificationsAsRead() {
        $.ajax({
            type: "POST",
            url: "/notification/markasread",
            async: true,
            cache: false,
            timeout: 50000,
            success: function (data) {
                updateNotificationCount(0);
            }
        });
    }


    function refreshNotifications(callTimer = true) {
        console.log("..");
        var reportUpdatedOn = {
            "update_on": ""
        };

        $.ajax({
            type: "POST",
            url: "/notification/latest",
            async: true,
            cache: false,
            timeout: 50000,
            
            success: function (data) {
                if (data[0] != "[")
                    window.location.href = "/";
                else {
                    var obj = JSON.parse(data);
                    processNotificationList(obj);
                    if (callTimer)
                        setTimeout( refreshNotifications, 20000 );
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error", textStatus + " (" + errorThrown + ")");
                if (callTimer) {
                    setTimeout(
                        refreshNotifications,
                        30000);
                }
            }
        });
    }
  
    function processNotificationList(list) {
        $.NOTIFICATION_COUNT = 0;
        
        if (list.length > 0) {
            var notificationHtml = $("#notification-message-v1").html();
        }

        for (let i = 0; i < list.length; i++) {
            var obj = list[i];

            $(".notification-panel-messages").append(getNotificationHTML(obj));
            
            if (obj.read_status === 0) 
                $.NOTIFICATION_COUNT++;
            
        }

        $(".download-excel").click(function () {
            var exportId = $(this).attr("data-exportid");
            var fileName = $(this).attr("data-filename");

            downloadFile(exportId, fileName, "#main-body");
        });


        updateNotificationCount($.NOTIFICATION_COUNT);
    }

    function updateNotificationCount(count) {
        if (count == 0) {
            $(".notification-count").hide();
        } else { 
            $(".notification-count").removeClass("hidden");
            $(".notification-count").show();
        }
        $(".notification-count").html(count);
    }

   
    $.NOTIFICATION_MAP = {};
    function getNotificationHTML(obj) {
        var notificationHTML = $.NOTIFICATION_BODY_HTML;
        var d = new Date(obj.schedule_start_datetime);
        var curr_day = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();

        if (curr_day < 9)
            curr_day = "0" + curr_day;
        if (curr_month < 9)
            curr_month = "0" + curr_month;

        var curr_hour = d.getHours();
        if (curr_hour < 9)
            curr_hour = "0" + curr_hour;

        var curr_min = d.getMinutes();
        if (curr_hour < 9)
            curr_min = "0" + curr_min;
        var curr_sec = d.getSeconds();
        if (curr_sec < 9)
            curr_sec = "0" + curr_sec;

        curr_month++; // In js, first month is 0, not 1
        year_2d = curr_year.toString().substring(2, 4)

        var finalDate = curr_year + "-" + curr_month + "-" + curr_day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

        $("#notification-id-" + obj.report_export_id).remove();
        notificationHTML = notificationHTML.replace("__NOTIFICATION_ID__", obj.report_export_id);
        notificationHTML = notificationHTML.replace("__REQUESTED_ON__", finalDate);
        /** ICON */
        if (obj.status == 'N') {
            notificationHTML = notificationHTML.replace("__ICON__", "circle");
            notificationHTML = notificationHTML.replace("__MESSAGE__", "Download " + obj.message + "- Waiting in Queue");
            notificationHTML = notificationHTML.replace("__DOWNLOAD_ICON_VISIBILITY__", "hidden");
        }
        else if (obj.status == 'I') {
            notificationHTML = notificationHTML.replace("__ICON__", "spinner fa-spin fas");
            notificationHTML = notificationHTML.replace("__MESSAGE__", "Preparing " + obj.message + " - In Progress.");
            notificationHTML = notificationHTML.replace("__DOWNLOAD_ICON_VISIBILITY__", "hidden");
        }
        else if (obj.status == 'C') {
            notificationHTML = notificationHTML.replace("__ICON__", "check");
            notificationHTML = notificationHTML.replace("__MESSAGE__", obj.message + " generated successfully");
            notificationHTML = notificationHTML.replace("__FILE_NAME__", obj.download_path);
            notificationHTML = notificationHTML.replace("__NOTIFICATION_EXPORT_ID__", obj.report_export_id);
            if (obj.read_status == 0) {

                if ($.NOTIFICATION_MAP[obj.report_export_id]!=undefined && $.NOTIFICATION_MAP[obj.report_export_id] != obj.status)
                    notify(obj.message + " generated successfully", "success");
            }
            
        }
        else if (obj.status == 'E') {
            notificationHTML = notificationHTML.replace("__ICON__", "times").replace("__TEXT_STATUS_CLASS__", "text-danger");
            notificationHTML = notificationHTML.replace("__MESSAGE__", "Error in generating " + obj.message);
            notificationHTML = notificationHTML.replace("__DOWNLOAD_ICON_VISIBILITY__", "hidden");
        }
        if (obj.read_status == 0)
            notificationHTML = notificationHTML.replace("__TEXT_STATUS_CLASS__", "text-new");
        else
            notificationHTML = notificationHTML.replace("__TEXT_STATUS_CLASS__", "text-read");

        $.NOTIFICATION_MAP[obj.report_export_id] = obj.status;
        return notificationHTML;
    }


    function downloadFile(exportId, fileName, loading_element_id) {
        $(loading_element_id).waitMe();

        var x = new XMLHttpRequest();
        x.open("GET", "/download/file/" + exportId, true);
        x.responseType = 'blob';
        x.onload = function (e) {
            download(x.response, fileName, x.response.type);
            $(loading_element_id).waitMe('hide');
            rb_DOWNLOAD_REPORT = false;
        }
        x.send();
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
        var content = $('.admin');
        return content.attr("data-ref");
    }

    function displayLoadingBlock(elementId) {
        content = $('#loading-content').html();
        $('#' + elementId).html(content);

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
});