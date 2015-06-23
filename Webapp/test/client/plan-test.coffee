suite "Plan View Model Tests", ->
  viewModel = null

  setup ->
    viewModel = new Reciples.Plan()

    suite "Data loading", ->
      test "load recipes", ->
        console.log "in test"
        expect(1).to.equal(2)
