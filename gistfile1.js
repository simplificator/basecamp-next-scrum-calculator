// add this code as a bookmark and use it on a basecamp project page

javascript: $('span.unlinked_title').each(function(i, title) {
  $(title).closest('article.todolist').find('ul.todos').each(function(i, ul) {
    var total = 0;
    $(ul).find('li.todo').each(function(i, todo) {
      var todo = $(todo).find('span.content_for_perma').text();
      var result = todo.match(/([0-9.]+)h$/);
      if(result) total += parseFloat(result[1]);
    });
    console.log($(title).text() + ' - ' + total + 'h');
  });
});
