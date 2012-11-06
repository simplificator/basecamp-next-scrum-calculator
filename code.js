javascript: if ($('body').find('#calculation').length > 0) {
  var container = $('body').find('#calculation');
  container.empty();
} else {
  var container = $('<div>').attr('id', 'calculation');
  $('body').append(container);
}

container.
  css('position', 'fixed').
  css('z-index', '1000').
  css('top', '50px').
  css('right', '50px').
  css('padding', '20px').
  addClass('sheet');

container.append($('<h2>').text('Übersicht').css('margin-top', '0'));

var list = $('<ul>').
  css('margin', '0');
container.append(list);

$('span.unlinked_title').each(function(i, title) {
  var result = $(title).text().match(/([0-9.]+)h$/);
  if (result) {
    var budget = parseFloat(result[1]);
  }

  $(title).closest('article.todolist').find('ul.todos').each(function(i, ul) {
    var total = 0;
    var missing = 0;
    $(ul).find('li.todo').each(function(i, todo) {
      var todo = $(todo).find('span.content_for_perma').text();
      var result = todo.match(/([0-9.]+)h$/);
      if (result) {
        total += parseFloat(result[1]);
      } else {
        missing += 1;
      }
    });

    var item = $('<li>').
      css('border-bottom', '1px solid #ddd').
      css('padding', '0px 0px 5px 0px').
      css('cursor', 'pointer');

    item.click(function() {
      location.hash = $(ul).closest('article.todolist').attr('id');
    });

    if (budget) {
      var titleText = $(title).text().replace(/[\s-]+([0-9.]+)h$/, '');
      titleText += ' - ' + budget + 'h / <strong>' + total + 'h</strong>';

      if (total > budget) {
        item.css('color', 'red');
      } else {
        item.css('color', 'green');
      }
    } else {
      var titleText = $(title).text() + ' - <strong>' + total + 'h</strong>';
      item.css('color', '#888');
    }

    item.html(titleText + '<br/>');
    if (missing > 0 && total > 0.0) item.append($('<small>').text(missing + ' nicht geschätzt').css('color', '#AAA'));
    list.append(item);
  });
});