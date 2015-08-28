window.Recipes ?= {}

class Recipe
  constructor: (@name, @description) ->
    @Name = ko.observable(@name)
    @Description = ko.observable(@description)
    @Tags = ko.observableArray()

class Recipes.Maintain
  constructor: () ->
    @recipes = ko.observableArray([])
    @tags = ko.observableArray([])
    @inEditMode = ko.observable(false)
    @recipeUnderEdit = ko.observable({})
    @recipeToAdd = new Recipe()

    @load = ->
      $.get "/plan/recipes", (recipeResponse) =>
        recipe.isEditing = ko.observable(false) for recipe in recipeResponse
        recipe.Name = ko.observable(recipe.Name) for recipe in recipeResponse
        recipe.updateNameStatus = ko.observable(0) for recipe in recipeResponse
        recipe.updateDescriptionStatus = ko.observable(0) for recipe in recipeResponse
        recipe.updateTagStatus = ko.observable(0) for recipe in recipeResponse
        recipe.Description = ko.observable(recipe.Description) for recipe in recipeResponse
        recipe.Tags = ko.observableArray(recipe.Tags) for recipe in recipeResponse
        @recipes(recipeResponse)
      $.get "/plan/recipes/tags", (tagResponse) =>
        tag.visible = ko.observable(yes) for tag in tagResponse
        @tags(tagResponse)

    @editRecipe = (recipe) ->
      recipe.isEditing(!recipe.isEditing())
      recipe.Description.subscribe (newValue) ->
        _updateRecipeDescription(recipe)
      recipe.Name.subscribe () ->
        _updateRecipeName(recipe)

    _findIndexOfTag = (id, tags) ->
        tags.map((e) ->
          e.Id
        ).indexOf id

    @removeTagFromRecipe = (recipe, tag) ->
      $.ajax
        type: 'DELETE'
        url: "/maintain/recipe/#{recipe.Id}/#{tag.Id}}"
        success: (data, textStatus, jqXHR) ->
          _processRecipePutResponse(jqXHR, recipe.updateTagStatus)
          recipe.Tags.splice(_findIndexOfTag(tag.Id, recipe.Tags()), 1)
        error: (jqXHR) ->
          _processRecipePutResponse(jqXHR, recipe.updateTagStatus)

    @removeTagFromNewRecipe = (tag) ->
      @recipeToAdd.Tags.splice(_findIndexOfTag(tag.Id, @recipeToAdd.Tags()), 1)
      tag.visible(yes)

    @areTagsAvailable = ko.computed =>
        count = 0
        count++ for tag in @tags() when tag.visible() is yes
        return count > 0

    @showTagModalForRecipe = (recipe) =>
      @recipeUnderEdit(recipe)
      tag.visible(yes) for tag in @tags()
      for selectedTag in recipe.Tags()
        tag.visible(no) for tag in @tags() when selectedTag.Id is tag.Id

    @selectTagForExistingRecipe = (tag) =>
      @recipeUnderEdit().Tags.push(tag)
      tag.visible(no)

    @cancelAddingNewRecipe = =>
      tag.visible(yes) for tag in @tags()
      @recipeToAdd.Name('')
      @recipeToAdd.Description('')
      @recipeToAdd.Tags.removeAll()

    @selectTagForNewRecipe = (tag) =>
      @recipeToAdd.Tags.push(tag)
      tag.visible(no)

    _updateRecipeName = (recipe) ->
      recipe.updateNameStatus(0)
      $.ajax
        type: 'PUT'
        url: "/maintain/recipe/#{recipe.Id}/{Name: '#{recipe.Name()}'}"
        success: (data, textStatus, jqXHR) ->
          _processRecipePutResponse(jqXHR, recipe.updateNameStatus)
        error:  (jqXHR) ->
          _processRecipePutResponse(jqXHR, recipe.updateNameStatus)

    _updateRecipeDescription = (recipe) ->
      recipe.updateDescriptionStatus(0)
      $.ajax
        type: 'PUT'
        url: "/maintain/recipe/#{recipe.Id}/{Description: '#{recipe.Description()}'}"
        success: (data, textStatus, jqXHR) ->
          _processRecipePutResponse(jqXHR, recipe.updateDescriptionStatus)
        error:  (jqXHR) ->
          _processRecipePutResponse(jqXHR, recipe.updateDescriptionStatus)

    _processRecipePutResponse = (jqXHR, field) ->
      field(jqXHR.status)
      setTimeout (->
        field(0)
        return
      ), 1000
      return

$ ->
  _viewModel = new Recipes.Maintain()
  ko.applyBindings( _viewModel)
  _viewModel.load()
