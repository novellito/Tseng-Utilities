chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction'
});


chrome.storage.local.get('name',function(obj) {

  $(".writer").val(obj.name);
  $(".assign_to").val(obj.name);
});
$(".communication").val("Phone");


var substringMatcher = function (strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function (i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

chrome.storage.local.get('value', function (obj) {

  console.log(obj);

  if(typeof(obj.value) == 'string') {
    $('#first_name').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'professorsList',
      source: substringMatcher([obj.value])
    });
  } else {
    $('#first_name').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'professorsList',
      source: substringMatcher(obj.value)
    });
  }


  $('#first_name').bind('typeahead:select', function (ev, suggestion) {
    replaceField();
  });

  $('#first_name').bind('typeahead:autocomplete', function (ev, suggestion) {
    replaceField();
  });


  $('#first_name').bind('typeahead:change', function (ev, suggestion) {

    replaceField();
    let first_name = $('#first_name').val().split(" ")[0]; //get first name
    $("#first_name").val(first_name);

  });

  function replaceField() {
    let last_name = $('#first_name').val().split(" ")[1]; //get last name
    $("#last_name").val(last_name);

    let regex = /[^0-9](?=[0-9])/g; //for putting space in between course number
    let courseNum = $('#first_name').val().split(" ")[4];

    $(".client_type").val("Faculty");
    $("#academic_program").val($('#first_name').val().split(" ")[2]);
    $("#cohort_number").val($('#first_name').val().split(" ")[3]);
    $("#course_number").val($('#first_name').val().split(" ")[4]);

    $("#course_number").val(courseNum.replace(regex, '$& '));
  }
});

chrome.runtime.onMessage.addListener( //reload page
  function (request, sender, sendResponse) {
    if (request.message === "reload") {
      location.reload();
    }
  }
);