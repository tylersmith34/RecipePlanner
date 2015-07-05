window.Recipes ?= {}

class Recipes.DayOfWeek
  constructor: (name, number) ->
    @name = name
    @number = number
    @plannedRecipes = ko.observableArray([])

    @allowRecipeToMoveUp = ko.computed =>
      @number > 1

    @allowRecipeToMoveDown = ko.computed =>
      @number < 7
