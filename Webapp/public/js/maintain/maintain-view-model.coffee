window.Recipes ?= {}

class Recipes.Maintain
  constructor: () ->
    @recipes = ko.observableArray([])
    @tags = ko.observableArray([])

    @load = ->
      $.get "/plan/recipes", (recipeResponse) =>
        recipe.isEditing = ko.observable(false) for recipe in recipeResponse
        @recipes(recipeResponse)
      $.get "/plan/recipes/tags", (tagResponse) =>
        @tags(tagResponse)

    @editRecipe = (recipe) ->
      recipe.isEditing(true)


$ ->
  _viewModel = new Recipes.Maintain()
  ko.applyBindings( _viewModel)
  _viewModel.load()
