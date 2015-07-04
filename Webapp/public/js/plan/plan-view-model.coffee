window.Recipes ?= {}

class Recipes.Plan
  constructor: () ->
    @loading = ko.observable(false)
    @recipes = ko.observableArray([])
    @uniqueTags = ko.observableArray([])
    @selectedTags = ko.observableArray([])
    @daysOfWeek = ko.observableArray([])
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
        if numberOfMatches is @selectedTags().length and recipe.planned() is not yes
          recipes.push(recipe)
      recipes

    @load = ->
      _configureDaysOfWeek()
      _configureDroppables()
      $.get "/plan/recipes", (recipeResponse) =>
        recipe.expanded = ko.observable(false) for recipe in recipeResponse
        recipe.planned = ko.observable(false) for recipe in recipeResponse
        @recipes(recipeResponse)
        _configureDraggables()
      $.get "/plan/recipes/tags", (tagResponse) =>
        tag.visible = ko.observable(true) for tag in tagResponse
        @uniqueTags(tagResponse)

    _configureDraggables = ->
      $('.recipe').draggable({
        scroll: false
        revert: "invalid"
        })

    _configureDroppables = ->
      $('.dayOfWeek').droppable({
        accept: '.recipe'
        hoverClass: "draggable-target"
        activeClass: "ui-state-default",
        drop: ( event, ui ) ->
          dayOfWeekName = $(this)[0].attributes["data-name"].value
          dataId = ui.draggable[0].attributes["data-id"].value
          foundDay = _findDayOfWeekByName(dayOfWeekName)
          foundRecipe = _findRecipeById(dataId)
          foundRecipe.planned(true)
          foundDay.plannedRecipes.push(foundRecipe)
          # $( this ).addClass( "ui-state-highlight" )
        })

    _findRecipeById = (id) =>
      recipeToFind
      idAsInt = parseInt(id)
      recipeToFind = recipe for recipe in @recipes() when recipe.Id is idAsInt
      recipeToFind

    _findDayOfWeekByName = (name) =>
      day = dayOfWeek for dayOfWeek in @daysOfWeek() when dayOfWeek.name is name
      day

    _configureDaysOfWeek = =>
      @daysOfWeek.push(new Recipes.DayOfWeek('Monday'))
      @daysOfWeek.push(new Recipes.DayOfWeek('Tuesday'))
      @daysOfWeek.push(new Recipes.DayOfWeek('Wednesday'))
      @daysOfWeek.push(new Recipes.DayOfWeek('Thursday'))
      @daysOfWeek.push(new Recipes.DayOfWeek('Friday'))
      @daysOfWeek.push(new Recipes.DayOfWeek('Saturday'))
      @daysOfWeek.push(new Recipes.DayOfWeek('Sunday'))

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
