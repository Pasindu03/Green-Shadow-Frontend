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
            $.ajax({
                url: 'http://localhost:8080/green-shadow/api/v1/crops',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
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
                tbody.append('<tr><td colspan="8" class="text-center">No crops available.</td></tr>');
                return;
            }

            crops.forEach(crop => {
                // Handle Scientific Name
                const scientificName = crop.scientificName ? crop.scientificName : 'N/A';

                // Handle Crop Image
                const cropImage = crop.cropImage ? `<img src="${crop.cropImage}" alt="${crop.cropName}" class="img-thumbnail" style="max-width: 100px;">` : 'N/A';

                // Handle Crop Category and Season as text
                const cropCategory = crop.cropCategory ? crop.cropCategory : 'N/A';
                const cropSeason = crop.cropSeason ? crop.cropSeason : 'N/A';

                // Handle Field
                const fieldName = crop.field ? crop.field.name : 'N/A';

                const row = `<tr>
                        <td>${crop.id}</td>
                        <td>${crop.cropName}</td>
                        <td>${scientificName}</td>
                        <td>${cropImage}</td>
                        <td>${cropCategory}</td>
                        <td>${cropSeason}</td>
                        <td>${fieldName}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-crop-btn" data-id="${crop.id}" data-bs-toggle="modal" data-bs-target="#editCropModal">Edit</button>
                            <button class="btn btn-danger btn-sm delete-crop-btn" data-id="${crop.id}">Delete</button>
                        </td>
                     </tr>`;
                tbody.append(row);
            });
        }

        /**
         * Function to populate Fields dropdown in Crops modals.
         */
        function populateFieldsDropdown() {
            $.ajax({
                url: 'http://localhost:8080/green-shadow/api/v1/fields',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                success: function(fields) {
                    // Populate Add Crop Modal
                    const addCropField = $('#cropField');
                    addCropField.empty();
                    addCropField.append('<option value="" disabled selected>Select Field</option>');
                    fields.forEach(field => {
                        addCropField.append(`<option value="${field.id}">${field.name}</option>`);
                    });

                    // Populate Edit Crop Modal
                    const editCropField = $('#editCropField');
                    editCropField.empty();
                    editCropField.append('<option value="" disabled selected>Select Field</option>');
                    fields.forEach(field => {
                        editCropField.append(`<option value="${field.id}">${field.name}</option>`);
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
            // Populate Fields dropdown before showing modal
            populateFieldsDropdown();
            // Reset form and validation
            clearForm($('#addCropForm'));
            clearFormValidation($('#addCropForm'));
            clearAlert('addCropAlert');
            $('#addCropModal').modal('show');
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

            // Clear previous alerts
            clearAlert('addCropAlert');

            // Simple validation
            let isValid = validateForm('#addCropForm');

            if (!isValid) return;

            // Prepare form data including the image
            const formData = new FormData(this);
            // Append field object
            formData.set('field', JSON.stringify({ id: formData.get('field') }));

            // Prepare JSON data (excluding the image)
            const data = {
                cropName: formData.get('cropName').trim(),
                scientificName: formData.get('scientificName').trim(),
                cropCategory: formData.get('cropCategory').trim(),
                cropSeason: formData.get('cropSeason').trim(),
                field: { id: formData.get('field') }
            };

            // Prepare image file if uploaded
            const cropImageFile = formData.get('cropImage');

            // Initialize FormData for multipart/form-data if image is uploaded
            const finalFormData = new FormData();
            finalFormData.append('cropName', data.cropName);
            finalFormData.append('scientificName', data.scientificName);
            finalFormData.append('cropCategory', data.cropCategory);
            finalFormData.append('cropSeason', data.cropSeason);
            finalFormData.append('field', JSON.stringify(data.field));

            if (cropImageFile && cropImageFile.size > 0) {
                finalFormData.append('cropImage', cropImageFile);
            }

            // AJAX POST request to add crop
            $.ajax({
                url: 'http://localhost:8080/green-shadow/api/v1/crops',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                processData: false,
                contentType: false,
                data: finalFormData,
                success: function(response) {
                    showAlert('addCropAlert', 'Crop added successfully!', 'success');
                    fetchCrops();
                    // Close modal after short delay
                    setTimeout(() => {
                        $('#addCropModal').modal('hide');
                        clearForm($('#addCropForm'));
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
            const cropId = $(this).data('id');

            // Fetch crop details
            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/crops/${cropId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                success: function(crop) {
                    // Populate the Edit Crop Modal with crop data
                    $('#editCropId').val(crop.id);
                    $('#editCropName').val(crop.cropName);
                    $('#editScientificName').val(crop.scientificName);
                    $('#editCropCategory').val(crop.cropCategory);
                    $('#editCropSeason').val(crop.cropSeason);
                    $('#editCropField').val(crop.field ? crop.field.id : '');

                    // Handle Crop Image
                    if (crop.cropImage) {
                        $('#currentCropImage').attr('src', crop.cropImage).show();
                    } else {
                        $('#currentCropImage').hide();
                    }

                    // Clear previous validation errors and alerts
                    clearFormValidation($('#editCropForm'));
                    clearAlert('editCropAlert');

                    // Show the Edit Crop Modal
                    $('#editCropModal').modal('show');
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

            // Clear previous alerts
            clearAlert('editCropAlert');

            // Simple validation
            let isValid = validateForm('#editCropForm');

            if (!isValid) return;

            // Prepare form data including the image
            const formData = new FormData(this);
            const cropId = formData.get('editCropId');

            // Append field object
            formData.set('field', JSON.stringify({ id: formData.get('editCropField') }));

            // Prepare JSON data (excluding the image)
            const data = {
                cropName: formData.get('editCropName').trim(),
                scientificName: formData.get('editScientificName').trim(),
                cropCategory: formData.get('editCropCategory').trim(),
                cropSeason: formData.get('editCropSeason').trim(),
                field: { id: formData.get('editCropField') }
            };

            // Prepare image file if uploaded
            const cropImageFile = formData.get('editCropImage');

            // Initialize FormData for multipart/form-data if image is uploaded
            const finalFormData = new FormData();
            finalFormData.append('cropName', data.cropName);
            finalFormData.append('scientificName', data.scientificName);
            finalFormData.append('cropCategory', data.cropCategory);
            finalFormData.append('cropSeason', data.cropSeason);
            finalFormData.append('field', JSON.stringify(data.field));

            if (cropImageFile && cropImageFile.size > 0) {
                finalFormData.append('cropImage', cropImageFile);
            }

            // AJAX PUT request to update crop
            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/crops/${cropId}`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                processData: false,
                contentType: false,
                data: finalFormData,
                success: function(response) {
                    showAlert('editCropAlert', 'Crop updated successfully!', 'success');
                    fetchCrops();
                    // Close modal after short delay
                    setTimeout(() => {
                        $('#editCropModal').modal('hide');
                        clearForm($('#editCropForm'));
                        clearAlert('editCropAlert');
                        $('#currentCropImage').hide();
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
                // AJAX DELETE request to delete crop
                $.ajax({
                    url: `http://localhost:8080/green-shadow/api/v1/crops/${cropId}`,
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
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
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/staff',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(data) {
                populateStaffTable(data);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch staff.';
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
            tbody.append('<tr><td colspan="5" style="text-align:center;">No staff members available.</td></tr>');
            return;
        }

        staffList.forEach(staff => {
            const row = `<tr>
                            <td>${staff.id}</td>
                            <td>${staff.name}</td>
                            <td>${staff.designation}</td>
                            <td>${staff.contact}</td>
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
        $('#addStaffModal').show();
    });

    /**
     * Event listener for Add Staff form submission.
     */
    $('#addStaffForm').on('submit', function(e) {
        e.preventDefault();

        // Simple validation
        let isValid = true;

        const name = $('#staffName').val().trim();
        const role = $('#staffRole').val().trim();
        const contact = $('#staffContact').val().trim();

        if (name === '') {
            $('#staffNameError').text('Name is required.');
            $('#staffName').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#staffNameError').text('');
            $('#staffName').css('border-color', '#ccc');
        }

        if (role === '') {
            $('#staffRoleError').text('Role is required.');
            $('#staffRole').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#staffRoleError').text('');
            $('#staffRole').css('border-color', '#ccc');
        }

        if (contact === '') {
            $('#staffContactError').text('Contact is required.');
            $('#staffContact').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#staffContactError').text('');
            $('#staffContact').css('border-color', '#ccc');
        }

        if (!isValid) return;

        // Prepare data
        const data = {
            name: name,
            designation: role,
            contact: contact
        };

        // AJAX POST request to add staff
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/staff',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showAlert('addStaffAlert', 'Staff member added successfully!', 'success');
                fetchStaff();
                // Close modal after short delay
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
        const staffId = $(this).data('id');

        // Fetch staff details
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/staff/${staffId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(staff) {
                $('#editStaffId').val(staff.id);
                $('#editStaffName').val(staff.name);
                $('#editStaffRole').val(staff.role);
                $('#editStaffContact').val(staff.contact);
                $('#editStaffModal').show();
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch staff details.';
                showAlert('staffAlert', error, 'danger');
            }
        });
    });

    /**
     * Event listener for Edit Staff form submission.
     */
    $('#editStaffForm').on('submit', function(e) {
        e.preventDefault();

        // Simple validation
        let isValid = true;

        const staffId = $('#editStaffId').val();
        const name = $('#editStaffName').val().trim();
        const role = $('#editStaffRole').val().trim();
        const contact = $('#editStaffContact').val().trim();

        if (name === '') {
            $('#editStaffNameError').text('Name is required.');
            $('#editStaffName').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editStaffNameError').text('');
            $('#editStaffName').css('border-color', '#ccc');
        }

        if (role === '') {
            $('#editStaffRoleError').text('Role is required.');
            $('#editStaffRole').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editStaffRoleError').text('');
            $('#editStaffRole').css('border-color', '#ccc');
        }

        if (contact === '') {
            $('#editStaffContactError').text('Contact is required.');
            $('#editStaffContact').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editStaffContactError').text('');
            $('#editStaffContact').css('border-color', '#ccc');
        }

        if (!isValid) return;

        // Prepare data
        const data = {
            name: name,
            designation: role,
            contact: contact,
            id:1
        };

        // AJAX PUT request to update staff
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/staff/${staffId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showAlert('editStaffAlert', 'Staff member updated successfully!', 'success');
                fetchStaff();
                // Close modal after short delay
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
            // AJAX DELETE request to delete staff
            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/staff/${staffId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
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
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/vehicles',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
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
            tbody.append('<tr><td colspan="5" style="text-align:center;">No vehicles available.</td></tr>');
            return;
        }

        vehicles.forEach(vehicle => {
            const row = `<tr>
                            <td>${vehicle.id}</td>
                            <td>${vehicle.vehicleType}</td>
                            <td>${vehicle.model}</td>
                            <td>${vehicle.licensePlate}</td>
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
        $('#addVehicleModal').show();
    });

    /**
     * Event listener for Add Vehicle form submission.
     */
    $('#addVehicleForm').on('submit', function(e) {
        e.preventDefault();

        // Simple validation
        let isValid = true;

        const type = $('#vehicleType').val().trim();
        const model = $('#vehicleModel').val().trim();
        const licensePlate = $('#licensePlate').val().trim();

        if (type === '') {
            $('#vehicleTypeError').text('Type is required.');
            $('#vehicleType').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#vehicleTypeError').text('');
            $('#vehicleType').css('border-color', '#ccc');
        }

        if (model === '') {
            $('#vehicleModelError').text('Model is required.');
            $('#vehicleModel').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#vehicleModelError').text('');
            $('#vehicleModel').css('border-color', '#ccc');
        }

        if (licensePlate === '') {
            $('#licensePlateError').text('License Plate is required.');
            $('#licensePlate').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#licensePlateError').text('');
            $('#licensePlate').css('border-color', '#ccc');
        }

        if (!isValid) return;

        // Prepare data
        const data = {
            vehicleType: type,
            status: 'AVAILABLE',
            licensePlate: licensePlate
        };

        // AJAX POST request to add vehicle
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/vehicles',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showAlert('addVehicleAlert', 'Vehicle added successfully!', 'success');
                fetchVehicles();
                // Close modal after short delay
                setTimeout(() => {
                    $('#addVehicleModal').hide();
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
        const vehicleId = $(this).data('id');

        // Fetch vehicle details
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/vehicles/${vehicleId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(vehicle) {
                $('#editVehicleId').val(vehicle.id);
                $('#editVehicleType').val(vehicle.vehicleType);
                $('#editVehicleModel').val(vehicle.model);
                $('#editLicensePlate').val(vehicle.licensePlate);
                $('#editVehicleModal').show();
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

        // Simple validation
        let isValid = true;

        const vehicleId = $('#editVehicleId').val();
        const type = $('#editVehicleType').val().trim();
        const model = $('#editVehicleModel').val().trim();
        const licensePlate = $('#editLicensePlate').val().trim();

        if (type === '') {
            $('#editVehicleTypeError').text('Type is required.');
            $('#editVehicleType').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editVehicleTypeError').text('');
            $('#editVehicleType').css('border-color', '#ccc');
        }

        if (model === '') {
            $('#editVehicleModelError').text('Model is required.');
            $('#editVehicleModel').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editVehicleModelError').text('');
            $('#editVehicleModel').css('border-color', '#ccc');
        }

        if (licensePlate === '') {
            $('#editLicensePlateError').text('License Plate is required.');
            $('#editLicensePlate').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editLicensePlateError').text('');
            $('#editLicensePlate').css('border-color', '#ccc');
        }

        if (!isValid) return;

        // Prepare data
        const data = {
            vehicleType: type,
            status: 'AVAILABLE',
            licensePlate: licensePlate
        };

        // AJAX PUT request to update vehicle
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/vehicles/${vehicleId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showAlert('editVehicleAlert', 'Vehicle updated successfully!', 'success');
                fetchVehicles();
                // Close modal after short delay
                setTimeout(() => {
                    $('#editVehicleModal').hide();
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
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/equipment',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
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
            tbody.append('<tr><td colspan="5" style="text-align:center;">No equipment available.</td></tr>');
            return;
        }

        equipmentList.forEach(equipment => {
            const row = `<tr>
                            <td>${equipment.id}</td>
                            <td>${equipment.serialNumber}</td>
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

        // Simple validation
        let isValid = true;

        const name = $('#equipmentName').val().trim();
        const type = $('#equipmentType').val().trim();
        const status = $('#equipmentStatus').val();

        if (name === '') {
            $('#equipmentNameError').text('Name is required.');
            $('#equipmentName').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#equipmentNameError').text('');
            $('#equipmentName').css('border-color', '#ccc');
        }

        if (type === '') {
            $('#equipmentTypeError').text('Type is required.');
            $('#equipmentType').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#equipmentTypeError').text('');
            $('#equipmentType').css('border-color', '#ccc');
        }

        if (!status) {
            $('#equipmentStatusError').text('Status is required.');
            $('#equipmentStatus').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#equipmentStatusError').text('');
            $('#equipmentStatus').css('border-color', '#ccc');
        }

        if (!isValid) return;

        // Prepare data
        const data = {
            serialNumber: name,
            equipmentType: type,
            status: status
        };

        // AJAX POST request to add equipment
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/equipment',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showAlert('addEquipmentAlert', 'Equipment added successfully!', 'success');
                fetchEquipment();
                // Close modal after short delay
                setTimeout(() => {
                    $('#addEquipmentModal').hide();
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
        const equipmentId = $(this).data('id');

        // Fetch equipment details
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/equipment/${equipmentId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(equipment) {
                $('#editEquipmentId').val(equipment.id);
                $('#editEquipmentName').val(equipment.serialNumber);
                $('#editEquipmentType').val(equipment.equipmentType);
                $('#editEquipmentStatus').val(equipment.status);
                $('#editEquipmentModal').show();
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

        // Simple validation
        let isValid = true;

        const equipmentId = $('#editEquipmentId').val();
        const name = $('#editEquipmentName').val().trim();
        const type = $('#editEquipmentType').val().trim();
        const status = $('#editEquipmentStatus').val();

        if (name === '') {
            $('#editEquipmentNameError').text('Name is required.');
            $('#editEquipmentName').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editEquipmentNameError').text('');
            $('#editEquipmentName').css('border-color', '#ccc');
        }

        if (type === '') {
            $('#editEquipmentTypeError').text('Type is required.');
            $('#editEquipmentType').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editEquipmentTypeError').text('');
            $('#editEquipmentType').css('border-color', '#ccc');
        }

        if (!status) {
            $('#editEquipmentStatusError').text('Status is required.');
            $('#editEquipmentStatus').css('border-color', '#dc3545');
            isValid = false;
        } else {
            $('#editEquipmentStatusError').text('');
            $('#editEquipmentStatus').css('border-color', '#ccc');
        }

        if (!isValid) return;

        // Prepare data
        const data = {
            serialNumber: name,
            equipmentType: type,
            status: status
        };

        // AJAX PUT request to update equipment
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/equipment/${equipmentId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showAlert('editEquipmentAlert', 'Equipment updated successfully!', 'success');
                fetchEquipment();
                // Close modal after short delay
                setTimeout(() => {
                    $('#editEquipmentModal').hide();
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
            // AJAX DELETE request to delete equipment
            $.ajax({
                url: `http://localhost:8080/green-shadow/api/v1/equipment/${equipmentId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
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
    $.ajax({
        url: 'http://localhost:8080/green-shadow/api/v1/logs',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        },
        success: function(data) {
            populateLogsTable(data);
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch logs.';
            showAlert('logAlert', error, 'danger');
        }
    });
}

/**
 * Function to populate Logs table.
 * @param {Array} logs - Array of log objects.
 */
function populateLogsTable(logs) {
    const tbody = $('#logTableBody');
    tbody.empty();

    if (logs.length === 0) {
        tbody.append('<tr><td colspan="7" style="text-align:center;">No logs available.</td></tr>');
        return;
    }

    logs.forEach(log => {
        const row = `<tr>
                        <td>${log.id}</td>
                        <td>${log.date}</td>
                        <td>${log.details}</td>
                        <td>${log.observedImage || 'N/A'}</td>
                        <td>${log.fields.map(field => field.name).join(', ') || 'N/A'}</td>
                        <td>${log.crops.map(crop => crop.name).join(', ') || 'N/A'}</td>
                        <td>${log.staffs.map(staff => staff.name).join(', ') || 'N/A'}</td>
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
    populateDropdowns(); // Populate dropdowns for Fields, Crops, and Staffs
    $('#addLogModal').show();
});

/**
 * Event listener for Add Log form submission.
 */
$('#addLogForm').on('submit', function(e) {
    e.preventDefault();

    // Gather form data
    const data = {
        date: $('#logDate').val(),
        details: $('#logDetails').val().trim(),
        observedImage: $('#observedImage').val().trim(),
        fields: $('#logFields').val().map(id => ({ id })),
        crops: $('#logCrops').val().map(id => ({ id })),
        staffs: $('#logStaffs').val().map(id => ({ id }))
    };

    // AJAX POST request to add log
    $.ajax({
        url: 'http://localhost:8080/green-shadow/api/v1/logs',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('addLogAlert', 'Log added successfully!', 'success');
            fetchLogs();
            setTimeout(() => {
                $('#addLogModal').hide();
                clearForm($('#addLogForm'));
                clearAlert('addLogAlert');
            }, 1500);
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to add log.';
            showAlert('addLogAlert', error, 'danger');
        }
    });
});

/**
 * Event delegation for Edit Log buttons.
 */
$(document).on('click', '.edit-log-btn', function() {
    const logId = $(this).data('id');

    // Fetch log details
    $.ajax({
        url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        },
        success: function(log) {
            $('#editLogId').val(log.id);
            $('#editLogDate').val(log.date);
            $('#editLogDetails').val(log.details);
            $('#editObservedImage').val(log.observedImage);
            $('#editLogFields').val(log.fields.map(field => field.id));
            $('#editLogCrops').val(log.crops.map(crop => crop.id));
            $('#editLogStaffs').val(log.staffs.map(staff => staff.id));
            $('#editLogModal').show();
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to fetch log details.';
            showAlert('logAlert', error, 'danger');
        }
    });
});

/**
 * Event listener for Edit Log form submission.
 */
$('#editLogForm').on('submit', function(e) {
    e.preventDefault();

    // Gather form data
    const logId = $('#editLogId').val();
    const data = {
        date: $('#editLogDate').val(),
        details: $('#editLogDetails').val().trim(),
        observedImage: $('#editObservedImage').val().trim(),
        fields: $('#editLogFields').val().map(id => ({ id })),
        crops: $('#editLogCrops').val().map(id => ({ id })),
        staffs: $('#editLogStaffs').val().map(id => ({ id }))
    };

    // AJAX PUT request to update log
    $.ajax({
        url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('editLogAlert', 'Log updated successfully!', 'success');
            fetchLogs();
            setTimeout(() => {
                $('#editLogModal').hide();
                clearForm($('#editLogForm'));
                clearAlert('editLogAlert');
            }, 1500);
        },
        error: function(xhr) {
            const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update log.';
            showAlert('editLogAlert', error, 'danger');
        }
    });
});

/**
 * Event delegation for Delete Log buttons.
 */
$(document).on('click', '.delete-log-btn', function() {
    const logId = $(this).data('id');
    if (confirm('Are you sure you want to delete this log?')) {
        // AJAX DELETE request to delete log
        $.ajax({
            url: `http://localhost:8080/green-shadow/api/v1/logs/${logId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            success: function(response) {
                showAlert('logAlert', 'Log deleted successfully!', 'success');
                fetchLogs();
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to delete log.';
                showAlert('logAlert', error, 'danger');
            }
        });
    }
});

/**
 * Initialize Logs functionality.
 */
function initializeLogs() {
    fetchLogs();
}

// Call initializeLogs during dashboard initialization
initializeLogs();
