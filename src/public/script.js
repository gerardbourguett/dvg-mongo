const socket = io();

socket.on("ping", async (ip) => {
  socket.emit("pong");
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("paths.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("lines").innerHTML = data;

      d3.selectAll("#svg g#lines path")
        .on("mouseover", function (event) {
          d3.select("#txt").text(" - Path Hovered");
        })
        .on("mouseout", function (event) {
          d3.select("#txt").text("");
        });
    })
    .catch((error) => console.error("Error loading the SVG paths:", error));
});

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
  let description = d3.select(this).attr("description");
  let ip_address = d3.select(this).attr("ip_address");
  let ip_status = d3.select(this).attr("ip_status");

  let circleId = d3.select(this).attr("id");
  updateCirclePosition(circleId, cx, cy, description, ip_address, ip_status);
}

function updateCirclePosition(
  circleId,
  cx,
  cy,
  description,
  ip_address,
  ip_status
) {
  fetch(`/api/svg/${circleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cx: cx,
      cy: cy,
      description: description,
      ip_address: ip_address,
      ip_status: ip_status,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Circle position updated", data.svg);
    });
}

function addCircle(id, cx, cy, r, fill, description, ip_address, ip_status) {
  pointsGroup
    .append("circle")
    .attr("id", id)
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r)
    .attr("fill", fill)
    .attr("description", description)
    .attr("ip_address", ip_address)
    .attr("ip_status", ip_status)
    .call(drag)
    .on("click", function () {
      document.getElementById("circle-id").innerText = id;
      document.getElementById("circle-position").innerText = `(${cx}, ${cy})`;
      document.getElementById("circle-ip").innerText = ip_address;
      document.getElementById("circle-status").innerText = ip_status;
      document.getElementById("circle-description").innerText = description;
      let myModal = new bootstrap.Modal(document.getElementById("circleModal"));
      myModal.show();
    });
}

async function loadCircles() {
  try {
    const response = await fetch("/api/svg");
    const data = await response.json();
    if (data.svgs) {
      data.svgs.forEach((circle) => {
        addCircle(
          circle._id,
          circle.cx,
          circle.cy,
          circle.r,
          circle.fill,
          circle.description,
          circle.ip_address,
          circle.ip_status
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
  let addDetailsModal;
  let currentCoords = [];

  circle.on("dblclick", function (event) {
    let coords = d3.pointer(event);
    currentCoords = coords;

    addDetailsModal = new bootstrap.Modal(
      document.getElementById("addDetailsModal")
    );
    addDetailsModal.show();
  });

  document
    .getElementById("saveDetailsBtn")
    .addEventListener("click", function () {
      let x = currentCoords[0];
      let y = currentCoords[1];
      let r = 10;
      let fill = "blue";
      const ip_status = false;
      let description = document.getElementById("descriptionInput").value;
      let ip_address = document.getElementById("ipInput").value;

      console.log(x, y, r, fill, description, ip_address, ip_status);

      fetch("/api/svg", {
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
          ip_address: ip_address,
          ip_status: ip_status,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          addCircle(data.svg._id, x, y, r, fill, description, ip_address);
          console.log("Success:", data.svg);
          addDetailsModal.hide();
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
