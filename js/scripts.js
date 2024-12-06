// File: js/scripts.js
$(document).ready(function() {

    /**
     * Function to display alerts.
     * @param {string} elementId - ID of the alert container.
     * @param {string} message - Alert message.
     * @param {string} type - Type of alert ('success' or 'danger').
     */
    function showAlert(elementId, message, type = 'danger') {
        const alertHtml = `<div class="alert alert-${type}">
                                <span>${message}</span>
                                <span class="close-alert">&times;</span>
                           </div>`;
        $(`#${elementId}`).html(alertHtml);
    }

    /**
     * Function to clear alerts.
     * @param {string} elementId - ID of the alert container.
     */
    function clearAlert(elementId) {
        $(`#${elementId}`).html('');
    }

    /**
     * Function to toggle between Sign-In and Sign-Up forms.
     */
    function setupFormToggle() {
        $('#showSignup').on('click', function() {
            $('#signin-form').hide();
            $('#signup-form').show();
            clearAlert('signinAlert');
            clearAlert('signupAlert');
        });

        $('#showSignin').on('click', function() {
            $('#signup-form').hide();
            $('#signin-form').show();
            clearAlert('signinAlert');
            clearAlert('signupAlert');
        });
    }

    /**
     * Function to handle Sign-In form submission.
     */
    $('#signinForm').on('submit', function(event) {
        event.preventDefault();

        // Clear previous alerts
        clearAlert('signinAlert');

        // Gather form data
        const data = {
            username: $('#signinUsername').val().trim(),
            password: $('#signinPassword').val().trim()
        };

        // Simple client-side validation
        if (!data.username || !data.password) {
            showAlert('signinAlert', 'Please enter both username and password.', 'danger');
            return;
        }

        // AJAX POST request to signin
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/auth/signin',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                // Assuming the response contains a token
                if (response.token) {
                    // Store the JWT token in localStorage
                    localStorage.setItem('token', response.token);
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    showAlert('signinAlert', 'Invalid response from server.', 'danger');
                }
            },
            error: function(xhr) {
                const error = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An error occurred during signin.';
                showAlert('signinAlert', error, 'danger');
            }
        });
    });

    /**
     * Function to handle Sign-Up form submission.
     */
    $('#signupForm').on('submit', function(event) {
        event.preventDefault();

        // Clear previous alerts
        clearAlert('signupAlert');

        // Gather form data
        const data = {
            username: $('#signupUsername').val().trim(),
            email: $('#signupEmail').val().trim(),
            password: $('#signupPassword').val().trim(),
            role: [$('#signupRole').val()] // Assuming backend expects roles as an array
        };

        // Simple client-side validation
        if (!data.username || !data.email || !data.password || !data.role[0]) {
            showAlert('signupAlert', 'Please fill in all the required fields.', 'danger');
            return;
        }

        // Additional validation can be added here (e.g., email format, password strength)

        // AJAX POST request to signup
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/auth/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                // Assuming successful signup doesn't automatically log in the user
                showAlert('signupAlert', 'Signup successful! You can now sign in.', 'success');
                // Optionally, switch to the sign-in form after a delay
                setTimeout(() => {
                    $('#signup-form').hide();
                    $('#signin-form').show();
                    clearForm($('#signupForm'));
                    clearAlert('signupAlert');
                }, 2000);
            },
            error: function(xhr) {
                const error = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An error occurred during signup.';
                showAlert('signupAlert', error, 'danger');
            }
        });
    });

    /**
     * Function to clear form inputs and validation messages.
     * @param {object} form - jQuery object of the form.
     */
    function clearForm(form) {
        form[0].reset();
        form.find('.error').text('');
        form.find('input, select').css('border-color', '#ccc');
    }

    /**
     * Initialize all functionalities.
     */
    function init() {
        setupFormToggle();
    }

    // Run the initialization
    init();

    /**
     * Event listener for closing alerts.
     * Delegated to handle dynamically added alerts.
     */
    $(document).on('click', '.close-alert', function() {
        $(this).parent('.alert').remove();
    });
});

$(document).ready(function() {

    /**
     * Function to display custom alerts.
     * @param {string} elementId - ID of the alert container.
     * @param {string} message - Alert message.
     * @param {string} type - Type of alert ('success' or 'danger').
     */
    function showAlert(elementId, message, type = 'danger') {
        const alertHtml = `<div class="alert alert-${type}">
                                ${message}
                                <button class="close-alert">&times;</button>
                           </div>`;
        $(`#${elementId}`).html(alertHtml);
    }

    /**
     * Function to clear alerts.
     * @param {string} elementId - ID of the alert container.
     */
    function clearAlert(elementId) {
        $(`#${elementId}`).html('');
    }

    /**
     * Function to close modals when clicking on the close button or outside the modal content.
     */
    function setupModalClose() {
        // Close modal when clicking on <span> (x)
        $('.close-modal').on('click', function() {
            $(this).closest('.modal').hide();
            clearForm($(this).closest('.modal').find('form'));
            clearAlert($(this).closest('.modal').find('.alert').attr('id'));
        });

        // Close modal when clicking outside the modal content
        $(window).on('click', function(event) {
            if ($(event.target).hasClass('modal')) {
                $('.modal').hide();
                clearForm($(event.target).find('form'));
                clearAlert($(event.target).find('.alert').attr('id'));
            }
        });
    }

    /**
     * Function to clear form inputs and validation messages.
     * @param {object} form - jQuery object of the form.
     */
    function clearForm(form) {
        form[0].reset();
        form.find('.error').text('');
        form.find('input, select').css('border-color', '#ccc');
    }

    /**
     * Function to get the JWT token from localStorage.
     * @returns {string|null} - JWT token or null if not found.
     */
    function getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Function to check authentication on dashboard load.
     */
    function checkAuthentication() {
        console.log(window.location)
        console.log(window.location.pathname)
        if (!getToken()) {
            if(window.location.pathname !== "/Green-Shadow-Frontend/index.html"){
                window.location.href = 'index.html'; // Redirect to login page
            }
        }
    }

    /**
     * Function to handle logout.
     */
    function handleLogout() {
        $('#logoutBtn').on('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    /**
     * Function to switch tabs.
     */
    function setupTabs() {
        $('.tab').on('click', function() {
            const tabId = $(this).data('tab');

            // Set active tab
            $('.tab').removeClass('active');
            $(this).addClass('active');

            // Show corresponding tab content
            $('.tab-content').removeClass('active');
            $(`#${tabId}`).addClass('active');
        });
    }

    /**
     * Function to fetch and display Fields data.
     */
    function fetchFields() {
        const token = getToken();
        if (!token) {
            showAlert('fieldsAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/fields',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                populateFieldsTable(data);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch fields.';
                showAlert('fieldsAlert', error, 'danger');
            }
        });
    }


    /**
     * Function to populate Fields table.
     * @param {Array} fields - Array of field objects.
     */
    function populateFieldsTable(fields) {
        const tbody = $('#fieldsTableBody');
        tbody.empty();

        if (fields.length === 0) {
            tbody.append('<tr><td colspan="7" style="text-align:center;">No fields available.</td></tr>');
            return;
        }

        fields.forEach(field => {
            const row = `<tr>
                        <td>${field.id}</td>
                        <td>${field.name}</td>
                        <td>${field.landSize}</td>
                        <td>${field.location}</td>
                        <td><img src="data:image/png;base64,${field.fieldImage1}" alt="Image 1" style="max-width: 50px; max-height: 50px;"></td>
                        <td><img src="data:image/png;base64,${field.fieldImage2}" alt="Image 2" style="max-width: 50px; max-height: 50px;"></td>
                        <td>
                            <button class="btn btn-warning edit-field-btn" data-id="${field.id}">Edit</button>
                            <button class="btn btn-danger delete-field-btn" data-id="${field.id}">Delete</button>
                        </td>
                     </tr>`;
            tbody.append(row);
        });
    }

    /**
     * Event listener for Add Field button to open the modal.
     */
    $('#addFieldBtn').on('click', function() {
        $('#addFieldModal').show();
    });

    /**
     * Event listener for Add Field form submission.
     */
    $('#addFieldForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#addFieldForm', ['fieldName', 'location', 'size']);
        if (!isValid) return;

        console.log(this)
        const formData = new FormData(this);

        // AJAX POST request to add field
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/fields',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function(response) {
                showAlert('addFieldAlert', 'Field added successfully!', 'success');
                fetchFields();
                setTimeout(() => {
                    $('#addFieldModal').hide();
                    clearForm($('#addFieldForm'));
                    clearAlert('addFieldAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add field.';
                showAlert('addFieldAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Edit Field buttons.
     */
    $(document).on('click', '.edit-field-btn', function() {
        const fieldId = $(this).data('id');

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/fields/${fieldId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(field) {
                $('#editFieldId').val(field.id);
                $('#editFieldName').val(field.name);
                $('#editLocation').val(field.location);
                $('#editSize').val(field.landSize);
                $('#editFieldModal').show();
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch field details.';
                showAlert('fieldsAlert', error, 'danger');
            }
        });
    });

    /**
     * Event listener for Edit Field form submission.
     */
    $('#editFieldForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#editFieldForm', ['editFieldName', 'editLocation', 'editSize']);
        if (!isValid) return;

        const formData = new FormData(this);

        const fieldId = $('#editFieldId').val();
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/fields/${fieldId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function(response) {
                showAlert('editFieldAlert', 'Field updated successfully!', 'success');
                fetchFields();
                setTimeout(() => {
                    $('#editFieldModal').hide();
                    clearForm($('#editFieldForm'));
                    clearAlert('editFieldAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update field.';
                showAlert('editFieldAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Delete Field buttons.
     */
    $(document).on('click', '.delete-field-btn', function() {
        const fieldId = $(this).data('id');
        if (confirm('Are you sure you want to delete this field?')) {
            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/fields/${fieldId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                success: function(response) {
                    showAlert('fieldsAlert', 'Field deleted successfully!', 'success');
                    fetchFields();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete field.';
                    showAlert('fieldsAlert', error, 'danger');
                }
            });
        }
    });

    /**
     * Utility to validate form fields.
     */
    function validateForm(formSelector, fieldIds) {
        let isValid = true;

        fieldIds.forEach(id => {
            const value = $(`${formSelector} #${id}`).val().trim();
            if (!value) {
                $(`#${id}Error`).text(`${id} is required.`);
                $(`#${id}`).css('border-color', '#dc3545');
                isValid = false;
            } else {
                $(`#${id}Error`).text('');
                $(`#${id}`).css('border-color', '#ccc');
            }
        });

        return isValid;
    }

    /**
     * Utility to clear form fields and alerts.
     */
    function clearForm(form) {
        form.find('input, textarea').val('');
        form.find('.error').text('');
        form.find('input').css('border-color', '#ccc');
    }

    function clearAlert(alertId) {
        $(`#${alertId}`).html('');
    }
    /**
     * Function to fetch and display Crops data.
     */
    function fetchCrops() {
        const token = getToken();
        if (!token) {
            showAlert('cropsAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/crops',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                populateCropsTable(data);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch crops.';
                showAlert('cropsAlert', error, 'danger');
            }
        });
    }

    /**
     * Function to populate Crops table.
     * @param {Array} crops - Array of crop objects.
     */
    function populateCropsTable(crops) {
        const tbody = $('#cropsTableBody');
        tbody.empty();

        if (crops.length === 0) {
            tbody.append('<tr><td colspan="8" style="text-align:center;">No crops available.</td></tr>');
            return;
        }

        crops.forEach(crop => {
            const imageSrc = crop.cropImage ? `data:image/*;base64,${crop.cropImage}` : '';
            const imageTag = imageSrc ? `<img src="${imageSrc}" alt="Crop Image" style="max-width: 50px; max-height: 50px;">` : 'No Image';

            const row = `<tr>
                            <td>${crop.id}</td>
                            <td>${crop.cropName}</td>
                            <td>${crop.scientificName || 'N/A'}</td>
                            <td>${crop.category || 'N/A'}</td>
                            <td>${crop.season || 'N/A'}</td>
                            <td>${imageTag}</td>
                            <td>${crop.field ? crop.field.name : 'N/A'}</td>
                            <td>
                                <button class="btn btn-warning edit-crop-btn" data-id="${crop.id}">Edit</button>
                                <button class="btn btn-danger delete-crop-btn" data-id="${crop.id}">Delete</button>
                            </td>
                         </tr>`;
            tbody.append(row);
        });
    }


    /**
     * Image preview for Add Crop Modal.
     */
    $('#cropImage').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#cropImagePreview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        } else {
            $('#cropImagePreview').hide();
        }
    });

    /**
     * Image preview for Edit Crop Modal.
     */
    $('#editCropImage').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#editCropImagePreview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        } else {
            $('#editCropImagePreview').hide();
        }
    });

    /**
     * Function to fetch and populate Fields in dropdown.
     * @param {String} selectElementId - The selector for the select element.
     */
    function populateFieldsDropdown(selectElementId) {
        const token = getToken();
        if (!token) {
            showAlert('cropsAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/fields',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(fields) {
                const select = $(selectElementId);
                select.empty();
                select.append('<option value="">Select Field</option>');
                fields.forEach(field => {
                    select.append(`<option value="${field.id}">${field.name}</option>`);
                });
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch fields.';
                showAlert('cropsAlert', error, 'danger');
            }
        });
    }

    /**
     * Event listener for Add Crop button to open the modal.
     */
    $('#addCropBtn').on('click', function() {
        populateFieldsDropdown('#fieldId');
        $('#addCropModal').show();
    });

    /**
     * Function to clear form fields and validation.
     * @param {jQuery} form - jQuery object of the form to clear.
     */
    function clearForm(form) {
        form[0].reset();
        clearFormValidation(form);
    }

    /**
     * Function to clear form validation styles.
     * @param {jQuery} form - jQuery object of the form.
     */
    function clearFormValidation(form) {
        form.find('.form-control, .form-select').removeClass('is-invalid');
        form.find('.invalid-feedback').text('');
    }

    /**
     * Function to show alerts.
     * @param {string} elementId - ID of the alert container.
     * @param {string} message - Alert message.
     * @param {string} type - Bootstrap alert type ('success', 'danger', etc.).
     */
    function showAlert(elementId, message, type) {
        const alertDiv = $(`#${elementId}`);
        alertDiv.html(`
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);
    }

    /**
     * Function to clear alerts.
     * @param {string} elementId - ID of the alert container.
     */
    function clearAlert(elementId) {
        $(`#${elementId}`).html('');
    }

    /**
     * Event listener for Add Crop form submission.
     */
    $('#addCropForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#addCropForm', ['cropName', 'fieldId']);
        if (!isValid) return;

        const formData = new FormData(this);

        // AJAX POST request to add crop
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/crops',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function(response) {
                showAlert('addCropAlert', 'Crop added successfully!', 'success');
                fetchCrops();
                setTimeout(() => {
                    $('#addCropModal').hide();
                    clearForm($('#addCropForm'));
                    $('#cropImagePreview').hide();
                    clearAlert('addCropAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add crop.';
                showAlert('addCropAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Edit Crop buttons.
     */
    $(document).on('click', '.edit-crop-btn', function() {
        populateFieldsDropdown('#editFieldIdcrop');

        const cropId = $(this).data('id');

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/crops/${cropId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(crop) {
                $('#editCropId').val(crop.id);
                $('#editCropName').val(crop.cropName);
                $('#editScientificName').val(crop.scientificName);
                $('#editCategory').val(crop.category);
                $('#editSeason').val(crop.season);
                populateFieldsDropdown('#editFieldId');
                setTimeout(() => {
                    $('#editFieldId').val(crop.field ? crop.field.id : '');
                }, 500); // Ensure fields are populated before setting value

                if (crop.cropImage) {
                    $('#editCropImagePreview').attr('src', `data:image/*;base64,${crop.cropImage}`).show();
                } else {
                    $('#editCropImagePreview').hide();
                }

                $('#editCropModal').show();
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch crop details.';
                showAlert('cropsAlert', error, 'danger');
            }
        });
    });


    /**
     * Event listener for Edit Crop form submission.
     */
    $('#editCropForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#editCropForm', ['editCropName', 'editFieldId']);
        if (!isValid) return;

        const cropId = $('#editCropId').val();
        const formData = new FormData(this);

        // AJAX PUT request to update crop
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/crops/${cropId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function(response) {
                showAlert('editCropAlert', 'Crop updated successfully!', 'success');
                fetchCrops();
                setTimeout(() => {
                    $('#editCropModal').hide();
                    clearForm($('#editCropForm'));
                    $('#editCropImagePreview').hide();
                    clearAlert('editCropAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update crop.';
                showAlert('editCropAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Delete Crop buttons.
     */
    $(document).on('click', '.delete-crop-btn', function() {
        const cropId = $(this).data('id');
        if (confirm('Are you sure you want to delete this crop?')) {
            const token = getToken();
            if (!token) {
                showAlert('cropsAlert', 'Authentication token is missing. Please log in.', 'danger');
                return;
            }

            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/crops/${cropId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    showAlert('cropsAlert', 'Crop deleted successfully!', 'success');
                    fetchCrops();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete crop.';
                    showAlert('cropsAlert', error, 'danger');
                }
            });
        }
    });

    /**
     * Function to validate forms.
     * @param {string} formSelector - jQuery selector for the form.
     * @returns {boolean} - Returns true if valid, false otherwise.
     */
    function validateForm(formSelector) {
        let isValid = true;
        const form = $(formSelector);

        // Iterate through required inputs and selects
        form.find('input[required], select[required]').each(function() {
            const input = $(this);
            const value = input.val().trim();

            if (!value) {
                const errorId = input.attr('id') + 'Error';
                $(`#${errorId}`).text(`${input.prev('label').text()} is required.`);
                input.addClass('is-invalid');
                isValid = false;
            } else {
                const errorId = input.attr('id') + 'Error';
                $(`#${errorId}`).text('');
                input.removeClass('is-invalid');
            }
        });

        return isValid;
    }

    /**
     * Function to get authentication token.
     * Replace this with your actual token retrieval logic.
     * @returns {string} - JWT token.
     */
    function getToken() {
        // Example: Retrieve token from localStorage
        return localStorage.getItem('token') || '';
    }

    /**
     * Document Ready Function.
     */
    $(document).ready(function() {
        // Initialize Bootstrap modals
        $('#addCropModal').on('hidden.bs.modal', function () {
            clearForm($('#addCropForm'));
            clearFormValidation($('#addCropForm'));
            clearAlert('addCropAlert');
        });

        $('#editCropModal').on('hidden.bs.modal', function () {
            clearForm($('#editCropForm'));
            clearFormValidation($('#editCropForm'));
            clearAlert('editCropAlert');
            $('#currentCropImage').hide();
        });

        // Populate Fields dropdown on page load
        populateFieldsDropdown();

        // Fetch and display crops on page load
        fetchCrops();
    });

    /**
     * Function to fetch and display Staff data.
     */
    function fetchStaff() {
        const token = getToken();
        if (!token) {
            showAlert('staffAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/staff',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                populateStaffTable(data);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch staff members.';
                showAlert('staffAlert', error, 'danger');
            }
        });
    }

    /**
     * Function to populate Staff table.
     * @param {Array} staffList - Array of staff objects.
     */
    function populateStaffTable(staffList) {
        const tbody = $('#staffTableBody');
        tbody.empty();

        if (staffList.length === 0) {
            tbody.append('<tr><td colspan="12" style="text-align:center;">No staff members available.</td></tr>');
            return;
        }

        staffList.forEach(staff => {
            const address = [
                staff.addressLine1,
                staff.addressLine2,
                staff.addressLine3,
                staff.addressLine4,
                staff.addressLine5
            ].filter(line => line).join(', ');

            const row = `<tr>
                            <td>${staff.id}</td>
                            <td>${staff.firstName}</td>
                            <td>${staff.lastName || 'N/A'}</td>
                            <td>${staff.designation || 'N/A'}</td>
                            <td>${staff.gender || 'N/A'}</td>
                            <td>${staff.joinedDate || 'N/A'}</td>
                            <td>${staff.DOB || 'N/A'}</td>
                            <td>${staff.contact || 'N/A'}</td>
                            <td>${staff.email || 'N/A'}</td>
                            <td>${staff.field ? staff.field.name : 'N/A'}</td>
                            <td>${address || 'N/A'}</td>
                            <td>
                                <button class="btn btn-warning edit-staff-btn" data-id="${staff.id}">Edit</button>
                                <button class="btn btn-danger delete-staff-btn" data-id="${staff.id}">Delete</button>
                            </td>
                         </tr>`;
            tbody.append(row);
        });
    }

    /**
     * Event listener for Add Staff button to open the modal.
     */
    $('#addStaffBtn').on('click', function() {
        populateFieldsDropdown('#stafffieldId');
        $('#addStaffModal').show();
    });

    /**
     * Event listener for Add Staff form submission.
     */
    $('#addStaffForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#addStaffForm', ['firstName', 'fieldId']);
        if (!isValid) return;

        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            designation: $('#designation').val(),
            gender: $('#gender').val(),
            joinedDate: $('#joinedDate').val(),
            DOB: $('#DOB').val(),
            contact: $('#contact').val(),
            email: $('#email').val(),
            fieldId: parseInt($('#stafffieldId').val()),
            addressLine1: $('#addressLine1').val(),
            addressLine2: $('#addressLine2').val(),
            addressLine3: $('#addressLine3').val(),
            addressLine4: $('#addressLine4').val(),
            addressLine5: $('#addressLine5').val()
        };

        // AJAX POST request to add staff
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/staff',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showAlert('addStaffAlert', 'Staff member added successfully!', 'success');
                fetchStaff();
                setTimeout(() => {
                    $('#addStaffModal').hide();
                    clearForm($('#addStaffForm'));
                    clearAlert('addStaffAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add staff member.';
                showAlert('addStaffAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Edit Staff buttons.
     */
    $(document).on('click', '.edit-staff-btn', function() {
        populateFieldsDropdown('#editstafffieldId');

        const staffId = $(this).data('id');

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/staff/${staffId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(staff) {
                $('#editStaffId').val(staff.id);
                $('#editFirstName').val(staff.firstName);
                $('#editLastName').val(staff.lastName);
                $('#editDesignation').val(staff.designation);
                $('#editGender').val(staff.gender);
                $('#editJoinedDate').val(staff.joinedDate);
                $('#editDOB').val(staff.DOB);
                $('#editContact').val(staff.contact);
                $('#editEmail').val(staff.email);
                $('#editAddressLine1').val(staff.addressLine1);
                $('#editAddressLine2').val(staff.addressLine2);
                $('#editAddressLine3').val(staff.addressLine3);
                $('#editAddressLine4').val(staff.addressLine4);
                $('#editAddressLine5').val(staff.addressLine5);

                populateFieldsDropdown('#editFieldId');
                setTimeout(() => {
                    $('#editFieldId').val(staff.field ? staff.field.id : '');
                }, 500); // Ensure fields are populated before setting value

                $('#editStaffModal').show();
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch staff member details.';
                showAlert('staffAlert', error, 'danger');
            }
        });
    });

    /**
     * Event listener for Edit Staff form submission.
     */
    $('#editStaffForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#editStaffForm', ['editFirstName', 'editFieldId']);
        if (!isValid) return;

        const staffId = $('#editStaffId').val();
        const formData = {
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            designation: $('#editDesignation').val(),
            gender: $('#editGender').val(),
            joinedDate: $('#editJoinedDate').val(),
            DOB: $('#editDOB').val(),
            contact: $('#editContact').val(),
            email: $('#editEmail').val(),
            fieldId: parseInt($('#editstafffieldId').val()),
            addressLine1: $('#editAddressLine1').val(),
            addressLine2: $('#editAddressLine2').val(),
            addressLine3: $('#editAddressLine3').val(),
            addressLine4: $('#editAddressLine4').val(),
            addressLine5: $('#editAddressLine5').val()
        };

        // AJAX PUT request to update staff
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/staff/${staffId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showAlert('editStaffAlert', 'Staff member updated successfully!', 'success');
                fetchStaff();
                setTimeout(() => {
                    $('#editStaffModal').hide();
                    clearForm($('#editStaffForm'));
                    clearAlert('editStaffAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update staff member.';
                showAlert('editStaffAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Delete Staff buttons.
     */
    $(document).on('click', '.delete-staff-btn', function() {
        const staffId = $(this).data('id');
        if (confirm('Are you sure you want to delete this staff member?')) {
            const token = getToken();
            if (!token) {
                showAlert('staffAlert', 'Authentication token is missing. Please log in.', 'danger');
                return;
            }

            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/staff/${staffId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    showAlert('staffAlert', 'Staff member deleted successfully!', 'success');
                    fetchStaff();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete staff member.';
                    showAlert('staffAlert', error, 'danger');
                }
            });
        }
    });

    /**
     * Function to fetch and display Vehicles data.
     */
    function fetchVehicles() {
        const token = getToken();
        if (!token) {
            showAlert('vehiclesAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/vehicles',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                populateVehiclesTable(data);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch vehicles.';
                showAlert('vehiclesAlert', error, 'danger');
            }
        });
    }

    /**
     * Function to populate Vehicles table.
     * @param {Array} vehicles - Array of vehicle objects.
     */
    function populateVehiclesTable(vehicles) {
        const tbody = $('#vehiclesTableBody');
        tbody.empty();

        if (vehicles.length === 0) {
            tbody.append('<tr><td colspan="7" style="text-align:center;">No vehicles available.</td></tr>');
            return;
        }

        vehicles.forEach(vehicle => {
            const row = `<tr>
                            <td>${vehicle.id}</td>
                            <td>${vehicle.licensePlate}</td>
                            <td>${vehicle.vehicleCategory}</td>
                            <td>${vehicle.fuelType}</td>
                            <td>${vehicle.type}</td>
                            <td>${vehicle.status}</td>
                            <td>
                                <button class="btn btn-warning edit-vehicle-btn" data-id="${vehicle.id}">Edit</button>
                                <button class="btn btn-danger delete-vehicle-btn" data-id="${vehicle.id}">Delete</button>
                            </td>
                         </tr>`;
            tbody.append(row);
        });
    }

    /**
     * Event listener for Add Vehicle button to open the modal.
     */
    $('#addVehicleBtn').on('click', function() {
        // $('#addVehicleModal').modal('show');
        $('#addVehicleModal').show();

    });

    /**
     * Event listener for Add Vehicle form submission.
     */
    $('#addVehicleForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#addVehicleForm', ['vehicleLicensePlate', 'vehicleCategory', 'vehicleFuelType', 'vehicleType', 'vehicleStatus']);
        if (!isValid) return;

        const formData = {
            licensePlate: $('#vehicleLicensePlate').val(),
            vehicleCategory: $('#vehicleCategory').val(),
            fuelType: $('#vehicleFuelType').val(),
            type: $('#vehicleType').val(),
            status: $('#vehicleStatus').val()
            // Note: Ignoring ManyToMany relationships as per instructions
        };

        // AJAX POST request to add vehicle
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/vehicles',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showAlert('addVehicleAlert', 'Vehicle added successfully!', 'success');
                fetchVehicles();
                setTimeout(() => {
                    $('#addVehicleModal').modal('hide');
                    clearForm($('#addVehicleForm'));
                    clearAlert('addVehicleAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add vehicle.';
                showAlert('addVehicleAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Edit Vehicle buttons.
     */
    $(document).on('click', '.edit-vehicle-btn', function() {
        $('#editVehicleModal').show();

        const vehicleId = $(this).data('id');

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/vehicles/${vehicleId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(vehicle) {
                $('#editVehicleId').val(vehicle.id);
                $('#editVehicleLicensePlate').val(vehicle.licensePlate);
                $('#editVehicleCategory').val(vehicle.vehicleCategory);
                $('#editVehicleFuelType').val(vehicle.fuelType);
                $('#editVehicleType').val(vehicle.type);
                $('#editVehicleStatus').val(vehicle.status);
                $('#editVehicleModal').modal('show');
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch vehicle details.';
                showAlert('vehiclesAlert', error, 'danger');
            }
        });
    });

    /**
     * Event listener for Edit Vehicle form submission.
     */
    $('#editVehicleForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#editVehicleForm', ['editVehicleLicensePlate', 'editVehicleCategory', 'editVehicleFuelType', 'editVehicleType', 'editVehicleStatus']);
        if (!isValid) return;

        const vehicleId = $('#editVehicleId').val();
        const formData = {
            licensePlate: $('#editVehicleLicensePlate').val(),
            vehicleCategory: $('#editVehicleCategory').val(),
            fuelType: $('#editVehicleFuelType').val(),
            type: $('#editVehicleType').val(),
            status: $('#editVehicleStatus').val()
            // Note: Ignoring ManyToMany relationships as per instructions
        };

        // AJAX PUT request to update vehicle
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/vehicles/${vehicleId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showAlert('editVehicleAlert', 'Vehicle updated successfully!', 'success');
                fetchVehicles();
                setTimeout(() => {
                    $('#editVehicleModal').modal('hide');
                    clearForm($('#editVehicleForm'));
                    clearAlert('editVehicleAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update vehicle.';
                showAlert('editVehicleAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Delete Vehicle buttons.
     */
    $(document).on('click', '.delete-vehicle-btn', function() {
        const vehicleId = $(this).data('id');
        if (confirm('Are you sure you want to delete this vehicle?')) {
            const token = getToken();
            if (!token) {
                showAlert('vehiclesAlert', 'Authentication token is missing. Please log in.', 'danger');
                return;
            }

            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/vehicles/${vehicleId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    showAlert('vehiclesAlert', 'Vehicle deleted successfully!', 'success');
                    fetchVehicles();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete vehicle.';
                    showAlert('vehiclesAlert', error, 'danger');
                }
            });
        }
    });

    /**
     * Event delegation for Delete Vehicle buttons.
     */
    $(document).on('click', '.delete-vehicle-btn', function() {
        const vehicleId = $(this).data('id');
        if (confirm('Are you sure you want to delete this vehicle?')) {
            // AJAX DELETE request to delete vehicle
            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/vehicles/${vehicleId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                success: function(response) {
                    showAlert('vehiclesAlert', 'Vehicle deleted successfully!', 'success');
                    fetchVehicles();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete vehicle.';
                    showAlert('vehiclesAlert', error, 'danger');
                }
            });
        }
    });

    /**
     * Function to fetch and display Equipment data.
     */
    function fetchEquipment() {
        const token = getToken();
        if (!token) {
            showAlert('equipmentAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/equipment',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                populateEquipmentTable(data);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch equipment.';
                showAlert('equipmentAlert', error, 'danger');
            }
        });
    }

    /**
     * Function to populate Equipment table.
     * @param {Array} equipmentList - Array of equipment objects.
     */
    function populateEquipmentTable(equipmentList) {
        const tbody = $('#equipmentTableBody');
        tbody.empty();

        if (equipmentList.length === 0) {
            tbody.append('<tr><td colspan="7" style="text-align:center;">No equipment available.</td></tr>');
            return;
        }

        equipmentList.forEach(equipment => {
            const row = `<tr>
                            <td>${equipment.id}</td>
                            <td>${equipment.name}</td>
                            <td>${equipment.equipmentType}</td>
                            <td>${equipment.status}</td>
                            <td>
                                <button class="btn btn-warning edit-equipment-btn" data-id="${equipment.id}">Edit</button>
                                <button class="btn btn-danger delete-equipment-btn" data-id="${equipment.id}">Delete</button>
                            </td>
                         </tr>`;
            tbody.append(row);
        });
    }

    /**
     * Event listener for Add Equipment button to open the modal.
     */
    $('#addEquipmentBtn').on('click', function() {
        $('#addEquipmentModal').show();

    });

    /**
     * Event listener for Add Equipment form submission.
     */
    $('#addEquipmentForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#addEquipmentForm', ['equipmentName', 'equipmentType', 'equipmentStatus']);
        if (!isValid) return;

        const formData = {
            name: $('#equipmentName').val(),
            equipmentType: $('#equipmentType').val(),
            status: $('#equipmentStatus').val()
            // Note: Ignoring ManyToMany relationships as per instructions
        };

        // AJAX POST request to add equipment
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/equipment',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showAlert('addEquipmentAlert', 'Equipment added successfully!', 'success');
                fetchEquipment();
                setTimeout(() => {
                    $('#addEquipmentModal').modal('hide');
                    clearForm($('#addEquipmentForm'));
                    clearAlert('addEquipmentAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add equipment.';
                showAlert('addEquipmentAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Edit Equipment buttons.
     */
    $(document).on('click', '.edit-equipment-btn', function() {
        $('#editEquipmentModal').show();

        const equipmentId = $(this).data('id');

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/equipment/${equipmentId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(equipment) {
                $('#editEquipmentId').val(equipment.id);
                $('#editEquipmentName').val(equipment.name);
                $('#editEquipmentType').val(equipment.equipmentType);
                $('#editEquipmentStatus').val(equipment.status);
                $('#editEquipmentModal').modal('show');
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch equipment details.';
                showAlert('equipmentAlert', error, 'danger');
            }
        });
    });

    /**
     * Event listener for Edit Equipment form submission.
     */
    $('#editEquipmentForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = validateForm('#editEquipmentForm', ['editEquipmentName', 'editEquipmentType', 'editEquipmentStatus']);
        if (!isValid) return;

        const equipmentId = $('#editEquipmentId').val();
        const formData = {
            name: $('#editEquipmentName').val(),
            equipmentType: $('#editEquipmentType').val(),
            status: $('#editEquipmentStatus').val()
            // Note: Ignoring ManyToMany relationships as per instructions
        };

        // AJAX PUT request to update equipment
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/equipment/${equipmentId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showAlert('editEquipmentAlert', 'Equipment updated successfully!', 'success');
                fetchEquipment();
                setTimeout(() => {
                    $('#editEquipmentModal').modal('hide');
                    clearForm($('#editEquipmentForm'));
                    clearAlert('editEquipmentAlert');
                }, 1500);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update equipment.';
                showAlert('editEquipmentAlert', error, 'danger');
            }
        });
    });

    /**
     * Event delegation for Delete Equipment buttons.
     */
    $(document).on('click', '.delete-equipment-btn', function() {
        const equipmentId = $(this).data('id');
        if (confirm('Are you sure you want to delete this equipment?')) {
            const token = getToken();
            if (!token) {
                showAlert('equipmentAlert', 'Authentication token is missing. Please log in.', 'danger');
                return;
            }

            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/equipment/${equipmentId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    showAlert('equipmentAlert', 'Equipment deleted successfully!', 'success');
                    fetchEquipment();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete equipment.';
                    showAlert('equipmentAlert', error, 'danger');
                }
            });
        }
    });


    /**
     * Function to fetch and display all data on dashboard load.
     */
    function initializeDashboard() {
        fetchFields();
        fetchCrops();
        fetchStaff();
        fetchVehicles();
        fetchEquipment();
        fetchLogs();
    }

    /**
     * Function to handle Logout button functionality.
     */
    function setupLogout() {
        $('#logoutBtn').on('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'index.html'; // Redirect to login page
        });
    }

    /**
     * Initialize all functionalities after checking authentication.
     */
    function init() {
        checkAuthentication();
        setupLogout();
        setupTabs();
        setupModalClose();
        initializeDashboard();
    }

    // Run the initialization
    init();
});


/**
 * Function to fetch and display Logs data.
 */
function fetchLogs() {
    const token = getToken();
    if (!token) {
        showAlert('logsAlert', 'Authentication token is missing. Please log in.', 'danger');
        return;
    }

    $.ajax({
        url: 'http://localhost:8080/green-shadow/api/v1/logs',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(data) {
            populateLogsTable(data);
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch logs.';
            showAlert('logsAlert', error, 'danger');
        }
    });
}

/**
 * Function to populate Logs table.
 * @param {Array} logs - Array of log objects.
 */
function populateLogsTable(logs) {
    const tbody = $('#logsTableBody');
    tbody.empty();

    if (logs.length === 0) {
        tbody.append('<tr><td colspan="5" style="text-align:center;">No logs available.</td></tr>');
        return;
    }

    logs.forEach(log => {
        const imageSrc = log.observedImage ? `data:image/*;base64,${log.observedImage}` : '';
        const imageTag = imageSrc ? `<img src="${imageSrc}" alt="Observed Image" style="max-width: 50px; max-height: 50px;">` : 'No Image';

        const row = `<tr>
                            <td>${log.id}</td>
                            <td>${log.date ? log.date.substring(0,10) : 'N/A'}</td>
                            <td>${log.details || 'N/A'}</td>
                            <td>${imageTag}</td>
                            <td>
                                <button class="btn btn-warning edit-log-btn" data-id="${log.id}">Edit</button>
                                <button class="btn btn-danger delete-log-btn" data-id="${log.id}">Delete</button>
                            </td>
                         </tr>`;
        tbody.append(row);
    });
}

/**
 * Event listener for Add Log button to open the modal.
 */
$('#addLogBtn').on('click', function() {
    $('#addLogModal').show();
});


/**
 * Image preview for Add Log Modal.
 */
$('#logObservedImage').on('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#logObservedImagePreview').attr('src', e.target.result).show();
        }
        reader.readAsDataURL(file);
    } else {
        $('#logObservedImagePreview').hide();
    }
});


/**
 * Image preview for Edit Log Modal.
 */
$('#editLogObservedImage').on('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#editLogObservedImagePreview').attr('src', e.target.result).show();
        }
        reader.readAsDataURL(file);
    } else {
        $('#editLogObservedImagePreview').hide();
    }
});

/**
 * Event listener for Add Log form submission.
 */
$('#addLogForm').on('submit', function(e) {
    e.preventDefault();

    let isValid = validateForm('#addLogForm', ['logDate', 'logDetails']);
    if (!isValid) return;

    const date = $('#logDate').val();
    const details = $('#logDetails').val();
    const observedImageFile = $('#logObservedImage')[0].files[0];
    let observedImage = '';

    if (observedImageFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
            observedImage = reader.result.split(',')[1]; // Remove the data URL part
            submitAddLog(date, details, observedImage);
        }
        reader.readAsDataURL(observedImageFile);
    } else {
        submitAddLog(date, details, observedImage);
    }
});

/**
 * Function to retrieve authentication token.
 * Replace this with your actual token retrieval logic.
 */
function getToken() {
    // Example: Retrieve token from localStorage
    return localStorage.getItem('authToken');
}

/**
 * Function to submit Add Log data.
 */
function submitAddLog(date, details, observedImage) {
    const token = getToken();
    if (!token) {
        showAlert('addLogAlert', 'Authentication token is missing. Please log in.', 'danger');
        return;
    }

    const formData = {
        date: date,
        details: details,
        observedImage: observedImage
        // Note: Ignoring ManyToMany relationships as per instructions
    };

    // AJAX POST request to add log
    $.ajax({
        url: 'http://localhost:8080/green-shadow/api/v1/logs',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            showAlert('addLogAlert', 'Log added successfully!', 'success');
            fetchLogs();
            setTimeout(() => {
                $('#addLogModal').modal('hide');
                clearForm($('#addLogForm'));
                clearAlert('addLogAlert');
            }, 1500);
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add log.';
            showAlert('addLogAlert', error, 'danger');
        }
    });
}


/**
 * Event delegation for Edit Log buttons.
 */
$(document).on('click', '.edit-log-btn', function() {
    const logId = $(this).data('id');

    const token = getToken();
    if (!token) {
        showAlert('logsAlert', 'Authentication token is missing. Please log in.', 'danger');
        return;
    }

    $.ajax({
        url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(log) {
            $('#editLogId').val(log.id);
            $('#editLogDate').val(log.date ? log.date.substring(0,10) : '');
            $('#editLogDetails').val(log.details);

            if (log.observedImage) {
                $('#editLogObservedImagePreview').attr('src', `data:image/*;base64,${log.observedImage}`).show();
            } else {
                $('#editLogObservedImagePreview').hide();
            }

            $('#editLogModal').modal('show');
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch log details.';
            showAlert('logsAlert', error, 'danger');
        }
    });
});


/**
 * Event delegation for Edit Log buttons.
 */
$(document).on('click', '.edit-log-btn', function() {
    const logId = $(this).data('id');

    const token = getToken();
    if (!token) {
        showAlert('logsAlert', 'Authentication token is missing. Please log in.', 'danger');
        return;
    }

    $.ajax({
        url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(log) {
            $('#editLogId').val(log.id);
            $('#editLogDate').val(log.date ? log.date.substring(0,10) : '');
            $('#editLogDetails').val(log.details);

            if (log.observedImage) {
                $('#editLogObservedImagePreview').attr('src', `data:image/*;base64,${log.observedImage}`).show();
            } else {
                $('#editLogObservedImagePreview').hide();
            }

            $('#editLogModal').modal('show');
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch log details.';
            showAlert('logsAlert', error, 'danger');
        }
    });
});


/**
 * Event listener for Edit Log form submission.
 */
$('#editLogForm').on('submit', function(e) {
    e.preventDefault();

    let isValid = validateForm('#editLogForm', ['editLogDate', 'editLogDetails']);
    if (!isValid) return;

    const logId = $('#editLogId').val();
    const date = $('#editLogDate').val();
    const details = $('#editLogDetails').val();
    const observedImageFile = $('#editLogObservedImage')[0].files[0];
    let observedImage = '';

    if (observedImageFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
            observedImage = reader.result.split(',')[1]; // Remove the data URL part
            submitEditLog(logId, date, details, observedImage);
        }
        reader.readAsDataURL(observedImageFile);
    } else {
        // If no new image is uploaded, retain the existing image
        submitEditLog(logId, date, details, '');
    }
});

/**
 * Function to submit Edit Log data.
 */
function submitEditLog(logId, date, details, observedImage) {
    const token = getToken();
    if (!token) {
        showAlert('editLogAlert', 'Authentication token is missing. Please log in.', 'danger');
        return;
    }

    const formData = {
        date: date,
        details: details,
        observedImage: observedImage
        // Note: Ignoring ManyToMany relationships as per instructions
    };

    // AJAX PUT request to update log
    $.ajax({
        url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            showAlert('editLogAlert', 'Log updated successfully!', 'success');
            fetchLogs();
            setTimeout(() => {
                $('#editLogModal').modal('hide');
                clearForm($('#editLogForm'));
                clearAlert('editLogAlert');
            }, 1500);
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update log.';
            showAlert('editLogAlert', error, 'danger');
        }
    });
}

/**
 * Event delegation for Delete Log buttons.
 */
$(document).on('click', '.delete-log-btn', function() {
    const logId = $(this).data('id');
    if (confirm('Are you sure you want to delete this log?')) {
        const token = getToken();
        if (!token) {
            showAlert('logsAlert', 'Authentication token is missing. Please log in.', 'danger');
            return;
        }

        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                showAlert('logsAlert', 'Log deleted successfully!', 'success');
                fetchLogs();
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete log.';
                showAlert('logsAlert', error, 'danger');
            }
        });
    }
});

function validateForm(formSelector, requiredFields) {
    let isValid = true;
    const form = $(formSelector);

    // Clear previous errors
    form.find('span.error').empty();

    requiredFields.forEach(fieldId => {
        const field = $(`#${fieldId}`);
        if (!field.val()) {
            $(`#${fieldId}Error`).text('This field is required.');
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Initialize Logs functionality.
 */
function initializeLogs() {
    fetchLogs();
}

// Call initializeLogs during dashboard initialization
initializeLogs();
