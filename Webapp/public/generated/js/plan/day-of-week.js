(function() {
  if (window.Recipes == null) {
    window.Recipes = {};
  }

  Recipes.DayOfWeek = (function() {
    function DayOfWeek(name, number) {
      this.name = name;
      this.number = number;
      this.plannedRecipes = ko.observableArray([]);
      this.allowRecipeToMoveUp = ko.computed((function(_this) {
        return function() {
          return _this.number > 1;
        };
      })(this));
      this.allowRecipeToMoveDown = ko.computed((function(_this) {
        return function() {
          return _this.number < 7;
        };
      })(this));
    }

    return DayOfWeek;

  })();

}).call(this);
