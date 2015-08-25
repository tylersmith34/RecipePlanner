(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.Maintain = (function() {
    function Maintain() {
      var _findIndexOfTag, _processRecipePutResponse, _updateRecipeDescription, _updateRecipeName;
      this.recipes = ko.observableArray([]);
      this.tags = ko.observableArray([]);
      this.inEditMode = ko.observable(false);
      this.recipeUnderEdit = ko.observable({});
      this.load = function() {
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, o, recipe;
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
            for (o = 0, len6 = recipeResponse.length; o < len6; o++) {
              recipe = recipeResponse[o];
              recipe.Tags = ko.observableArray(recipe.Tags);
            }
            return _this.recipes(recipeResponse);
          };
        })(this));
        return $.get("/plan/recipes/tags", (function(_this) {
          return function(tagResponse) {
            var i, j, len, len1, tag;
            for (i = 0, len = tagResponse.length; i < len; i++) {
              tag = tagResponse[i];
              tag.selected = ko.observable(false);
            }
            for (j = 0, len1 = tagResponse.length; j < len1; j++) {
              tag = tagResponse[j];
              tag.visible = ko.observable(true);
            }
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
      _findIndexOfTag = function(id, tags) {
        return tags.map(function(e) {
          return e.Id;
        }).indexOf(id);
      };
      this.removeTagFromRecipe = function(recipe, tag) {
        return $.ajax({
          type: 'DELETE',
          url: "/maintain/recipe/" + recipe.Id + "/" + tag.Id + "}",
          success: function(data, textStatus, jqXHR) {
            _processRecipePutResponse(jqXHR, recipe.updateTagStatus);
            return recipe.Tags.splice(_findIndexOfTag(tag.Id, recipe.Tags()), 1);
          },
          error: function(jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateTagStatus);
          }
        });
      };
      this.showTagModalForRecipe = (function(_this) {
        return function(recipe) {
          var i, j, len, len1, ref, ref1, results, selectedTag, tag;
          _this.recipeUnderEdit(recipe);
          ref = _this.tags();
          for (i = 0, len = ref.length; i < len; i++) {
            tag = ref[i];
            tag.visible(true);
          }
          ref1 = recipe.Tags();
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            selectedTag = ref1[j];
            results.push((function() {
              var k, len2, ref2, results1;
              ref2 = this.tags();
              results1 = [];
              for (k = 0, len2 = ref2.length; k < len2; k++) {
                tag = ref2[k];
                if (selectedTag.Id === tag.Id) {
                  results1.push(tag.visible(false));
                }
              }
              return results1;
            }).call(_this));
          }
          return results;
        };
      })(this);
      this.selectTagForRecipe = (function(_this) {
        return function(tag) {
          _this.recipeUnderEdit().Tags.push(tag);
          return tag.visible(false);
        };
      })(this);
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
