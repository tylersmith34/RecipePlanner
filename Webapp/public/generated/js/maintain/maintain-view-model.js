(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Maintain = (function() {
    function Maintain() {
      this.recipes = ko.observableArray([]);
      this.tags = ko.observableArray([]);
      this.load = function() {
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, len, recipe;
            for (i = 0, len = recipeResponse.length; i < len; i++) {
              recipe = recipeResponse[i];
              recipe.isEditing = ko.observable(false);
            }
            return _this.recipes(recipeResponse);
          };
        })(this));
        return $.get("/plan/recipes/tags", (function(_this) {
          return function(tagResponse) {
            return _this.tags(tagResponse);
          };
        })(this));
      };
      this.editRecipe = function(recipe) {
        return recipe.isEditing(true);
      };
    }

    return Maintain;

  })();

  $(function() {
    var _viewModel;
    _viewModel = new Recipes.Maintain();
    ko.applyBindings(_viewModel);
    return _viewModel.load();
  });

}).call(this);
