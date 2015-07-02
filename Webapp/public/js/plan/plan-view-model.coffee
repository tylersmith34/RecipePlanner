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

    _tagWasSelected = (tagToFind) =>
      found = false
      found = true for tag in @selectedTags() when tag.Id == tagToFind.Id
      found

    @filteredRecipes = ko.computed =>
      recipes = []
      @recipes().forEach (recipe) =>
        numberOfMatches = 0
        numberOfMatches++ for tag in recipe.Tags when _tagWasSelected(tag)
        if numberOfMatches is @selectedTags().length
          recipes.push(recipe)
      recipes

    @load = ->
      _configureDroppables()
      $.get "/plan/recipes", (recipeResponse) =>
        recipe.expanded = ko.observable(false) for recipe in recipeResponse
        @recipes(recipeResponse)
        $('.recipe').draggable({
          # containment: ".list-group"
          # scroll: false
          })
      $.get "/plan/recipes/tags", (tagResponse) =>
        tag.visible = ko.observable(true) for tag in tagResponse
        @uniqueTags(tagResponse)

    _configureDroppables = ->
      $('.dayOfWeek').droppable({
        accept: '.recipe'
        hoverClass: "draggable-target"
        activeClass: "ui-state-default",
        # drop: ( event, ui ) ->
        #   $( this )
        #     .addClass( "ui-state-highlight" )
        })

    @selectTag = (tag) =>
      @selectedTags.push(tag)
      tag.visible(false)

    @deselectTag = (tag) =>
      @selectedTags.remove(tag)
      tag.visible(true)

    @toggleRecipeDetails = (recipe) ->
      recipe.expanded(!recipe.expanded())

    @resetFilters = =>
      tag.visible(true) for tag in @uniqueTags()
      @selectedTags.removeAll()


$ ->
  _viewModel = new Recipes.Plan()
  ko.applyBindings(_viewModel)
  _viewModel.load()
