(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Maintain = (function() {
    function Maintain() {
      var _processRecipePutResponse, _updateRecipeDescription, _updateRecipeName;
      this.recipes = ko.observableArray([]);
      this.tags = ko.observableArray([]);
      this.inEditMode = ko.observable(false);
      this.recipeUnderEdit = ko.observable({});
      this.load = function() {
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, j, k, l, len, len1, len2, len3, len4, len5, m, n, recipe;
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
              recipe.updateTagStatus = ko.observable(0);
            }
            for (n = 0, len5 = recipeResponse.length; n < len5; n++) {
              recipe = recipeResponse[n];
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
      this.editRecipe = function(recipe) {
        recipe.isEditing(!recipe.isEditing());
        recipe.Description.subscribe(function(newValue) {
          return _updateRecipeDescription(recipe);
        });
        return recipe.Name.subscribe(function() {
          return _updateRecipeName(recipe);
        });
      };
      this.removeTagFromRecipe = function(recipe, tag) {
        return $.ajax({
          type: 'DELETE',
          url: "/maintain/recipe/" + recipe.Id + "/" + tag.Id + "}",
          success: function(data, textStatus, jqXHR) {
            console.log("in success to remove a tag");
            _processRecipePutResponse(jqXHR, recipe.updateTagStatus);
            return recipe.Tags.remove(tag);
          },
          error: function(jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateTagStatus);
          }
        });
      };
      _updateRecipeName = function(recipe) {
        recipe.updateNameStatus(0);
        return $.ajax({
          type: 'PUT',
          url: "/maintain/recipe/" + recipe.Id + "/{Name: '" + (recipe.Name()) + "'}",
          success: function(data, textStatus, jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateNameStatus);
          },
          error: function(jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateNameStatus);
          }
        });
      };
      _updateRecipeDescription = function(recipe) {
        recipe.updateDescriptionStatus(0);
        return $.ajax({
          type: 'PUT',
          url: "/maintain/recipe/" + recipe.Id + "/{Description: '" + (recipe.Description()) + "'}",
          success: function(data, textStatus, jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateDescriptionStatus);
          },
          error: function(jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateDescriptionStatus);
          }
        });
      };
      _processRecipePutResponse = function(jqXHR, field) {
        field(jqXHR.status);
        setTimeout((function() {
          field(0);
        }), 1000);
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
