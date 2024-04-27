endpoint = 'http://127.0.0.1:8000'
$(document).ready(function () {
    $('input[type=radio][name=tfradio]').change(function () {  // This looks ugly, and when things look ugly then there is probably a better way to do it.
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

    $("#title").on('input', function () {
        updatePreview();
    });

    // Prevents the user from pressing enter to submit the form.
    // TODO: When pressing enter it should go to the next field.
    $(":text").keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});


// Completely my own idea and didn't even think of copying a code from Stackoverflow from 2011. https://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
$("#title").keydown(function (e) {
    if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);
        var value = $this.val();

        // set textarea value to: text before caret + tab + text after caret
        $this.val(value.substring(0, start)
            + "\t"
            + value.substring(end));

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
    }
});

function getAnswer() {
    answers = [];
    $('input[name="answer"]:checked').each(function () {
        answers.push($("#" + $(this).val() + "").val());
    });
    return answers;
}

function getChoices() {
    let choices = [];
    choices = [
        $("#a").val().trim(),
        $("#b").val().trim(),
        $("#c").val().trim(),
        $("#d").val().trim()
    ]

    var filtered = choices.filter(function (e) {
        return e != ""
    });

    return filtered;
}

function submitQuestion() {

    // TODO: Add validation to this form.
    if (validateForm()) {
        return false;
    }

    let choices = [];
    let trueOrFalse = $('input[type=radio][name=tfradio]:checked').val();

    if (trueOrFalse == 'yes') {  // There is probably a better way to do this. Perhaps some loop that will generalize this part more, allowing for flexible number of choices.
        choices = [$("#a").val(), $("#b").val()];
    } else {
        choices = getChoices();
    }

    let data = {
        set: $("#questionsSet").val(),
        title: $('#title').val(),
        tfradio: $('input[name="tfradio"]:checked').val(),
        choices: choices,
        answer: getAnswer(),
        explanation: $('#explanation').val()
    };

    $.ajax({
        url: endpoint + '/api/question',
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
    
    let setCode = $("#questionsSet").val();
    $('#question-form').trigger("reset");
    $("#questionsSet").val(setCode);  // Saves the set code so that the user doesn't have to re-enter it.

    // In case true or false is selected, this will make sure the form is reset correctly.
    $("#a").val('');
    $("#a").removeAttr('disabled');
    $("#b").val('');
    $("#b").removeAttr('disabled');

    $("#c").parent().show();
    $("#d").parent().show();

    $("#previewText").empty();
}

// Just a really basic validation.
function validateForm() {
    let setTitle = $("#setTitle");
    let title = $('#questionTitle');
    let tfradio = $('input[name="tfradio"]:checked').val()
    let choices = $('#choicesTitle');
    let choicesArr = getChoices();
    let answer = getAnswer();

    flag = false;

    $(".error-message").remove() // Remove all error messages before validating so that it resets correctly.

    if (!validateField($("#questionsSet"))) {
        errorMsg(setTitle, "Please enter a set.");
        flag = true;
    }

    if (!validateField($("#title"))) {
        errorMsg(title, "Please enter a title.");
        flag = true;
    }

    if (tfradio == "no" && choicesArr.length != 4) {
        errorMsg(choices, "Please fill in all the choices.");
        flag = true;
    } else if (answer.length == 0) {
        errorMsg(choices, "Please choose an answer.");
        flag = true;
    }

    return flag;
}

function validateField(field) {
    if (!(Array.isArray(field))) {
        field = field.val().trim();
    }

    if (field == null || field == "") {
        return false;
    }
    return true;
}

function errorMsg(element, msg) {
    if (msg == "remove") {
        element.next().remove();
        return true;
    }
    errMsg = `<span class="error-message">* ${msg}</span>`;
    element.after(errMsg);
}

function updatePreview() {
    let regex = /```([^]*)```/gm;
    let input = $('#title').val();

    regexSelection = regex.exec(input);

    if (regexSelection != null) {
        let match = regexSelection[1];
        var codeStartIndex = regexSelection.index;
        var codeLength = regexSelection[0].length;


        var language = match.split("\n")[0];
        let code = match.split("\n").slice(1).join("\n");

        var finalCode = `<pre><code class="language-${language}">${code}</code></pre>`;
    }


    if (finalCode != null) {
        before = `<pre>${input.substring(0, codeStartIndex)}</pre>`;
        after = `<pre>${input.substring(codeStartIndex + codeLength)}</pre>`;
        final = before + finalCode + after;

        $('#previewText').html(final);
        Prism.highlightElement($(`.language-${language}`)[0]);
        $(`.language-${language}`).addClass("code-block");
    }
    else {
        $("#previewText").html(input);
    }

}
