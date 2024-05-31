// Archivo script.js
let pointsGroup = d3.select("#points");

let drag = d3
  .drag()
  .on("start", dragStarted)
  .on("drag", dragged)
  .on("end", dragEnded);

pointsGroup.selectAll("circle").call(drag);

function dragStarted(event, d) {
  d3.select(this)
    .attr("initial-cx", d3.select(this).attr("cx"))
    .attr("initial-cy", d3.select(this).attr("cy"));
}

function dragged(event, d) {
  d3.select(this).attr("cx", event.x).attr("cy", event.y);
}

function dragEnded(event, d) {
  let cx = d3.select(this).attr("cx");
  let cy = d3.select(this).attr("cy");

  let circleId = d3.select(this).attr("id");
  updateCirclePosition(circleId, cx, cy, description);
}

function updateCirclePosition(circleId, cx, cy, description) {
  fetch(`/svg/${circleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cx: cx, cy: cy, description: description }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Circle position updated", data.svg);
    });
}

function addCircle(id, cx, cy, r, fill, description) {
  pointsGroup
    .append("circle")
    .attr("id", id)
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r)
    .attr("fill", fill)
    .attr("description", description)
    .call(drag)
    .on("click", function () {
      // Rellena y abre el modal con los datos del círculo
      document.getElementById("circle-id").innerText = id;
      document.getElementById("circle-position").innerText = `(${cx}, ${cy})`;
      document.getElementById("circle-radius").innerText = r;
      document.getElementById("circle-fill").innerText = fill;
      document.getElementById("circle-description").innerText = description;
      let myModal = new bootstrap.Modal(document.getElementById("circleModal"));
      myModal.show();
    });
}

async function loadCircles() {
  try {
    const response = await fetch("/svg");
    const data = await response.json();
    if (data.svgs) {
      data.svgs.forEach((circle) => {
        addCircle(
          circle._id,
          circle.cx,
          circle.cy,
          circle.r,
          circle.fill,
          circle.description
        );
      });
    }
    console.log("Circles loaded");
  } catch (error) {
    console.error("Error al cargar los círculos:", error);
  }
}

window.onload = loadCircles();

if (document.getElementById("lines")) {
  let circle = d3.select("svg");
  circle.on("dblclick", function (event) {
    let coords = d3.pointer(event);
    let x = coords[0];
    let y = coords[1];
    let r = 15;
    let fill = "red";
    let description = "Hola";

    fetch("/svg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "circle",
        cx: x,
        cy: y,
        r: r,
        fill: fill,
        description: description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        addCircle(data.svg._id, x, y, r, fill, description);
        console.log("Success:", data.svg);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  circle.on("mousemove", function (event) {
    var coords = d3.pointer(event);
    var x = coords[0];
    var y = coords[1];

    d3.select("#txt").text("x: " + x + ", y: " + y);
  });
}
