class ScrumCalculator
  overallTotal: 0

  constructor: ->
    console.log 'Running Basecamp SCRUM Calculator'

    @buildContainer()

    if $('section.todos').length == 0
      @container.remove()
      return

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
    $(list).closest('article.todolist').find('ul.todos > li.todo')

  parsedTodoItem: (item) =>
    todo = $(item).find('span.content_for_perma').text()
    result = todo.match(/([0-9.]+)h$/)
    return unless result
    parseFloat(result[1])

  buildListItem: (list, listTotal, listBudget, missingEstimations) =>
    item = $('<li>').
      css('border-bottom', '1px solid #ddd').
      css('padding', '10px 20px 10px 20px').
      css('margin', '0').
      css('cursor', 'pointer')

    if listBudget
      titleText = $(list).text().replace(/[\s-]+([0-9.]+)h$/, '');
      titleText += ' - ' + listBudget + 'h / <strong>' + listTotal + 'h</strong>';

      if listTotal > listBudget
        item.css('color', 'red')
      else
        item.css('color', 'green')

    else
      titleText = $(list).text()
      titleText += ' - <strong>' + listTotal + 'h</strong>' if listTotal > 0.0
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
      css('min-height', 'auto').
      addClass('sheet')

    @container.append($('<h2>').
      text('Übersicht').
      css('margin-top', '0').
      css('padding-bottom', '10px'))

    links = $('<div>').
      css('margin', '10px -20px 0px').
      css('padding-bottom', '10px').
      css('border-bottom', '1px solid #ddd')
    links.append($('<a>').
      text('Aktualisieren').
      css('cursor', 'pointer').
      css('padding', '0px 20px').
      click( () -> new ScrumCalculator() ))
    links.append($('<a>').
      text('Schliessen').
      css('cursor', 'pointer').
      css('padding', '0px 20px').
      click( () => @destroy() ))
    @container.append($('<small>').css('color', '#aaa').append(links))

    @container

  buildList: =>
    @list = $('<ul>').css('margin', '0px -20px')
    @container.append(@list)

  buildTotalListItem: =>
    item = $('<li>').
      css('padding', '20px 20px 0px').
      css('margin', '0');

    item.html('<strong>Total: ' + @overallTotal + 'h</strong>')

    @list.append(item)

  destroy: =>
    clearInterval(window.scrumCalculatorInterval)
    @container.remove()

$(document).ready ->
  window.scrumCalculatorInterval = setInterval () ->
    new ScrumCalculator()
  , 1000
