function submitQuestion() {
    let form = $('#question-form').serializeArray();

    $.ajax({
        url: '../test.php',
        type: 'POST',
        data: form,
        success: function (data) {
            alert("success");
            console.log(form);
            // window.location.href = '../test.php';
        }
    });
    return false;
}