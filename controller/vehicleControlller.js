$(document).ready(function () {
    var editIndex = -1;

    // Fetch and load data from the backend
    function loadVehicles() {
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            alert("Please log in!");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/green-shadow/api/v1/vehicles",
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                renderVehicleTable(data);
            },
            error: function (xhr, status, error) {
                console.error("Failed to load vehicles:", status, error);
                alert("Failed to load vehicles!");
            }
        });
    }

    // Render Vehicle Table
    function renderVehicleTable(vehicles) {
        $('#vehicleTable tbody').empty();
        vehicles.forEach((vehicle, index) => {
            $('#vehicleTable tbody').append(`
                <tr>
                    <td>${vehicle.vehicleCode}</td>
                    <td>${vehicle.licencePlateNumber}</td>
                    <td>${vehicle.name}</td>
                    <td>${vehicle.category}</td>
                    <td>${vehicle.fuelType}</td>
                    <td>${vehicle.remark}</td>
                    <td>${vehicle.status}</td>
                    <td>${vehicle.memberCode}</td>
                    <td>
                        <button class="btn btn-primary edit-vehicle-btn" data-id="${vehicle.vehicleCode}" data-index="${index}">Edit</button>
                        <button class="btn btn-danger delete-vehicle-btn" data-id="${vehicle.vehicleCode}">Delete</button>
                    </td>
                </tr>
            `);
        });
    }

    // Save or Update Vehicle
    $('#vehicleForm').submit(function (e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append('licencePlateNumber', $('#licensePlate').val());
        formData.append('name', $('#vehicleName').val());
        formData.append('category', $('#vehicleCategory').val());
        formData.append('fuelType', $('#fuelType').val());
        formData.append('remark', $('#remark').val());
        formData.append('status', $('#status').val());
        formData.append('memberCode', $('#staffId').val());

        const url = editIndex === -1
            ? "http://localhost:8080/green-shadow/api/v1/vehicles"
            : `http://localhost:8080/green-shadow/api/v1/vehicles/${editIndex}`;
        const method = editIndex === -1 ? "POST" : "PUT";

        var token = localStorage.getItem('jwtToken');
        if (!token) {
            alert("Please log in!");
            return;
        }

        $.ajax({
            url: url,
            method: method,
            contentType: false,
            processData: false,
            data: formData,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function () {
                $('#vehicleModal').modal('hide');
                $('#vehicleForm')[0].reset();
                loadVehicles();
            },
            error: function (xhr, status, error) {
                console.error("Failed to save vehicle:", status, error);
                alert("Failed to save vehicle!");
            }
        });
    });

    // Edit Vehicle
    $(document).on('click', '.edit-vehicle-btn', function () {
        const id = $(this).data("id");
        editIndex = id;

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/vehicles/${id}`,
            method: "GET",
            success: function (vehicle) {
                $('#licensePlate').val(vehicle.licencePlateNumber);
                $('#vehicleName').val(vehicle.name);
                $('#vehicleCategory').val(vehicle.category);
                $('#fuelType').val(vehicle.fuelType);
                $('#remark').val(vehicle.remark);
                $('#status').val(vehicle.status);
                $('#staffId').val(vehicle.memberCode);

                $('#vehicleModalLabel').text('Edit Vehicle');
                $('#vehicleModal').modal('show');
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch vehicle data:", status, error);
                alert("Failed to fetch vehicle data!");
            }
        });
    });

    // Delete Vehicle
    $(document).on('click', '.delete-vehicle-btn', function () {
        const id = $(this).data("id");

        var token = localStorage.getItem('jwtToken');
        if (!token) {
            alert("Please log in!");
            return;
        }

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/vehicles/${id}`,
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function () {
                loadVehicles();
            },
            error: function (xhr, status, error) {
                console.error("Failed to delete vehicle:", status, error);
                alert("Failed to delete vehicle!");
            }
        });
    });

    // Initial Load
    loadVehicles();
});
