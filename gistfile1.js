// add this code as a bookmark and use it on a basecamp project page

javascript: if ($('body').find('ul#calculation').length > 0) {
  var list = $('body').find('ul#calculation');
  list.empty();
} else {
  var list = $('<ul>').attr('id', 'calculation');
  $('body').append(list);
}

$('span.unlinked_title').each(function(i, title) {
  $(title).closest('article.todolist').find('ul.todos').each(function(i, ul) {
    var total = 0;
    var missing = 0;
    $(ul).find('li.todo').each(function(i, todo) {
      var todo = $(todo).find('span.content_for_perma').text();
      var result = todo.match(/([0-9.]+)h$/);
      if(result) {
        total += parseFloat(result[1]);
      } else {
        missing += 1;
      }
    });
    var item = $('<li>').html($(title).text() + ' [<strong>' + total + 'h</strong>]<br>');
    if (missing > 0 && total > 0.0) item.append($('<small>').text(missing + ' nicht geschätzt').css('color', '#AAA'));
    list.append(item);
  });

  list.css('position', 'fixed');
  list.css('top', '50px');
  list.css('right', '50px');
  list.css('background-color', 'white');
  list.css('padding', '25px');
  list.css('border', '2px solid black');
});