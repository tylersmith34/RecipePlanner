(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Plan = (function() {
    function Plan() {
      this.loading = ko.observable(false);
      this.recipes = ko.observableArray([]);
      this.uniqueTags = ko.observableArray([]);
      this.selectedTags = ko.observableArray([]);
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
      this.tagWasSelected = (function(_this) {
        return function(tagToFind) {
          var found;
          found = false;
          _this.selectedTags().forEach(function(tag) {
            if (tag.Id === tagToFind.Id) {
              return found = true;
            }
          });
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
              if (_this.tagWasSelected(tag)) {
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
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, len, recipe;
            for (i = 0, len = recipeResponse.length; i < len; i++) {
              recipe = recipeResponse[i];
              recipe.expanded = ko.observable(false);
            }
            return _this.recipes(recipeResponse);
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
