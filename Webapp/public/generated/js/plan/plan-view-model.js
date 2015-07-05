(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Plan = (function() {
    function Plan() {
      var _configureDaysOfWeek, _configureDraggables, _configureDroppables, _findDayOfWeekByName, _findNextDayOfWeek, _findPreviousDayOfWeek, _findRecipeById, _tagWasSelected;
      this.loading = ko.observable(false);
      this.recipes = ko.observableArray([]);
      this.uniqueTags = ko.observableArray([]);
      this.selectedTags = ko.observableArray([]);
      this.daysOfWeek = ko.observableArray([]);
      this.numberOfUnselectedTags = ko.computed((function(_this) {
        return function() {
          var count, i, len, ref, visible;
          count = 0;
          ref = _this.uniqueTags();
          for (i = 0, len = ref.length; i < len; i++) {
            visible = ref[i];
            if (visible.visible() === true) {
              count++;
            }
          }
          return count;
        };
      })(this));
      _configureDraggables = function() {
        return $('.recipe').draggable({
          scroll: false,
          revert: "invalid"
        });
      };
      _tagWasSelected = (function(_this) {
        return function(tagToFind) {
          var found, i, len, ref, tag;
          found = false;
          ref = _this.selectedTags();
          for (i = 0, len = ref.length; i < len; i++) {
            tag = ref[i];
            if (tag.Id === tagToFind.Id) {
              found = true;
            }
          }
          return found;
        };
      })(this);
      _configureDroppables = function() {
        return $('.dayOfWeek').droppable({
          accept: '.recipe',
          hoverClass: "draggable-target",
          activeClass: "ui-state-default",
          drop: function(event, ui) {
            var dataId, dayOfWeekName, foundDay, foundRecipe;
            dayOfWeekName = $(this)[0].attributes["data-name"].value;
            dataId = ui.draggable[0].attributes["data-id"].value;
            foundDay = _findDayOfWeekByName(dayOfWeekName);
            foundRecipe = _findRecipeById(dataId);
            foundRecipe.planned(true);
            return foundDay.plannedRecipes.push(foundRecipe);
          }
        });
      };
      _findRecipeById = (function(_this) {
        return function(id) {
          var i, idAsInt, len, recipe, recipeToFind, ref;
          idAsInt = parseInt(id);
          ref = _this.recipes();
          for (i = 0, len = ref.length; i < len; i++) {
            recipe = ref[i];
            if (recipe.Id === idAsInt) {
              recipeToFind = recipe;
            }
          }
          return recipeToFind;
        };
      })(this);
      _findDayOfWeekByName = (function(_this) {
        return function(name) {
          var day, dayOfWeek, i, len, ref;
          ref = _this.daysOfWeek();
          for (i = 0, len = ref.length; i < len; i++) {
            dayOfWeek = ref[i];
            if (dayOfWeek.name === name) {
              day = dayOfWeek;
            }
          }
          return day;
        };
      })(this);
      _configureDaysOfWeek = (function(_this) {
        return function() {
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Monday', 1));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Tuesday', 2));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Wednesday', 3));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Thursday', 4));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Friday', 5));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Saturday', 6));
          return _this.daysOfWeek.push(new Recipes.DayOfWeek('Sunday', 7));
        };
      })(this);
      _findPreviousDayOfWeek = (function(_this) {
        return function(currentNumber) {
          var day, i, len, prevDay, ref;
          ref = _this.daysOfWeek();
          for (i = 0, len = ref.length; i < len; i++) {
            day = ref[i];
            if (day.number === (currentNumber - 1)) {
              prevDay = day;
            }
          }
          return prevDay;
        };
      })(this);
      _findNextDayOfWeek = (function(_this) {
        return function(currentNumber) {
          var day, i, len, nextDay, ref;
          ref = _this.daysOfWeek();
          for (i = 0, len = ref.length; i < len; i++) {
            day = ref[i];
            if (day.number === (currentNumber + 1)) {
              nextDay = day;
            }
          }
          return nextDay;
        };
      })(this);
      this.filteredRecipes = ko.computed((function(_this) {
        return function() {
          var recipes;
          recipes = [];
          _this.recipes().forEach(function(recipe) {
            var i, len, numberOfMatches, ref, tag;
            numberOfMatches = 0;
            ref = recipe.Tags;
            for (i = 0, len = ref.length; i < len; i++) {
              tag = ref[i];
              if (_tagWasSelected(tag)) {
                numberOfMatches++;
              }
            }
            if (numberOfMatches === _this.selectedTags().length && recipe.planned() === !true) {
              return recipes.push(recipe);
            }
          });
          return recipes;
        };
      })(this));
      this.filteredRecipes.subscribe = function() {
        return _configureDraggables();
      };
      this.load = function() {
        _configureDaysOfWeek();
        _configureDroppables();
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, j, len, len1, recipe;
            for (i = 0, len = recipeResponse.length; i < len; i++) {
              recipe = recipeResponse[i];
              recipe.expanded = ko.observable(false);
            }
            for (j = 0, len1 = recipeResponse.length; j < len1; j++) {
              recipe = recipeResponse[j];
              recipe.planned = ko.observable(false);
            }
            _this.recipes(recipeResponse);
            return _configureDraggables();
          };
        })(this));
        return $.get("/plan/recipes/tags", (function(_this) {
          return function(tagResponse) {
            var i, len, tag;
            for (i = 0, len = tagResponse.length; i < len; i++) {
              tag = tagResponse[i];
              tag.visible = ko.observable(true);
            }
            return _this.uniqueTags(tagResponse);
          };
        })(this));
      };
      this.cancelRecipe = function(day, recipe) {
        recipe.planned(false);
        return day.plannedRecipes.remove(recipe);
      };
      this.moveRecipeToNextDay = function(day, recipe) {
        var nextDay;
        day.plannedRecipes.remove(recipe);
        nextDay = _findNextDayOfWeek(day.number);
        return nextDay.plannedRecipes.push(recipe);
      };
      this.moveRecipeToPreviousDay = function(day, recipe) {
        day.plannedRecipes.remove(recipe);
        return _findPreviousDayOfWeek(day.number).plannedRecipes.push(recipe);
      };
      this.selectTag = (function(_this) {
        return function(tag) {
          _this.selectedTags.push(tag);
          return tag.visible(false);
        };
      })(this);
      this.deselectTag = (function(_this) {
        return function(tag) {
          _this.selectedTags.remove(tag);
          return tag.visible(true);
        };
      })(this);
      this.toggleRecipeDetails = function(recipe) {
        return recipe.expanded(!recipe.expanded());
      };
      this.resetFilters = (function(_this) {
        return function() {
          var i, len, ref, tag;
          ref = _this.uniqueTags();
          for (i = 0, len = ref.length; i < len; i++) {
            tag = ref[i];
            tag.visible(true);
          }
          return _this.selectedTags.removeAll();
        };
      })(this);
    }

    return Plan;

  })();

  $(function() {
    var _viewModel;
    _viewModel = new Recipes.Plan();
    ko.applyBindings(_viewModel);
    return _viewModel.load();
  });

}).call(this);
