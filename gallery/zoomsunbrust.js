    const width_pie = 600
    let radius = width_pie / 8
    
    data = {
      name: "flare",
      children: [
    {
      name: "更新",
      children: [
        {name: "更新章节", children: [
          {name: "AgglomerativeCluster", value: 3938},
          {name: "CommunityStructure", value: 3812},
          {name: "HierarchicalCluster", value: 6714},
          {name: "MergeEdge", value: 743}
        ]},
        {name: "更新时间", children: [
      {name: "BetweennessCentrality", value: 3534},
      {name: "LinkDistance", value: 5731},
      {name: "MaxFlowMinCut", value: 7840},
      {name: "ShortestPaths", value: 5914},
      {name: "SpanningTree", value: 3416}
    ]
    },
        {name: "更新状态", value: 7074}
      ]
    },
    {
      name: "简介",
      children: [
        {name: "滚滚长江东逝水", value: 17010},
      ]
    },
    {
      name: "类型",
      children: Array(7) [
        {name: "玄幻", value: 1759},
        {name: "武侠", value: 2165},
        {name: "科幻", value: 586},
        {name: "奇幻", value: 3331},
        {name: "仙侠", value: 772},
        {name: "悬疑", value: 3322}
      ]
    },
    {
      name: "书评",
      children: [
        {name: "热评1", value: 8833},
        {name: "热评2", value: 1732},
        {name: "热评3", value: 3623},
        {name: "热评4", value: 10066}
      ]
    },
    {
      name: "信息",
      children: [
        {name: "字数", value: 4116},
        {name: "总推荐", value: 4116},
        {name: "周推荐", value: 4116}
      ]
    },
  //   {
  //     name: "physics",
  //     children: [
  //       {name: "DragForce", value: 1082},
  //       {name: "GravityForce", value: 1336},
  //       {name: "IForce", value: 319},
  //       {name: "NBodyForce", value: 10498},
  //       {name: "Particle", value: 2822},
  //       {name: "Simulation", value: 9983},
  //       {name: "Spring", value: 2213},
  //       {name: "SpringForce", value: 1681}
  //   ]
  //   },
  //  {
  //     name: "query",
  //     children: [
  //       {name: "AggregateExpression", value: 1616},
  //       {name: "And", value: 1027},
  //       {name: "Arithmetic", value: 3891},
  //       {name: "Average", value: 891},
  //       {name: "BinaryExpression", value: 2893},
  //       {name: "Comparison", value: 5103},
  //       {name: "CompositeExpression", value: 3677},
  //       {name: "Count", value: 781},
  //       {name: "DateUtil", value: 4141},
  //       {name: "Distinct", value: 933},
  //       {name: "Expression", value: 5130},
  //       {name: "ExpressionIterator", value: 3617},
  //       {name: "Fn", value: 3240},
  //       {name: "If", value: 2732},
  //       {name: "IsA", value: 2039}
  //     ]
  //   },
  //   {
  //     name: "scale",
  //     children: [
  //       {name: "IScaleMap", value: 2105},
  //       {name: "LinearScale", value: 1316},
  //       {name: "LogScale", value: 3151},
  //       {name: "OrdinalScale", value: 3770},
  //       {name: "QuantileScale", value: 2435},
  //       {name: "QuantitativeScale", value: 4839},
  //       {name: "RootScale", value: 1756},
  //       {name: "Scale", value: 4268},
  //       {name: "ScaleType", value: 1821},
  //       {name: "TimeScale", value: 5833}
  //     ]
  //   },
  //   {
  //     name: "util",
  //     children: [
  //       {name: "Arrays", value: 8258},
  //       {name: "Colors", value: 10001},
  //       {name: "Dates", value: 8217},
  //       {name: "Displays", value: 12555},
  //       {name: "Filter", value: 2324},
  //       {name: "Geometry", value: 10993},
  //       {name: "IEvaluable", value: 335},
  //       {name: "IPredicate", value: 383},
  //       {name: "IValueProxy", value: 874},
  //       {name: "Maths", value: 17705},
  //       {name: "Orientation", value: 1486},
  //       {name: "Property", value: 5559},
  //       {name: "Shapes", value: 19118},
  //       {name: "Sort", value: 6887},
  //       {name: "Stats", value: 6557},
  //       {name: "Strings", value: 22026}
  //     ]
  //   },
  //   {
  //     name: "vis",
  //     children: [
  //       {name: "Visualization", value: 16540}
  //     ]
  //   }
]
}
    // 格式化整数
    format = d3.format(",d")
    // 彩虹色，构建一个离散的映射
    color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
    // 处理数据
    partition = data => {
      // hierarchy：
      // 根据指定的层次结构数据构造一个根节点。指定的数据 data 必须为一个表示根节点的对象
      // 在计算布局之前调用 node.sum 和 node.sort, 随后生成 子节点 数组
      const root = d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      // partition: 
      // 使用默认的设置创建一个分区图布局

      // # partition(root)
      // 对指定的 root hierarchy 进行布局，root 节点以及每个后代节点会被附加以下属性:
      // node.x0 - 矩形的左边缘
      // node.y0 - 矩形的上边缘
      // node.x1 - 矩形的右边缘
      // node.y1 - 矩形的下边缘
      // 在将层次数据传递给 treemap 布局之前，必须调用 root.sum。在计算布局之前还可能需要调用 root.sort 对节点进行排序。
      
      // partition.size
      // 如果指定了 size 则将当前的布局尺寸设置为指定的二元数值数组：[width, height]
      return d3.partition()
          .size([2 * Math.PI, root.height + 1])
        (root);
    }

    // 绘制圆环图
    arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))  // 间隙角度
      .padRadius(radius * 1.5)  // 间隔半径决定将两个相邻的扇(环)形分开的固定距离
      .innerRadius(d => d.y0 * radius)  // 内径
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1)) // 外径

    const root = partition(data);

    root.each(d => d.current = d);

    const svg = d3.select(".svg-pie")
        .attr("viewBox", [0, 0, width_pie, width_pie])
        .style("font", "10px sans-serif");

    const g = svg.append("g")
        .attr("transform", `translate(${width_pie / 2},${width_pie / 2})`);

    const path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    function clicked(event, p) {
      parent.datum(p.parent || root);

      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));

      label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  