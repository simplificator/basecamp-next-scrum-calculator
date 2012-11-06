class ScrumCalculator
  overallTotal: 0

  constructor: ->
    @buildContainer()
    @buildList()

    @todoLists().each (i, list) =>
      listTotal = 0
      listBudget = @parsedBudget(list)
      missingEstimations = 0

      @todoItems(list).each (i, item) =>
        total = @parsedTodoItem(item)
        if total then listTotal += total else missingEstimations += 1

      listItem = @buildListItem(list, listTotal, listBudget, missingEstimations)
      @attachClickHandler(listItem, list)
      @overallTotal += listTotal

    @buildTotalListItem()

  todoLists: =>
    $('span.unlinked_title')

  parsedBudget: (list) =>
    result = $(list).text().match(/([0-9.]+)h$/)
    return unless result
    parseFloat(result[1])

  todoItems: (list) =>
    $(list).closest('article.todolist').find('li.todo')

  parsedTodoItem: (item) =>
    todo = $(item).find('span.content_for_perma').text()
    result = todo.match(/([0-9.]+)h$/)
    return unless result
    parseFloat(result[1])

  buildListItem: (list, listTotal, listBudget, missingEstimations) =>
    item = $('<li>').
      css('border-bottom', '1px solid #ddd').
      css('padding', '0px 0px 5px 0px').
      css('cursor', 'pointer')

    if listBudget
      titleText = $(list).text().replace(/[\s-]+([0-9.]+)h$/, '');
      titleText += ' - ' + listBudget + 'h / <strong>' + listTotal + 'h</strong>';

      if listTotal > listBudget
        item.css('color', 'red')
      else
        item.css('color', 'green')

    else
      titleText = $(list).text() + ' - <strong>' + listTotal + 'h</strong>'
      item.css('color', '#888')

    item.html(titleText + '<br/>')

    if missingEstimations > 0 && listTotal > 0.0
      item.append($('<small>').text(missingEstimations + ' nicht geschätzt').css('color', '#AAA'))

    @list.append(item)
    item

  attachClickHandler: (listItem, list) =>
    $(listItem).click () =>
      location.hash = $(list).closest('article.todolist').attr('id')

  buildContainer: =>
    if $('body').find('#calculation').length > 0
      @container = $('body').find('#calculation')
      @container.empty()
    else
      @container = $('<div>').attr('id', 'calculation')
      $('body').append(@container)

    @container.
      css('position', 'fixed').
      css('z-index', '1000').
      css('top', '50px').
      css('right', '50px').
      css('padding', '20px').
      addClass('sheet')

    @container.append($('<h2>').
      text('Übersicht').
      css('margin-top', '0').
      css('padding-bottom', '10px'))

    @container

  buildList: =>
    @list = $('<ul>').css('margin', '0')
    @container.append(@list)

  buildTotalListItem: =>
    item = $('<li>').
      css('padding', '20px 0px 0px 0px').
      css('margin', '0');

    item.html('<strong>Total: ' + @overallTotal + 'h</strong>')

    close = $('<a>').text('Schliessen').css('float', 'right').
      css('color', '#AAA').css('cursor', 'pointer').
      click( () => @container.remove())

    item.append($('<small>').append(close))
    @list.append(item)


new ScrumCalculator()