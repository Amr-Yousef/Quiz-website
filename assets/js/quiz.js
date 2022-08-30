questions = [];
questionAnswer = [];
questionNumber = 0;
alphabet = ['a', 'b', 'c', 'd'];
settings = JSON.parse(sessionStorage.getItem("fields"));

$(document).ready(function() {
    $.ajax({
        url: 'http://127.0.0.1:8000/api/quiz/random/' + settings['numberOfQuestions'],
        type: 'GET',
        success: function (data) {
            questions = data;
            displayQuestion(questions[questionNumber]);
        }
    });

    $('#next').click(function() {
        if(checkAnswer() == true) {
            alert("Correct!");
        } else if (checkAnswer() == false) {
            alert("Incorrect!");
        } else {
            alert("Please select an answer.");
        }


        if (questionNumber < questions.length - 1) {  // Making the value -2 instead of -1 will execute the code inside the if statement on the last question.
            questionNumber++;
            displayQuestion(questions[questionNumber]);
        } else {
            $('#next').hide();
        }
    });

    $("#previous").click(function() {  // TODO: Make the website reload the previous question's answers.
        if (questionNumber > 0) {
            questionNumber--;
            displayQuestion(questions[questionNumber]);
        }
    });
});



function shuffle(array) {  // Totally did not copy this from stack overflow. Also: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length,  randomIndex;
  
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

function compareArr( arr1, arr2 ) {  // Again, totally did not copy this from stack overflow. https://stackoverflow.com/questions/29648234/is-there-a-way-to-check-if-two-arrays-have-the-same-elements
    return  $( arr1 ).not( arr2 ).length === 0 && $( arr2 ).not( arr1 ).length === 0;  
}

function checkAnswer(){
    let checkedAnswer = [];
    $("[name='answer']").each(function() {
        if ($(this).is(':checked')) {
            checkedAnswer.push($("#" + $(this).val()).text());
        }
    });

    if (checkedAnswer.length == 0) {
        return -1;
    }

    if(compareArr(checkedAnswer, questionAnswer)) {
        return true;
    } else {
        return false;
    }
}

function displayQuestion(question) {
    resetChoices();

    $('#q-title').text(question.title);
    $('#uuid').text(question.id);
    $('#questionNo').text(questionNumber + 1);
    $('#totalQuestions').text(questions.length);
    

    let choices = JSON.parse(String(question.choices));
    questionAnswer = JSON.parse(String(question.answer));

    shuffle(choices);

    for (let i = choices.length; i < 4; i++) {  // Removes extra empty choices.
        $("#" + alphabet[i]).parent().hide();
    }

    $.each(choices, function(index, value) {  // Displays the choices.
        $("#" + alphabet[index]).text(value);
    });
}

function resetChoices() {
    $("[name='answer']").each(function() {
        $(this).prop('checked', false);
    });

    for (let i = 0; i < 4; i++) {  // Resets the choices fields to their default amount(4).
        $("#" + alphabet[i]).parent().show();
    }
}

