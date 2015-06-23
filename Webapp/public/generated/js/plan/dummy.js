(function() {
  Recipes.Plan = (function() {
    function Plan() {
      console.log("in plan vm");
    }

    return Plan;

  })();

  $(function() {
    return ko.applyBindings(new Recipes.plan);
  });

}).call(this);
