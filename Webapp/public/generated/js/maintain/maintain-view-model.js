(function() {
  var Recipe;

  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipe = (function() {
    function Recipe(name1, description1) {
      this.name = name1;
      this.description = description1;
      this.Name = ko.observable(this.name);
      this.Description = ko.observable(this.description);
      this.Tags = ko.observableArray();
    }

    return Recipe;

  })();

  Recipes.Maintain = (function() {
    function Maintain() {
      var _findIndexOfTag, _processRecipePutResponse, _updateRecipeDescription, _updateRecipeName;
      this.recipes = ko.observableArray([]);
      this.tags = ko.observableArray([]);
      this.inEditMode = ko.observable(false);
      this.recipeUnderEdit = ko.observable({});
      this.recipeToAdd = new Recipe();
      this.revertingNameValue = ko.observable(false);
      this.errorMessage = ko.observable();
      this.tagNameToAdd = ko.observable();
      this.load = function() {
        $.get("/plan/recipes", (function(_this) {
          return function(recipeResponse) {
            var i, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, o, p, recipe;
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
              recipe.oldName = ko.observable(recipe.Name());
            }
            for (l = 0, len3 = recipeResponse.length; l < len3; l++) {
              recipe = recipeResponse[l];
              recipe.updateNameStatus = ko.observable(0);
            }
            for (m = 0, len4 = recipeResponse.length; m < len4; m++) {
              recipe = recipeResponse[m];
              recipe.updateDescriptionStatus = ko.observable(0);
            }
            for (n = 0, len5 = recipeResponse.length; n < len5; n++) {
              recipe = recipeResponse[n];
              recipe.updateTagStatus = ko.observable(0);
            }
            for (o = 0, len6 = recipeResponse.length; o < len6; o++) {
              recipe = recipeResponse[o];
              recipe.Description = ko.observable(recipe.Description);
            }
            for (p = 0, len7 = recipeResponse.length; p < len7; p++) {
              recipe = recipeResponse[p];
              recipe.Tags = ko.observableArray(recipe.Tags);
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
          url: "/maintain/recipe/" + recipe.Id + "/" + tag.Id,
          success: function(data, textStatus, jqXHR) {
            _processRecipePutResponse(jqXHR, recipe.updateTagStatus);
            return recipe.Tags.splice(_findIndexOfTag(tag.Id, recipe.Tags()), 1);
          },
          error: function(jqXHR) {
            return _processRecipePutResponse(jqXHR, recipe.updateTagStatus);
          }
        });
      };
      this.removeTagFromNewRecipe = function(tag) {
        this.recipeToAdd.Tags.splice(_findIndexOfTag(tag.Id, this.recipeToAdd.Tags()), 1);
        return tag.visible(true);
      };
      this.areTagsAvailable = ko.computed((function(_this) {
        return function() {
          var count, i, len, ref, tag;
          count = 0;
          ref = _this.tags();
          for (i = 0, len = ref.length; i < len; i++) {
            tag = ref[i];
            if (tag.visible() === true) {
              count++;
            }
          }
          return count > 0;
        };
      })(this));
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
      this.selectTagForExistingRecipe = (function(_this) {
        return function(tag) {
          _this.recipeUnderEdit().Tags.push(tag);
          tag.visible(false);
          return $.ajax({
            type: 'post',
            url: "/maintain/recipe/" + (_this.recipeUnderEdit().Id) + "/" + tag.Id
          });
        };
      })(this);
      this.cancelAddingNewRecipe = (function(_this) {
        return function() {
          var i, len, ref, tag;
          ref = _this.tags();
          for (i = 0, len = ref.length; i < len; i++) {
            tag = ref[i];
            tag.visible(true);
          }
          _this.recipeToAdd.Name('');
          _this.recipeToAdd.Description('');
          return _this.recipeToAdd.Tags.removeAll();
        };
      })(this);
      this.selectTagForNewRecipe = (function(_this) {
        return function(tag) {
          _this.recipeToAdd.Tags.push(tag);
          return tag.visible(false);
        };
      })(this);
      this.tagsForNewRecipe = ko.computed((function(_this) {
        return function() {
          var data, i, len, ref, tag;
          data = [];
          ref = _this.recipeToAdd.Tags();
          for (i = 0, len = ref.length; i < len; i++) {
            tag = ref[i];
            data.push(tag.Id);
          }
          return data;
        };
      })(this));
      this.addNewRecipe = (function(_this) {
        return function() {
          return $.ajax({
            type: 'POST',
            url: '/maintain/new/recipe',
            data: $('#newRecipeForm').serialize(),
            success: function(data, textStatus, jqXHR) {
              _this.recipeToAdd.id = textStatus;
              _this.recipeToAdd.updateNameStatus = ko.observable(0);
              _this.recipeToAdd.updateDescriptionStatus = ko.observable(0);
              _this.recipes.push(_this.recipeToAdd);
              _this.recipeToAdd = new Recipe();
              _this.errorMessage('');
              return $('#addRecipeModal').modal('hide');
            },
            error: function(jqXHR) {
              return _this.errorMessage("Unable to add the recipe. Error code " + jqXHR.status + ", " + jqXHR.responseText);
            }
          });
        };
      })(this);
      this.addNewTag = (function(_this) {
        return function() {
          return $.ajax({
            type: 'POST',
            url: '/maintain/new/tag',
            data: $('#newTagForm').serialize(),
            success: function(data, textStatus, jqXHR) {
              _this.errorMessage('');
              _this.tagNameToAdd('');
              $('#addTagModal').modal('hide');
              return $.get("/plan/recipes/tags", function(tagResponse) {
                var i, len, tag;
                for (i = 0, len = tagResponse.length; i < len; i++) {
                  tag = tagResponse[i];
                  tag.visible = ko.observable(true);
                }
                return _this.tags(tagResponse);
              });
            },
            error: function(jqXHR) {
              return _this.errorMessage("Unable to add the tag. Error code " + jqXHR.status + ", " + jqXHR.responseText);
            }
          });
        };
      })(this);
      _updateRecipeName = (function(_this) {
        return function(recipe) {
          var name;
          recipe.updateNameStatus(0);
          if (_this.revertingNameValue() === false && recipe.Name() !== null) {
            name = recipe.Name() ? recipe.Name() : null;
            return $.ajax({
              type: 'PUT',
              url: "/maintain/recipe/" + recipe.Id + "/name/" + name,
              success: function(data, textStatus, jqXHR) {
                return _processRecipePutResponse(jqXHR, recipe.updateNameStatus);
              },
              error: function(jqXHR) {
                recipe.Name(recipe.oldName());
                return _processRecipePutResponse(jqXHR, recipe.updateNameStatus);
              }
            });
          } else {
            _this.revertingNameValue(true);
            recipe.Name(recipe.oldName());
            return _processRecipePutResponse({
              status: 400
            }, recipe.updateNameStatus);
          }
        };
      })(this);
      this.revertingNameValue(false);
      _updateRecipeDescription = function(recipe) {
        var description;
        recipe.updateDescriptionStatus(0);
        description = recipe.Description() ? recipe.Description() : null;
        return $.ajax({
          type: 'PUT',
          url: "/maintain/recipe/" + recipe.Id + "/descr/" + description,
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
        }), 5000);
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
