window.Recipes ?= {}

class Recipes.Plan
  constructor: () ->
    @loading = ko.observable(false)
    @recipes = ko.observableArray([])
    @uniqueTags = ko.observableArray([])
    @selectedTags = ko.observableArray([])
    @numberOfUnselectedTags = ko.computed =>
      count = 0
      count++ for visible in @uniqueTags() when visible.visible() is true
      return count

    @tagWasSelected = (tagToFind) =>
      found = false
      @selectedTags().forEach (tag) ->
        if tag.Id == tagToFind.Id
          found = true
      found

    @filteredRecipes = ko.computed =>
      recipes = []
      @recipes().forEach (recipe) =>
        numberOfMatches = 0
        numberOfMatches++ for tag in recipe.Tags when @tagWasSelected(tag)
        if numberOfMatches is @selectedTags().length
          recipes.push(recipe)
      recipes

    @load = ->
      $.get "/plan/recipes", (recipeResponse) =>
        recipe.expanded = ko.observable(false) for recipe in recipeResponse
        @recipes(recipeResponse)
      $.get "/plan/recipes/tags", (tagResponse) =>
        tag.visible = ko.observable(true) for tag in tagResponse
        @uniqueTags(tagResponse)

    @selectTag = (tag) =>
      @selectedTags.push(tag)
      tag.visible(false)

    @deselectTag = (tag) =>
      @selectedTags.remove(tag)
      tag.visible(true)

    @toggleRecipeDetails = (recipe) ->
      recipe.expanded(!recipe.expanded())
$ ->
  _viewModel = new Recipes.Plan()
  ko.applyBindings(_viewModel)
  _viewModel.load()
