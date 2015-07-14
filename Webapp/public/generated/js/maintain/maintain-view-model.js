(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Maintain = (function() {
    function Maintain() {
      var _updateRecipeDescription, _updateRecipeName;
      this.recipes = ko.observableArray([]);
      this.tags = ko.observableArray([]);
      this.inEditMode = ko.observable(false);
      this.recipeUnderEdit = ko.observable({});
      this.load = function() {
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, j, k, l, len, len1, len2, len3, len4, m, recipe;
            for (i = 0, len = recipeResponse.length; i < len; i++) {
              recipe = recipeResponse[i];
              recipe.isEditing = ko.observable(false);
            }
            for (j = 0, len1 = recipeResponse.length; j < len1; j++) {
              recipe = recipeResponse[j];
              recipe.Name = ko.observable(recipe.Name);
            }
            for (k = 0, len2 = recipeResponse.length; k < len2; k++) {
              recipe = recipeResponse[k];
              recipe.updateNameStatus = ko.observable(0);
            }
            for (l = 0, len3 = recipeResponse.length; l < len3; l++) {
              recipe = recipeResponse[l];
              recipe.updateDescriptionStatus = ko.observable(0);
            }
            for (m = 0, len4 = recipeResponse.length; m < len4; m++) {
              recipe = recipeResponse[m];
              recipe.Description = ko.observable(recipe.Description);
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
      this.editRecipe = (function(_this) {
        return function(recipe) {
          recipe.isEditing(!recipe.isEditing());
          recipe.Description.subscribe(function(newValue) {
            return _updateRecipeDescription(recipe);
          });
          return recipe.Name.subscribe(function() {
            return _updateRecipeName(recipe);
          });
        };
      })(this);
      _updateRecipeName = function(recipe) {
        recipe.updateNameStatus(0);
        return $.ajax({
          type: 'PUT',
          url: "/maintain/recipe/" + recipe.Id + "/{Name: '" + (recipe.Name()) + "'}",
          success: function(data, textStatus, jqXHR) {
            console.log(jqXHR);
            recipe.updateNameStatus(jqXHR.status);
            setTimeout((function() {
              recipe.updateNameStatus(0);
            }), 1000);
          }
        });
      };
      _updateRecipeDescription = function(recipe) {
        recipe.updateDescriptionStatus(0);
        return $.ajax({
          type: 'PUT',
          url: "/maintain/recipe/" + recipe.Id + "/{Description: '" + (recipe.Description()) + "'}",
          success: function(data, textStatus, jqXHR) {
            console.log(jqXHR);
            recipe.updateDescriptionStatus(jqXHR.status);
            setTimeout((function() {
              recipe.updateDescriptionStatus(0);
            }), 1000);
          }
        });
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
