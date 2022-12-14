userAnswers = JSON.parse(sessionStorage.getItem("userAnswers"));
questions = JSON.parse(sessionStorage.getItem("questions"));
settings = JSON.parse(sessionStorage.getItem("fields"));

counter = 0;  // find an alternative to this. Doesn't feel like the optimal solution.

$(document).ready(function() {

    $.each(questions, function(index, value) {
        let question = value.title;
        let userAnswer = userAnswers[index].answer;
        let correctAnswer = JSON.parse(value.answer);

        let status = "Wrong!";
        let statusClass = "wrong";

        explanation = value.explanation;

        let correct = compareArr(userAnswer, correctAnswer);

        if(correct) {
            counter++;

            status = "Correct!";
            statusClass = "correct";
        }

        if(explanation == null) {
            explanation = "No explanation provided.";
        }

        e = `
        <div class="row">
            <div class="main">
                <div class="number" id="number">${index + 1}</div>
                <div class="title" id="title">${question}</div>
                <div class="default-cell" id="userAnswer">${userAnswer}</div>
                <div class="default-cell" id="correctAnswer">${correctAnswer}</div>
                <div class="default-cell ${statusClass}" id="status">${status}</div>
                <img src="../assets/svg/Arrow.svg" class="arrow" alt="explanation" id="showExplanation${index + 1}">
            </div>
            <div class="explanation">
                <div class="explanation-title">Explanation:</div>
                <div class="explanation-text">${explanation}</div>
            </div>
        </div>
        `

        $(".table-rows").append(e);
    });

    $("#current").text(counter);
    $("#total").text(questions.length);
    $(".percentage").text(Math.round((counter / questions.length) * 100) + "%");


    $(".arrow").click(function() {

        let explanationElement = $(this).parent().parent().find(".explanation");  // There has to be a better way to do this. THERE HAS TO BE!
        let arrow = $(this);
        let row = arrow.parent().parent();

        explanationElement.slideToggle('slow', function() {
            explanationElement.find(".explanation-text").slideToggle('slow');
            
            
        if($(arrow).hasClass("active")) {  // This looks ugly but for the end result it's worth it
            arrow.removeClass("active");
            arrow.css("rotate", "0deg");

            row.css("margin-bottom", "1rem");  // Makes the transition a little bit smoother, but it's still not perfect.
        } else {
            arrow.addClass("active");
            arrow.css("rotate", "180deg");

            row.animate({
                marginBottom: "0"
            }, "slow");
        }
        });


    });

    $("#share").click(function() {
        popUp("Share quiz link!", copyLink());
        
        $("#buttonAction").click(function() {
            $("#shareLink").select();
            document.execCommand("copy");

            $(this).text("Copied!");
        });
    });

});

function compareArr( arr1, arr2 ) {  // Again, totally did not copy this from stack overflow. https://stackoverflow.com/questions/29648234/is-there-a-way-to-check-if-two-arrays-have-the-same-elements
    return  $( arr1 ).not( arr2 ).length === 0 && $( arr2 ).not( arr1 ).length === 0;  
}

function popUp(title, value) {
    // A more generic popup function would be nice, but this works for now.
    popUpHTML = `
    <div class="pop-up-container">
        <div class="pop-up">
            <div class="exit-svg">
                <img src="../assets/svg/cross.svg" alt="Close" id="popUpExit">
            </div>
            <div class="title">${title}</div>
            <div class="pop-up-content">
                <div class="input-container">
                    <input class="default-input" type="text" id="shareLink" readonly="readonly" value="${value}">
                </div>
                <div class="default-button" id="buttonAction">Copy</div>
            </div>
        </div>
    </div>
    `

    $("body").prepend(popUpHTML);

    $("#popUpExit").click(function() {
        $(".pop-up-container").remove();
    });
}

function copyLink() {
    let link = "http://localhost/quiz/html/roquiz.html"
    let parameters = `?setCode=${settings.set}&questionsNo=${settings.numberOfQuestions}&difficulty=${settings.difficulty}`;
    return link + parameters;
}