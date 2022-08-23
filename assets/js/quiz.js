questionAnswer = [];

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
  

$.ajax({
    url: 'http://127.0.0.1:8000/api/quiz/random',
    type: 'GET',
    success: function (data) {
        $('#q-title').text(data.title);
        $('#uuid').text(data.id);
        
        alphabet = ['a', 'b', 'c', 'd'];
        choices = JSON.parse(String(data.choices));
        questionAnswer = JSON.parse(String(data.answer));

        shuffle(choices);

        for (let i = choices.length; i < 4; i++) {  // Removes extra empty choices.
            $("#" + alphabet[i]).parent().hide();
        }

        $.each(choices, function(index, value) {
            $("#" + alphabet[index]).text(value);
        });
    }
});

function checkAnswer(){
    let checkedAnswer = [];
    $("[name='answer']").each(function() {
        if ($(this).is(':checked')) {
            checkedAnswer.push($("#" + $(this).val()).text());
        }
    });

    if (checkedAnswer.length == 0) {
        alert("Please select an answer.");
        return;
    }

    console.log(checkedAnswer);
    console.log(questionAnswer);
    if(compareArr(checkedAnswer, questionAnswer)) {
        alert("Correct!");
    } else {
        alert("Nope. Try again!");
    }
}