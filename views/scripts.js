var myFunction = function() {
var titre = document.getElementById("titre").innerHTML;
var data = document.getElementById("data").innerHTML;
document.forms["formid"].title.value += titre;
document.forms["formid"].article.value += data;
alert(document.forms["formid"].article.value);
document.getElementById("formid").submit();
}

var myAlert = function() {
  alert('YOUPIE')
}

var editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome'
});

$(document).keydown(function(e) {
    // trap the return key being pressed
    if (e.keyCode === 13) {
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
      document.execCommand('insertHTML', false, '<br>');
      // prevent the default behaviour of return key pressed
      return false;
    }
  });
