$(document).ready(function () {
    $('#signInForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Capture form data
        const email = $('#email').val();
        const password = $('#password').val();

        // Validation
        if (!email || !password) {
            $('#responseMessage')
                .text('Email and Password are required.')
                .css('color', 'red')
                .show();
            return;
        }

        const signInDTO = {
            email: email,
            password: password,
        };

        // Send AJAX request
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/auth/signIn', // Backend endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(signInDTO),
            success: function (response) {
                console.log(response); // Debugging purposes
                localStorage.setItem('jwtToken', response.token); // Store the JWT token
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            },
            error: function (xhr) {
                console.error(xhr); // Debugging purposes
                const errorMessage = xhr.responseJSON
                    ? xhr.responseJSON.message
                    : 'Login failed. Please try again.';
                $('#responseMessage')
                    .text(errorMessage)
                    .css('color', 'red')
                    .show();
            },
        });
    });
});

$('#signUpForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Capture form data
        const email = $('#email').val();
        const password = $('#password').val();
        const role = $('#role').val();

        // Create the payload for the AJAX request
        const signUpDTO = {
            email: email,
            password: password,
            role: role,
        };

        // Send the data to the backend
        $.ajax({
            url: 'http://localhost:8080/green-shadow/api/v1/auth/signUp', // Backend endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(signUpDTO),
            success: function (response) {
                console.log(response); // Debugging purposes
                localStorage.setItem('jwtToken', response.token); // Store the JWT token
                alert('Sign-up successful!');
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            },
            error: function (xhr) {
                console.error(xhr);
                const errorMessage = xhr.responseJSON
                    ? xhr.responseJSON.message
                    : 'Sign-up failed. Try again.';
                $('#responseMessage')
                    .text(errorMessage)
                    .css('color', 'red')
                    .show(); // Display error message
            },
        });
    });
