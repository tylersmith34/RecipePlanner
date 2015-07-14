window.Recipes ?= {}

class Recipes.Maintain
  constructor: () ->
    @recipes = ko.observableArray([])
    @tags = ko.observableArray([])
    @inEditMode = ko.observable(false)
    @recipeUnderEdit = ko.observable({})

    @load = ->
      $.get "/plan/recipes", (recipeResponse) =>
        recipe.isEditing = ko.observable(false) for recipe in recipeResponse
        recipe.Name = ko.observable(recipe.Name) for recipe in recipeResponse
        recipe.updateNameStatus = ko.observable(0) for recipe in recipeResponse
        recipe.updateDescriptionStatus = ko.observable(0) for recipe in recipeResponse
        recipe.Description = ko.observable(recipe.Description) for recipe in recipeResponse
        @recipes(recipeResponse)
      $.get "/plan/recipes/tags", (tagResponse) =>
        @tags(tagResponse)

    @editRecipe = (recipe) =>
      recipe.isEditing(!recipe.isEditing())
      recipe.Description.subscribe (newValue) ->
        _updateRecipeDescription(recipe)
      recipe.Name.subscribe () ->
        _updateRecipeName(recipe)

    _updateRecipeName = (recipe) ->
      recipe.updateNameStatus(0)
      $.ajax
        type: 'PUT'
        url: "/maintain/recipe/#{recipe.Id}/{Name: '#{recipe.Name()}'}"
        success: (data, textStatus, jqXHR) ->
          console.log(jqXHR)
          recipe.updateNameStatus(jqXHR.status)
          setTimeout (->
            recipe.updateNameStatus(0)
            return
          ), 1000
          return

    _updateRecipeDescription = (recipe) ->
      recipe.updateDescriptionStatus(0)
      $.ajax
        type: 'PUT'
        url: "/maintain/recipe/#{recipe.Id}/{Description: '#{recipe.Description()}'}"
        success: (data, textStatus, jqXHR) ->
          console.log(jqXHR)
          recipe.updateDescriptionStatus(jqXHR.status)
          setTimeout (->
            recipe.updateDescriptionStatus(0)
            return
          ), 1000
          return

$ ->
  _viewModel = new Recipes.Maintain()
  ko.applyBindings( _viewModel)
  _viewModel.load()
