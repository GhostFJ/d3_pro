 
 function draw_func(index) {
      const everyInfoRequest = d3.json("each_novel_info.json", {crossOrigin: "anonymous"})
        .then(every_book_data => {
          let data = every_book_data[index]
          draw_pie_func(data)
      })

  function draw_pie_func(data)
  {
        const width_pie = 400
        let radius = width_pie / 8
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
            .attr("transform", "translate(" + "600" + "," + "250)");
            // .attr("transform", `translate(${width_pie / 2},${width_pie / 2})`);

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
      }
  }

 
    
  