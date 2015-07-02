window.Recipes ?= {}

class Recipes.DayOfWeek
  constructor: (name) ->
    @name = name
    @plannedRecipes = ko.observableArray([])
