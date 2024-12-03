document.addEventListener("DOMContentLoaded", () => {
    const vehiclesLink = document.getElementById("vehicles-link");
    const vehiclesSection = document.getElementById("vehicles-section");
    const closeVehiclesButton = document.getElementById("close-vehicles");
    vehiclesLink.addEventListener("click", (event) => {
        event.preventDefault();
        vehiclesSection.classList.toggle("hidden");
    });

    closeVehiclesButton.addEventListener("click", () => {
        vehiclesSection.classList.add("hidden");
    });

    
});
