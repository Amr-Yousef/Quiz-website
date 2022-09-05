userAnswers = JSON.parse(sessionStorage.getItem("userAnswers"));
questions = JSON.parse(sessionStorage.getItem("questions"));

$(document).ready(function() {

    console.log(userAnswers);
    console.log(questions);

    $("#showExplanation").click(function() {

        $(".explanation").toggle('slow', function() {
            $("#explanation").toggle('slow');
        });

        if($(this).hasClass("active")) {  // This looks ugly but for the end result it's worth it
            console.log("active");
            $(this).removeClass("active");
            $(this).css("rotate", "0deg");
        } else {
            console.log("not active");
            $(this).addClass("active");
            $(this).css("rotate", "180deg");
        }

    });
});