(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.DayOfWeek = (function() {
    function DayOfWeek(name) {
      this.name = name;
      this.plannedRecipes = ko.observableArray([]);
    }

    return DayOfWeek;

  })();

}).call(this);
