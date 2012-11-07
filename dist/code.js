// Generated by CoffeeScript 1.4.0
(function() {
  var ScrumCalculator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ScrumCalculator = (function() {

    ScrumCalculator.prototype.overallTotal = 0;

    function ScrumCalculator() {
      this.destroy = __bind(this.destroy, this);

      this.buildTotalListItem = __bind(this.buildTotalListItem, this);

      this.buildList = __bind(this.buildList, this);

      this.buildContainer = __bind(this.buildContainer, this);

      this.attachClickHandler = __bind(this.attachClickHandler, this);

      this.buildListItem = __bind(this.buildListItem, this);

      this.parsedTodoItem = __bind(this.parsedTodoItem, this);

      this.todoItems = __bind(this.todoItems, this);

      this.parsedBudget = __bind(this.parsedBudget, this);

      this.todoLists = __bind(this.todoLists, this);

      var _this = this;
      console.log('Running Basecamp SCRUM Calculator');
      this.buildContainer();
      if ($('section.todos').length === 0) {
        this.container.remove();
        return;
      }
      this.buildList();
      this.todoLists().each(function(i, list) {
        var listBudget, listItem, listTotal, missingEstimations;
        listTotal = 0;
        listBudget = _this.parsedBudget(list);
        missingEstimations = 0;
        _this.todoItems(list).each(function(i, item) {
          var total;
          total = _this.parsedTodoItem(item);
          if (total) {
            return listTotal += total;
          } else {
            return missingEstimations += 1;
          }
        });
        listItem = _this.buildListItem(list, listTotal, listBudget, missingEstimations);
        _this.attachClickHandler(listItem, list);
        return _this.overallTotal += listTotal;
      });
      this.buildTotalListItem();
    }

    ScrumCalculator.prototype.todoLists = function() {
      return $('span.unlinked_title');
    };

    ScrumCalculator.prototype.parsedBudget = function(list) {
      var result;
      result = $(list).text().match(/([0-9.]+)h$/);
      if (!result) {
        return;
      }
      return parseFloat(result[1]);
    };

    ScrumCalculator.prototype.todoItems = function(list) {
      return $(list).closest('article.todolist').find('ul.todos > li.todo');
    };

    ScrumCalculator.prototype.parsedTodoItem = function(item) {
      var result, todo;
      todo = $(item).find('span.content_for_perma').text();
      result = todo.match(/([0-9.]+)h$/);
      if (!result) {
        return;
      }
      return parseFloat(result[1]);
    };

    ScrumCalculator.prototype.buildListItem = function(list, listTotal, listBudget, missingEstimations) {
      var item, titleText;
      item = $('<li>').css('border-bottom', '1px solid #ddd').css('padding', '10px 20px 10px 20px').css('margin', '0').css('cursor', 'pointer');
      if (listBudget) {
        titleText = $(list).text().replace(/[\s-]+([0-9.]+)h$/, '');
        titleText += ' - ' + listBudget + 'h / <strong>' + listTotal + 'h</strong>';
        if (listTotal > listBudget) {
          item.css('color', 'red');
        } else {
          item.css('color', 'green');
        }
      } else {
        titleText = $(list).text();
        if (listTotal > 0.0) {
          titleText += ' - <strong>' + listTotal + 'h</strong>';
        }
        item.css('color', '#888');
      }
      item.html(titleText + '<br/>');
      if (missingEstimations > 0 && listTotal > 0.0) {
        item.append($('<small>').text(missingEstimations + ' nicht geschätzt').css('color', '#AAA'));
      }
      this.list.append(item);
      return item;
    };

    ScrumCalculator.prototype.attachClickHandler = function(listItem, list) {
      var _this = this;
      return $(listItem).click(function() {
        return location.hash = $(list).closest('article.todolist').attr('id');
      });
    };

    ScrumCalculator.prototype.buildContainer = function() {
      var links,
        _this = this;
      if ($('body').find('#calculation').length > 0) {
        this.container = $('body').find('#calculation');
        this.container.empty();
      } else {
        this.container = $('<div>').attr('id', 'calculation');
        $('body').append(this.container);
      }
      this.container.css('position', 'fixed').css('z-index', '1000').css('top', '50px').css('right', '50px').css('padding', '20px').css('min-height', 'auto').addClass('sheet');
      this.container.append($('<h2>').text('Übersicht').css('margin-top', '0').css('padding-bottom', '10px'));
      links = $('<div>').css('margin', '10px -20px 0px').css('padding-bottom', '10px').css('border-bottom', '1px solid #ddd');
      links.append($('<a>').text('Aktualisieren').css('cursor', 'pointer').css('padding', '0px 20px').click(function() {
        return new ScrumCalculator();
      }));
      links.append($('<a>').text('Schliessen').css('cursor', 'pointer').css('padding', '0px 20px').click(function() {
        return _this.destroy();
      }));
      this.container.append($('<small>').css('color', '#aaa').append(links));
      return this.container;
    };

    ScrumCalculator.prototype.buildList = function() {
      this.list = $('<ul>').css('margin', '0px -20px');
      return this.container.append(this.list);
    };

    ScrumCalculator.prototype.buildTotalListItem = function() {
      var item;
      item = $('<li>').css('padding', '20px 20px 0px').css('margin', '0');
      item.html('<strong>Total: ' + this.overallTotal + 'h</strong>');
      return this.list.append(item);
    };

    ScrumCalculator.prototype.destroy = function() {
      clearInterval(window.scrumCalculatorInterval);
      return this.container.remove();
    };

    return ScrumCalculator;

  })();

  $(document).ready(function() {
    return window.scrumCalculatorInterval = setInterval(function() {
      return new ScrumCalculator();
    }, 1000);
  });

}).call(this);
