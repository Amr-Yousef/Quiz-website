function getAnswer() {
    answers = [];
    $('input[name="answer"]:checked').each(function () {
        answers.push($("#" + $(this).val() + "").val());
    });
    return answers;
}

function submitQuestion() {
    // let form = $('#question-form').serializeArray();

    let data = {
        title: $('#title').val(),
        tfradio: $('input[name="tfradio"]:checked').val(),
        choices: [  // There is probably a better way to do this
            $('#a').val(),
            $('#b').val(),
            $('#c').val(),
            $('#d').val()
        ], 
        answer: getAnswer(),
    };

    $.ajax({
        url: 'http://127.0.0.1:8000/api/question',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (data) {
            alert("success");
            console.log(form);
            console.log(data)
        }
    });
    return false;
}