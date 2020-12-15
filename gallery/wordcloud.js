function wordcloud() {
  d3.select("#ticketShow").remove()
  if (document.getElementById("wordCloudShow"))
    d3.select("#wordCloudShow").remove()
  d3.json("novels-2020-11-10.json", {crossOrigin: "anonymous"})
      .then(book_data => {

        word_data = book_data.map((d) => {
          return {text: d.name, size: d.tickets}
        })
        drawWordCloud(word_data);
      })
}

function drawWordCloud(word_data) {
  const words_list = word_data;

  fill = d3.scaleOrdinal(d3.schemeCategory10);

  layout = d3.layout.cloud()
    .size([960, 600])  //size([x,y]) 词云显示的大小
    .words(words_list)
    .padding(1)
    .rotate(function() { return ~~(Math.random() * 2) * 0; })
    .font("Impact")
    .fontSize(function(d) { return d.size/1000 > 8 ? d.size/1000 : 8; })
    // .spiral("archimedean")  // 单词螺旋类型
    .on("end", draw);

  layout.start();


  function draw(words) {
    
    d3.select("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("id", "wordCloudShow")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Verdana, Arial, Helvetica, sans-serif")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x-2/10, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .classed("click-only-text", true)
        .classed("word-default", true)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick);

        function handleMouseOver(d, i) {
          d3.select(this)
            .classed("word-hovered", true)
            .transition(`mouseover-${d.text}`).duration(200).ease(d3.easeLinear)
              .attr("font-size", d.size + 100)
              .attr("font-weight", "bold");
        }
        
        function handleMouseOut(d, i) {
          d3.select(this)
            .classed("word-hovered", false)
            .interrupt(`mouseover-${d.text}`)
              .attr("font-size", d.size);
        }
        
        function handleClick(d, i) {
          var e = d3.select(this);
          e.classed("word-selected", !e.classed("word-selected"));
        }
  }    //word cloud layout  词云布局，d3布局中为词云设立的单独的一种布局方式    //d3.layout.cloud() 构造一个词云的布局实例
}