let gradientStops;
$(document).ready(function () {
  // Variable for storing the active marker's index
  let activeMarkerIndex = null;

  // Initial gradient stops
  gradientStops = [
    {
      color: "#ff0000",
      position: 0,
    },
    {
      color: "#ffff00",
      position: 0.5,
    },
    {
      color: "#0000ff",
      position: 1,
    },
  ];

  // References to the DOM elements
  const wrapper = $("#gradient-slider-wrapper");
  const background = $("#gradient-slider-background");
  const markers = $("#gradient-slider-markers");
  const colorInputs = $("#color-inputs");

  // Function for updating the gradient and markers
  const updateGradient = () => {
    // Update the gradient
    background.css(
      "background-image",
      `linear-gradient(90deg, ${gradientStops
        .map((stop) => `${stop.color} ${100 * stop.position}%`)
        .join(",")})`
    );

    // Clear the markers and color inputs
    markers.empty();
    colorInputs.empty();

    // Add new markers and color inputs
    gradientStops.forEach((stop, index) => {
      const marker = $("<div>").addClass("gradient-stop-marker");
      const input = $("<input>")
        .attr("type", "color")
        .addClass("color-input");

      marker.css("left", 100 * stop.position + "%");
      input.css("left", 100 * stop.position + "%");

      marker.attr("data-index", index);
      input.attr("data-index", index);

      input.val(stop.color);

      markers.append(marker);
      colorInputs.append(input);
    });
  };

  // Initial update
  updateGradient();

  // Handle mouse down event
  wrapper.on("mousedown", (event) => {
    const target = $(event.target);
    const bounds = event.target.getBoundingClientRect();
    const clickPosition = (event.clientX - bounds.left) / bounds.width;

    if (target.hasClass("gradient-stop-marker")) {
      // Activate the marker
      activeMarkerIndex = parseInt(target.attr("data-index"));
    } else if (!target.hasClass("color-input")) {
      // Find the nearest existing gradient stop
      let nearestStop = gradientStops[0];
      for (const stop of gradientStops) {
        if (
          Math.abs(clickPosition - stop.position) <
          Math.abs(clickPosition - nearestStop.position)
        ) {
          nearestStop = stop;
        }
      }

      // Add a new gradient stop with the color of the nearest stop
      const newStop = {
        color: nearestStop.color,
        position: clickPosition,
      };
      const insertIndex = gradientStops.findIndex(
        (stop) => stop.position > newStop.position
      );

      gradientStops.splice(insertIndex, 0, newStop);

      updateGradient();
    }
  });

  // Handle mouse move event
  wrapper.on("mousemove", (event) => {
    if (activeMarkerIndex === null) return;

    const bounds = wrapper[0].getBoundingClientRect();
    const newPosition = (event.clientX - bounds.left) / bounds.width;

    gradientStops[activeMarkerIndex].position = newPosition;

    updateGradient();
  });

  // Handle mouse up event
  $(document).on("mouseup", (event) => {
    activeMarkerIndex = null;
  });

  // Handle color input changes
  colorInputs.on("input", ".color-input", function () {
    const index = $(this).attr("data-index");
    const newColor = $(this).val();

    gradientStops[index].color = newColor;

    updateGradient();
  });

  $("#gradient-slider-markers").on(
    "dblclick",
    ".gradient-stop-marker",
    function () {
      $(this).remove();
      const index = $(this).attr("data-index");
      $("#color-inputs .color-input").eq(index).remove();

      gradientStops.splice(index, 1);
      //alert(gradientStops);
      updateGradient();
    }
  );
});

// auf .gradient-stop-marker einzeln zugreifen: