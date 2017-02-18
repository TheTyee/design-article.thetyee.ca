jQuery(window).load(function(){jQuery("div.wfo_widget").toggle(document.URL.indexOf("results=true")!==-1);jQuery("figure.poll-form").toggle(document.URL.indexOf("results=true")==-1);var 
pollEndDate=new Date(wufooArr.enddate);var today=new Date();if(today>pollEndDate){jQuery("div.wfo_widget").show();jQuery("figure.poll-form").hide();}});
