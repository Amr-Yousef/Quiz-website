$(document).ready(function () {
    $('input[type=radio][name=tfradio]').change(function() {  // This looks ugly, and when things look ugly then there is probably a better way to do it.
        if (this.value == 'yes') {
            $("#a").val("True");
            $("#a").attr('disabled', true);
            $("#b").val("False");
            $("#b").attr('disabled', true);

            $("#c").parent().hide();
            $("#d").parent().hide();
        }
        else if (this.value == 'no') {
            $("#a").val('');
            $("#a").removeAttr('disabled');
            $("#b").val('');
            $("#b").removeAttr('disabled');

            $("#c").parent().show();
            $("#d").parent().show();
        }
    });
});


function getAnswer() {
    answers = [];
    $('input[name="answer"]:checked').each(function () {
        answers.push($("#" + $(this).val() + "").val());
    });
    return answers;
}

function submitQuestion() {

    let choices = [];
    let trueOrFalse = $('input[type=radio][name=tfradio]:checked').val();

    if(trueOrFalse == 'yes') {  // There is probably a better way to do this.
        choices = [$("#a").val(), $("#b").val()];
    } else {
        choices = [
            $("#a").val(),
            $("#b").val(),
            $("#c").val(),
            $("#d").val()
        ]
    }

    let data = {
        title: $('#title').val(),
        tfradio: $('input[name="tfradio"]:checked').val(),
        choices: choices, 
        answer: getAnswer(),
    };

    $.ajax({
        url: 'http://127.0.0.1:8000/api/question',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (response) {
            
            resetForm();
            alert("Question has been submitted successfully!");
        }
    });
    return false;
}

function resetForm() {
    $('#question-form').trigger("reset");

    $("#a").val('');
    $("#a").removeAttr('disabled');
    $("#b").val('');
    $("#b").removeAttr('disabled');

    $("#c").parent().show();
    $("#d").parent().show();
}

