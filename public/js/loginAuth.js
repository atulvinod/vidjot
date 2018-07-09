function subm() {
    var form = document.forms[0];
    console.log("Submit");
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var pass = document.getElementById("pass").value;
    var confirmpass = document.getElementById("confirmpass").value;
    var email = document.getElementById("email").value;
    if (filter.test(email)) {
        if (pass == confirmpass) {
            form.submit();
            console.log(pass);
        } else {
            alert("Passwords dont match");
        }
    } else {
        alert("Enter a valid email");
    }
}