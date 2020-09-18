$(document).ready(function () {

    $('.register').invisible();

    // Declare funcs
    toggle();
    register();
    login();

})

// Toggles between Login and Register form
let toggle = () => {
    $('.registerBtn').on('click', function () {
        $('.register').visible();
        $('.login').invisible();
    })

    $('.btloginBtn').on('click', function () {
        $('.login').visible();
        $('.register').invisible();
    })
}

// Register function
let register = () => {

    let form = $("#registerData");

    // Specify validation rules
    form.validate({

        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8
            }
        },
        messages: {
            name: "This field is required",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
            },
            email: "Please enter a valid email address"
        }
    });

    // Submits form with data
    form.on('submit', function (e) {

        e.preventDefault();

        let obj = form.serializeArray();
        let obj_data = {};

        // Converts form data to javascript object
        $.each(obj, function (i, v) {
            obj_data[v.name] = v.value;
        });

        // Invoke AJAX call to /register
        $.ajax({
            type: 'post',
            url: '/api/register',
            contentType: 'application/json',
            data: JSON.stringify(obj_data),
            success: function (res) {
                if (!res)
                    alert('Invalid email or email already exists!');
                else {
                    alert('Successful!');
                    form.trigger("reset");
                    $('.register').invisible();
                    $('.login').visible();
                }
            }
        });

    });
}

// Login function
let login = () => {

    let form = $("#loginData");

    // Specify validation rules
    form.validate({

        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            }
        },
        messages: {
            password: "Please provide a password",
            email: "Please enter a valid email address"
        }
    });

    // Submits form with data
    form.on('submit', function (e) {

        e.preventDefault();

        let obj = form.serializeArray();
        let obj_data = {};

        // Converts form data to javascript object
        $.each(obj, function (i, v) {
            obj_data[v.name] = v.value;
        });

        //Invoke AJAX call to /auth
        $.ajax({
            type: 'post',
            url: '/api/auth',
            contentType: 'application/json',
            data: JSON.stringify(obj_data),
            success: function (res) {

                if (typeof (res.error) != undefined && res.error == 1)
                    alert(res.message + "!");
                else {
                    form.trigger("reset");
                    window.location.href = '/profile/' + res.name;
                }

            }
        });
    });
}

