var $log = $( "#log" ),
  str = document.getElementById("invisible").textContent,
  html = $.parseHTML( str );
// Append the parsed HTML
$log.append( html );
