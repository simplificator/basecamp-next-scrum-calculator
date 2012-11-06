// add this code as a bookmark and use it on a basecamp project page

javascript: var list = $('<ul>');
$('span.unlinked_title').each(function(i, title) {
  $(title).closest('article.todolist').find('ul.todos').each(function(i, ul) {
    var total = 0;
    $(ul).find('li.todo').each(function(i, todo) {
      var todo = $(todo).find('span.content_for_perma').text();
      var result = todo.match(/([0-9.]+)h$/);
      if(result) total += parseFloat(result[1]);
    });
    list.append($('<li>').html($(title).text() + ' [<strong>' + total + 'h</strong>]'));
  });

  list.css('position', 'absolute');
  list.css('top', window.pageYOffset + 50 + 'px');
  list.css('right', '50px');
  list.css('background-color', 'white');
  list.css('padding', '25px');
  list.css('border', '2px solid black');

  $('body').append(list);
});