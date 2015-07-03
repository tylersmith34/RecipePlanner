(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Plan = (function() {
    function Plan() {
      var _configureDaysOfWeek, _configureDraggables, _configureDroppables, _tagWasSelected;
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
            if (numberOfMatches === _this.selectedTags().length) {
              return recipes.push(recipe);
            }
          });
          return recipes;
        };
      })(this));
      this.load = function() {
        _configureDaysOfWeek();
        _configureDroppables();
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, len, recipe;
            for (i = 0, len = recipeResponse.length; i < len; i++) {
              recipe = recipeResponse[i];
              recipe.expanded = ko.observable(false);
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
      _configureDraggables = (function(_this) {
        return function() {
          return $('.recipe').draggable({
            scroll: false,
            revert: "invalid"
          });
        };
      })(this);
      _configureDroppables = function() {
        return $('.dayOfWeek').droppable({
          accept: '.recipe',
          hoverClass: "draggable-target",
          activeClass: "ui-state-default",
          drop: function(event, ui) {
            var dataId;
            dataId = ui.draggable.draggable[0].attributes["data-id"].value;
            console.log(dataId);
            return $(this).addClass("ui-state-highlight");
          }
        });
      };
      _configureDaysOfWeek = (function(_this) {
        return function() {
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Monday'));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Tuesday'));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Wednesday'));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Thursday'));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Friday'));
          _this.daysOfWeek.push(new Recipes.DayOfWeek('Saturday'));
          return _this.daysOfWeek.push(new Recipes.DayOfWeek('Sunday'));
        };
      })(this);
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
