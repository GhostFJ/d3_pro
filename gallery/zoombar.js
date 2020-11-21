let margin = ({top: 20, right: 0, bottom: 30, left: 40})
    let data_b
    const width = 960
    const height = 600
    const bookInfoRequest = d3.json("novels-2020-11-10.json", {crossOrigin: "anonymous"})
      .then(book_data => {
        const book_info = book_data
        data_b = book_info
        createDiagram()
      })
    
    // 进行sv绘制的主函数
    function createDiagram() {
      console.log(data_b);
      setScales(data_b)
      setAxises()
      draw()
    }

    // 比例尺设置 
    function setScales(data_b) {
      x = d3.scaleBand()
      .domain(data_b.map(d => d.rank))
      .range([margin.left, width - margin.right])
      .padding(0.1)

      y = d3.scaleLinear()
      .domain([0, d3.max(data_b, d => {
        return parseInt(d.tickets)/1000}
        )]).nice()
      .range([height - margin.bottom, margin.top])
    }

    // 设置坐标轴 
    function setAxises() {
      xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues([10,20,30, 40, 50, 60, 70, 80, 90, 100]).tickSizeOuter(0))
      .call(g => g.selectAll('.tick text')
        .attr('transform','rotate(25)'))
      .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -20)
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text("排名"));


      yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("月票/千张"))
    }

    // 绘图函数
    function draw() {
      const svg = d3.select("svg")
      .attr("viewBox", [0, 0, width, height])
      .call(zoom)
      

      function zoom(svg) {
        // 当前视口范围设置为指定的数组 [[x0, y0], [x1, y1]]
        const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];
        // scaleExtent:
        // 将缩放范围设置为指定的 [k0, k1]，其中 k0 为允许缩放的最小因子而 k1 为缩放的最大缩放因子，并返回缩放行为
        // translateExtent:
        // 将当前的平移区间设置为指定的数组: [[x0, y0], [x1, y1]], 
        // 其中 [x0, y0] 为世界的左上角而 [x1, y1] 为世界的右下角，并返回缩放行为
        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));

          function zoomed(event) {
            x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
            svg.selectAll(".bars rect").attr("x", d => x(d.rank)).attr("width", x.bandwidth());
            svg.selectAll(".x-axis").call(xAxis);
          }
      }

      // 提示标签的创建
      let tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(event, d) {
          return "<strong>作者: </strong> <span style='color:pink'>" + d.author + "</span>"+
            "<br><strong>书名: </strong> <span style='color:pink'>" + d.name + "</span>"+
            "<br><strong>月票: </strong> <span style='color:pink'>" + d.tickets + "</span>";
        })

      svg.call(tip)

      // 绘制矩形 
      svg.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(data_b)
      .join("rect")
      .attr("pointer-events", "all")
      .on("click", clicked)
      .attr("class", "bar")
      .attr("x", d => x(d.rank))
      .attr("y", d => y(d.tickets/1000))
      .attr("height", d => y(0) - y(d.tickets/1000))
      .attr("width", x.bandwidth())

      function clicked(event, d) {
        console.log(d)
        if (document.getElementsByClassName("svg-pie")) {
          // 因为绘画的时候是在g里面，所以不是删除svg-pie，多根据F12查看页面元素
          d3.select(".svg-pie").select("g").remove()
        }
        draw_func()
      }

      svg.selectAll('rect')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

      // 绘制坐标轴
      svg.append("g")
          .attr("class", "x-axis")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y-axis")
          .call(yAxis)
          .append("g")
    }