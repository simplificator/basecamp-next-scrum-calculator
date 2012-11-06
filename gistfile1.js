// add this code as a bookmark and use it on a basecamp project page

javascript: if ($('body').find('#calculation').length > 0) {
  var container = $('body').find('#calculation');
  container.empty();
} else {
  var container = $('<div>').attr('id', 'calculation');
  $('body').append(container);
}

container.css('position', 'fixed').
          css('z-index', '1000').
          css('top', '50px').
          css('right', '50px').
          css('padding', '20px').
          addClass('sheet');

container.append($('<h2>').text('Übersicht').css('margin-top', '0'));

var list = $('<ul>').css('margin', '0');
container.append(list);

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
});