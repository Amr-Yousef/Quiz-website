questions = [];
questionAnswer = [];
userAnswers = [];
questionNumber = 0;  // This is a solution but it doesn't feel like the optimal one.

alphabet = ['a', 'b', 'c', 'd'];

settings = JSON.parse(sessionStorage.getItem("fields"));

endpoint = 'http://127.0.0.1:8000'

$(document).ready(function () {
    let seturl = settings.set + '/' + settings.numberOfQuestions;
    $.ajax({
        url: endpoint + '/api/quiz/set/questions/' + seturl,
        type: 'GET',
        success: function (data) {
            questions = data;
            displayQuestion(questions[questionNumber]);


            if (questionNumber == questions.length - 1) {  // If one question was requested, then the next button will change accordingly.
                $('#next').text('Show result');
            }
        }
    });

    $('#next').click(function () {

        storeAnswer();

        if (questionNumber < questions.length - 1) {  // Making the value -2 instead of -1 will execute the code inside the if statement on the last question.
            questionNumber++;
            displayQuestion(questions[questionNumber]);

            if (questionNumber == questions.length - 1) {
                $('#next').text('Show result');
            }

        } else {
            sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
            sessionStorage.setItem("questions", JSON.stringify(questions));
            window.location.href = "./quizend.html";
        }
    });

    $("#previous").click(function () {  // TODO: Make the website reload the previous question's answers.
        if (questionNumber > 0) {
            questionNumber--;
            displayQuestion(questions[questionNumber]);
        }
    });
});


function shuffle(array) {  // Totally did not copy this from stack overflow. Also: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function compareArr(arr1, arr2) {  // Again, totally did not copy this from stack overflow. https://stackoverflow.com/questions/29648234/is-there-a-way-to-check-if-two-arrays-have-the-same-elements
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
}

function checkAnswer() {
    let checkedAnswer = [];
    $("[name='answer']").each(function () {
        if ($(this).is(':checked')) {
            checkedAnswer.push($("#" + $(this).val()).text());
        }
    });

    if (checkedAnswer.length == 0) {
        return -1;
    }

    if (compareArr(checkedAnswer, questionAnswer)) {
        return true;
    } else {
        return false;
    }
}

function displayQuestion(question) {
    resetChoices();

    let questionText = question.title;
    $('#q-title').text();
    let regex = /```([^]*)```/gm;

    regexSelection = regex.exec(questionText);

    if (regexSelection != null) {
        let match = regexSelection[1];
        var codeStartIndex = regexSelection.index;
        var codeLength = regexSelection[0].length;


        var language = match.split("\n")[0];
        let code = match.split("\n").slice(1).join("\n");

        var finalCode = `<pre><code class="language-${language}">${code}</code></pre>`;
    }


    if (finalCode != null) {
        before = `<pre>${questionText.substring(0, codeStartIndex)}</pre>`;
        after = `<pre>${questionText.substring(codeStartIndex + codeLength)}</pre>`;
        final = before + finalCode + after;

        $('#q-title').html(final);
        Prism.highlightElement($(`.language-${language}`)[0]);
        $(`.language-${language}`).addClass("code-block");
    } else {
        $('#q-title').text(questionText);
    }


    $('#uuid').text(question.id);
    $('#questionNo').text(questionNumber + 1);
    $('#totalQuestions').text(questions.length);


    let choices = JSON.parse(String(question.choices));
    questionAnswer = JSON.parse(String(question.answer));

    shuffle(choices);

    for (let i = choices.length; i < 4; i++) {  // Removes extra empty choices.
        $("#" + alphabet[i]).parent().hide();
    }

    $.each(choices, function (index, value) {  // Displays the choices.
        $("#" + alphabet[index]).text(value);
    });

    if (questionNumber < questions.length - 1) {
        $('#next').text('Next');
    }

    showCurrentAnswers();
}

function resetChoices() {
    $("[name='answer']").each(function () {
        $(this).prop('checked', false);
    });

    for (let i = 0; i < 4; i++) {  // Resets the choices fields to their default amount(4).
        $("#" + alphabet[i]).parent().show();
    }
}

function storeAnswer() {
    let checkedAnswer = [];
    $("[name='answer']").each(function () {
        if ($(this).is(':checked')) {
            checkedAnswer.push($("#" + $(this).val()).text());
        }
    });

    questionTitle = questions[questionNumber].title;

    $.each(userAnswers, function (index, value) {  // Checks if the question was already answered. And if it was then it will remove the old answer to be replaced with the new one later on.
        if (value.question == questionTitle) {
            userAnswers.splice(index, 1);
        }
    });

    userAnswers.push({
        "question": questionTitle,
        "answer": checkedAnswer
    });
}

function showCurrentAnswers() {
    questionTitle = $("#q-title").text();

    $.each(userAnswers, function (index, value) {
        if (value.question.localeCompare(questionTitle) == 0) {
            $.each(value.answer, function (index, value) {
                $("[name='answer']").each(function () {
                    if ($("#" + $(this).val()).text().localeCompare(value) == 0) {
                        $(this).prop('checked', true);
                    }
                });
            });
        }
    });
}

