# Dashboard
  * axios call for asset_orders
    * for assets grouped by name (avg purchase price, total dollars, +\- for day (api call from server? to get +/-) ) 
    * for asset purchases grouped individually (stats for individual investment)

  * stats for portfolio
    * API to get total profit per asset from db
    * db call to get total investment dollars and timeframe
    * total amount of spec money left - db call

  * Axios call to get all portfolios for pagination at top of page

    * pagination starts on first portfolio made
      * stats for portfolio is filled out (left of hero-graph) as each item is clicked the graph renders the data of the following:
        * Total profit (starting state for hero graph)
        * Total investments (graph show times and amounts invested over time)
        * if spec = true - amount of spec money left in tank
      * Stats for individual investment (pagination) As each asset is selected off the bottom its purchases will populate component with:
        * Quantity - purchase price - date
        * Quantity - purchase price - date
        * etc...
      * stats for individual asset (When each item is clicked it populates hero graph)
        * name - total dollars in value - quantity - avg purchase price - +/- for day
  * Action button (materialUi speed dial)
