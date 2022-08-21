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

$.ajax({
    url: 'http://127.0.0.1:8000/api/quiz/random',
    type: 'GET',
    success: function (data) {
        $('#q-title').text(data.title);
        $('#uuid').text(data.id);
        
        alphabet = ['a', 'b', 'c', 'd'];
        choices = JSON.parse(String(data.choices));

        console.log("Original: " + choices);
        shuffle(choices);
        console.log("Shuffled: " + choices);

        $.each(choices, function(index, value) {
            $("#" + alphabet[index]).text(value);
        });

        
        
    }
});